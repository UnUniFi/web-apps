import * as crypto from 'crypto';

export function toHashHex(target: string | undefined) {
  return crypto
    .createHash('sha256')
    .update(Buffer.from(target ?? ''))
    .digest()
    .toString('hex');
}
