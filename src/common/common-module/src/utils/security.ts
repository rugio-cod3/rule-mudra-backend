import bcrypt from 'bcrypt'
import {
  Cipher,
  createCipheriv,
  createDecipheriv,
  createHmac,
  Decipher,
  timingSafeEqual,
} from 'crypto'
import { EncryptionAlgos, HashMethods } from '../enums/security.enum'
import { ISecurityUtils } from '../interfaces/securityUtils.interface'
import { logger } from './logger'

export class SecurityUtils implements ISecurityUtils {
  private static instance: SecurityUtils
  private readonly DEFAULT_SALT_ROUNDS = 4
  private readonly ENCRYPTION_KEY = 'k5Hf9sXa1LzRq83YbM7D4pWq2vXc8JYe'
  private readonly ENCRYPTION_IV = '7Tu9XpQs4FbL0wVe'
  private readonly HMAC_KEY = Buffer.from(
    'rD9kRzZqGpX2cfsPzyTeR7Xlhq3dO7bZZ1bWcWg5qPY=',
    'base64',
  )

  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new SecurityUtils()
    }

    return this.instance
  }

  encrypt(algorithm: EncryptionAlgos, value: string): string {
    switch (algorithm) {
      case EncryptionAlgos.AES_256_CBC: {
        const cipher: Cipher = createCipheriv(
          algorithm,
          Buffer.from(this.ENCRYPTION_KEY),
          this.ENCRYPTION_IV,
        )
        let encryptedData: string = cipher.update(value, 'utf8', 'hex')
        encryptedData += cipher.final('hex')
        logger.info('Encrypted data from SecurityUtils: ' + encryptedData)
        return encryptedData
      }
      default:
        throw new Error('No Algorithm provided for encryption')
    }
  }

  decrypt(algorithm: EncryptionAlgos, value: string): string {
    switch (algorithm) {
      case EncryptionAlgos.AES_256_CBC: {
        const decipher: Decipher = createDecipheriv(
          algorithm,
          Buffer.from(this.ENCRYPTION_KEY),
          this.ENCRYPTION_IV,
        )
        try {
          let decryptedData = decipher.update(value, 'hex', 'utf8')
          decryptedData += decipher.final('utf8')
          logger.info('Decrypted data from SecurityUtils: ' + decryptedData)
          return decryptedData
        } catch (error) {
          logger.error('Invalid encrypted value from security.utils')
          return null
        }
      }
      default:
        logger.error('No Algorithm provided for decryption')
        return null
    }
  }

  async createHash(
    method: HashMethods,
    value: string,
    saltRounds?: number,
  ): Promise<string> {
    switch (method) {
      case HashMethods.BCRYPT: {
        const salt = await bcrypt.genSalt(
          saltRounds || this.DEFAULT_SALT_ROUNDS,
        )
        return await bcrypt.hash(value, salt)
      }
      case HashMethods.HMAC_SHA256:
        // Implementation required
        return createHmac('sha256', this.HMAC_KEY).update(value).digest('hex')
    }
  }

  async compareHash(
    method: HashMethods,
    value: string,
    hash: string,
  ): Promise<boolean> {
    switch (method) {
      case HashMethods.BCRYPT:
        return await bcrypt.compare(value, hash)

      case HashMethods.HMAC_SHA256:
        return timingSafeEqual(
          Buffer.from(value, 'hex'),
          Buffer.from(hash, 'hex'),
        )
      default:
        logger.error('No method found')
        return false
    }
  }
}