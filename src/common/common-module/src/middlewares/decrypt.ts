import crypto, { Decipher } from 'crypto'
import { NextFunction, Request, Response } from 'express'
import { BadRequestError, PreconditionError } from '../errors'

import config from '@/config/default'
import { isObjEmpty } from '../helpers/helpers'
import { logger } from '../utils/logger'

const decrypt = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { encryptionKey, encryptionIVKey } = config
    if (!encryptionKey || !encryptionIVKey) {
      throw new PreconditionError('Encryption secrets are missing')
    }

    if (!(typeof req.body === 'string') && isObjEmpty(req.body)) {
      return next()
    }

    const algorithm: string = 'aes-256-cbc'
    const key: string = encryptionKey
    const IV: Buffer = Buffer.from(encryptionIVKey)

    if (req.headers['x-encrypted'] === 'true') {
      const encryptedData: string = req.body
      const decipher: Decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(key),
        IV,
      )
      try {
        let decryptedData = decipher.update(encryptedData, 'hex', 'utf8')
        decryptedData += decipher.final('utf8')
        logger.info(
          'Decrypted data: ' + decryptedData + ' Endpoint: ' + req.url,
        )
        req.body = JSON.parse(decryptedData)
      } catch (error) {
        throw new BadRequestError('Invalid encrypted value')
      }
    }
    next()
  } catch (error) {
    next(error)
  }
}

export default decrypt
