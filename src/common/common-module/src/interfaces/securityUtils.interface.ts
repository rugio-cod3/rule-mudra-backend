import { EncryptionAlgos, HashMethods } from '../enums/security.enum'

export interface ISecurityUtils {
  createHash(
    method: HashMethods,
    value: string,
    saltRounds: number,
  ): Promise<string>
  compareHash(
    method: HashMethods,
    value: string,
    hash: string,
  ): Promise<boolean>
  encrypt(algorithm: EncryptionAlgos, value: string): string
  decrypt(algorithm: EncryptionAlgos, value: string): string
}
