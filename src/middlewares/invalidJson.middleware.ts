import { PreconditionError } from '@/errors'
import { Request, Response } from 'express'

export const validateJson = (
  _req: Request,
  _res: Response,
  buf: Buffer,
  encoding: string,
) => {
  try {
    JSON.parse(buf.toString(encoding as BufferEncoding))
  } catch (e) {
    throw new PreconditionError('Invalid payload')
  }
}
