// consumers/razorpay.repayment.consumer.ts

import { config } from '@/config.server'
import { execSync } from 'child_process'
import crypto from 'crypto'
import fs from 'fs'
import { Kafka } from 'kafkajs'
import forge from 'node-forge'
import * as opossum from 'opossum'
import { IRazorpayKafkaConsumer } from '../interfaces/collection.interface'
import { consumerService } from '../services/consumer.service'
import { logger } from '../utils/logger'
const CircuitBreaker = opossum.default

// Configuration validation
const validateCertificates = () => {
  const certPaths = {
    key: config.razorpayKafkauserKey,
    cert: config.razorpayKafkauserCert,
    rootCA: config.razorpayKafkarootCaCert,
    intermediateCA: config.razorpayKafkaintermediateCaCert,
    brokerCA: config.razorpayKafkabrokerCert,
  }

  Object.entries(certPaths).forEach(([name, path]) => {
    if (!fs.existsSync(path)) {
      throw new Error(`Missing required certificate: ${name} at ${path}`)
    }
  })
}

// Kafka configuration
const kafka = new Kafka({
  clientId: config.razorpayKafkaClientId,
  brokers: [config.razorpayKafkaBroker],
  ssl: {
    rejectUnauthorized: true,
    key: Buffer.from(fs.readFileSync(config.razorpayKafkauserKey)),
    cert: Buffer.from(fs.readFileSync(config.razorpayKafkauserCert)),
    ca: [
      Buffer.from(fs.readFileSync(config.razorpayKafkarootCaCert)),
      Buffer.from(fs.readFileSync(config.razorpayKafkaintermediateCaCert)),
      Buffer.from(fs.readFileSync(config.razorpayKafkabrokerCert)),
    ],
  },
})

// Circuit breaker configuration
const circuit = new CircuitBreaker(consumerService.repaymentWebhook.bind(consumerService), {
  timeout: config.razorpayKafkaCircuitBreakerTimeout,
  errorThresholdPercentage: config.razorpayKafkaCircuitBreakerErrorThresholdPercentage,
  resetTimeout: config.razorpayKafkaCircuitBreakerResetTimeout,
})

circuit.fallback(() => Promise.reject('Webhook service unavailable'))
circuit.on('failure', error => logger.error('Circuit breaker triggered', { error }))

// Consumer setup
const consumer = kafka.consumer({
  groupId: config.razorpayKafkaGroupId,
  retry: {
    retries: config.razorpayKafkaMaxRetries,
    initialRetryTime: config.razorpayKafkaInitialRetryTime,
  },
  maxBytesPerPartition: config.razorpayKafkaMaxBytesPerPartition,
  heartbeatInterval: config.razorpayKafkaHeartbeatInterval,
})

// Message processing with local retry
const processMessage = async (message: IRazorpayKafkaConsumer) => {
  if (!['captured', 'failed'].includes(message.status)) {
    logger.info('Skipping non-captured/failed event at processMessage', {
      eventId: message.id,
      status: message.status,
    })
    return // Skip processing
  }
  const maxRetries = config.razorpayKafkaMaxRetries
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      await circuit.fire(message)
      logger.info('kafka message processed successfully', { messageId: message.id })
      return
    } catch (error) {
      attempt++
      if (attempt === maxRetries) {
        logger.error('Final processing failure', {
          messageId: message.id,
          error: error.message,
          attempts: attempt,
        })
        throw error
      }

      const delay = Math.pow(2, attempt) * 1000
      logger.warn('Retrying message', {
        messageId: message.id,
        attempt,
        nextRetryIn: `${delay}ms`,
      })

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// Consumer initialization
export const startRazorpayRepaymentConsumer = async (pid: number) => {
  validateCertificates()

  await consumer.connect()
  logger.info(`Kafka consumer connected successfully,${pid}`)

  await consumer.subscribe({
    topic: config.razorpayKafkaTopic,
    fromBeginning: false,
  })
  await consumer.run({
    partitionsConsumedConcurrently: 6, // Process partitions concurrently
    eachMessage: async ({ topic, partition, message, pause }) => {
      const resume = pause()
      try {
        logger.info(`📥 Received message at offset ${message.offset} (partition ${partition})`)
        const value = message.value?.toString()
        if (!value) throw new Error('Empty message')

        const decryptedData = await processKafkaMessage(message)
        logger.info(
          `Decrypted Data=========================:offset ${message.offset}, partition ${partition}`,
          decryptedData,
        )

        const data: IRazorpayKafkaConsumer = decryptedData

        await processMessage(data)

        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (Number(message.offset) + 1).toString(),
          },
        ])
        logger.info(`✅ Committed offset ${Number(message.offset) + 1} for partition ${partition}`)
      } catch (error) {
        logger.error(
          `❌ Error processing message at offset ${message.offset}, partition ${partition}`,
          error,
        )
        setTimeout(resume, 10000) // Backoff before resuming
      } finally {
        resume()
      }
    },
  })
}

const shutdown = async () => {
  try {
    await consumer.disconnect()
    logger.info('Kafka consumer disconnected')
    process.exit(0)
  } catch (error) {
    logger.error('Shutdown error', error)
    process.exit(1)
  }
}

const verifyEnvironment = () => {
  const requiredFiles = [config.razorpayKafkaPrivateKey, config.razorpayKafkaPublicKey]
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      throw new Error(`Missing required file: ${file}`)
    }
  })
}

const decryptRsaEncryptedKey = (): string => {
  verifyEnvironment()

  // Try OpenSSL first, fallback to forge
  try {
    return execSync(
      `openssl pkeyutl -decrypt -inkey ${config.razorpayKafkaPrivateKey} ` +
        `-in ${config.razorpayKafkaPublicKey} ` +
        `-pkeyopt rsa_padding_mode:pkcs1`,
    )
      .toString('utf-8')
      .trim()
  } catch (opensslError) {
    console.log('OpenSSL failed, trying node-forge...')
    try {
      const privateKey = forge.pki.privateKeyFromPem(
        fs.readFileSync(config.razorpayKafkaPrivateKey).toString('utf-8'),
      )
      return privateKey.decrypt(
        forge.util.decode64(fs.readFileSync(config.razorpayKafkaPublicKey).toString('base64')),
        'RSAES-PKCS1-V1_5',
      )
    } catch (forgeError) {
      console.error('All RSA decryption attempts failed')
      throw forgeError
    }
  }
}

export const decryptEncryptedData = (encryptedData: string): any => {
  verifyEnvironment()

  try {
    const aesKeyString = decryptRsaEncryptedKey()
    const key = Buffer.from(aesKeyString, 'utf-8')
    const iv = Buffer.alloc(16, 0)

    // Handle base64 padding
    let padded = encryptedData
    if (encryptedData.length % 4) {
      padded += '='.repeat(4 - (encryptedData.length % 4))
    }

    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(padded, 'base64')),
      decipher.final(),
    ])

    return JSON.parse(decrypted.toString('utf-8'))
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error('DECRYPTION_FAILED')
  }
}

export const processKafkaMessage = async (message: any) => {
  try {
    const value = message.value?.toString()
    if (!value) throw new Error('Empty message received')

    const decryptedData = value ? decryptEncryptedData(value) : value

    logger.info('Successfully decrypted message:', decryptedData)
    return decryptedData.data
  } catch (error) {
    console.error('Message processing failed:', error)
    throw error
  }
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

// Error handling
process.on('uncaughtException', error => {
  logger.error('Uncaught exception', error)
  shutdown().finally(() => process.exit(1))
})

process.on('unhandledRejection', reason => {
  logger.error('Unhandled promise rejection', { reason })
  shutdown().finally(() => process.exit(1))
})
