import * as crypto from "crypto";
import { config } from "@/config.server";
import * as uuid from "uuid";


export function generateUniqueId(): string {
  return uuid.v1().replace(/-/g, "").substring(0, 16);
}

export function getBase64Payload(payload: string): string {
  return Buffer.from(payload).toString("base64");
}

export function aes256cbcDecryption(
  key: Buffer,
  initVector: Buffer,
  encryptedString: Buffer
): string {
  const aes256Key = crypto.createDecipheriv("aes-256-cbc", key, initVector);
  const aes256DecryptedKey = aes256Key.update(encryptedString);
  return Buffer.concat([aes256DecryptedKey, aes256Key.final()]).toString(
    "utf8"
  );
}

export function generateSHA512Hash(input: Buffer, key: Buffer): Buffer {
  return crypto.createHmac("sha3-512", key).update(input).digest();
}

export function getBase64DecodedValue2(payload: string): Buffer {
  return Buffer.from(payload, "base64");
}

export function getDecryptedValue(base64Data: string): string | undefined {
  if (!base64Data) return undefined;

  const input = Buffer.from(base64Data, "base64");
  const base64EncryptionKey1 = getBase64DecodedValue2(config.lenderEncryptionKey);

  const iv = input.slice(0, 16);  // First 16 bytes = IV
  const encryptAES256CBCValue = input.slice(16);  // Remaining = Encrypted data

  const decryptedValue = aes256cbcDecryption(
    base64EncryptionKey1.slice(0, 32),
    iv,
    encryptAES256CBCValue
  );
  return decryptedValue;
}

export function getEncryptedValue(input: string): string | undefined {
  if (!input) return undefined;

  const base64EncryptionKey1 = getBase64DecodedValue2(config.lenderEncryptionKey);
  const uniqueId = Buffer.from(generateUniqueId());  // Assuming a 16-byte IV

  const encryptAES256CBCValue = aes256cbcEncryption(
    base64EncryptionKey1.slice(0, 32), // AES-256 needs a 32-byte key
    uniqueId,
    Buffer.from(input)
  );
  const output = Buffer.concat([uniqueId, encryptAES256CBCValue]);
  return output.toString("base64");

}


export function aes256cbcEncryption(
  key: Buffer,
  initVector: Buffer,
  value: Buffer
): Buffer {
  const aes256Key = crypto.createCipheriv("aes-256-cbc", key, initVector);
  const aes256EncryptedKey = aes256Key.update(value);
  return Buffer.concat([aes256EncryptedKey, aes256Key.final()]);
}

export function getEncryptedObject(inputObject: Record<string, any>): Record<string, any> {

  for (const key in inputObject) {
    const value = inputObject[key];

    if (typeof value === 'string' || typeof value === 'number') {
      inputObject[key] = getEncryptedValue(value.toString());
    } else if (typeof value === 'object' && value !== null) {
      inputObject[key] = getEncryptedObject(value);
    }
  }
  return inputObject;
}


export function getDecryptedObject(inputObject: Record<string, any>): Record<string, any> {
  const decryptedObject: Record<string, any> = {};

  for (const key in inputObject) {
    const value = inputObject[key];

    if (typeof value === 'string') {
      decryptedObject[key] = getDecryptedValue(value);
    } else if (typeof value === 'object' && value !== null) {
      decryptedObject[key] = getDecryptedObject(value);  // Recursively decrypt nested objects
    } else {
      decryptedObject[key] = value;  // Leave other types untouched
    }
  }
  return decryptedObject;
}