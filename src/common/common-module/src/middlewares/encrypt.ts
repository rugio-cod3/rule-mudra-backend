import config from '@/config/default'
import crypto, { Cipher } from 'crypto'
import { NextFunction, Request, Response } from 'express'
import { PreconditionError } from '../errors'
import { logger } from '../utils/logger'

const encrypt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { encryptionKey, encryptionIVKey } = config
    if (!encryptionKey || !encryptionIVKey) {
      throw new PreconditionError('Encryption secrets are missing')
    }

    const algorithm: string = 'aes-256-cbc'
    const key: string = encryptionKey
    const IV: Buffer = Buffer.from(encryptionIVKey)

    if (req.headers['x-encrypted'] == 'true') {
      res.json = (response) => {
        const responseStr: string = JSON.stringify(response)
        const cipher: Cipher = crypto.createCipheriv(
          algorithm,
          Buffer.from(key),
          IV,
        )
        let encryptedData: string = cipher.update(responseStr, 'utf8', 'hex')
        encryptedData += cipher.final('hex')
        res.removeHeader('Content-Length')
        res.set('Content-Type', 'application/octet-stream')
        res.set('x-encrypted', 'true')
        logger.info(
          'Encrypted data: ' + encryptedData + ' Endpoint: ' + req.url,
        )
        return res.send(encryptedData)
      }
    }
    next()
  } catch (error) {
    next(error)
  }
}
export default encrypt
