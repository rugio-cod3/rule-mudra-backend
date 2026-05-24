import * as crypto from 'crypto';
import * as uuid from 'uuid';

export function generateSHA1Hash(payload: string): string {
    return crypto.createHash('sha1').update(payload).digest('hex');
  }
  export function generateUniqueId(): string {
    return uuid.v1().replace(/-/g, '').substring(0, 16);
  }