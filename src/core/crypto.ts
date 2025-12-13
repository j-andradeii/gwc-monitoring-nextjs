/**
 * Crypto Service
 *
 * AES-CBC encryption using scrypt key derivation
 * Matches the Angular implementation for backend compatibility
 */

import * as scrypt from 'scrypt-js';
import { config } from './config';

const ALGORITHM = 'AES-CBC';

let keyPromise: Promise<CryptoKey> | null = null;

/**
 * Convert buffer to hex string
 */
const toHex = (buffer: ArrayBuffer | Uint8Array): string => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Convert hex string to Uint8Array
 */
const fromHex = (hex: string): Uint8Array => {
  return new Uint8Array(
    hex.match(/[\da-f]{2}/gi)?.map((h) => parseInt(h, 16)) || []
  );
};

/**
 * Derive encryption key using scrypt
 */
const deriveKey = async (password: string): Promise<CryptoKey> => {
  const salt = new TextEncoder().encode('salt'); // Must match NestJS salt

  const keyBuffer = await scrypt.scrypt(
    new TextEncoder().encode(password),
    salt,
    1024, // N parameter
    8, // r parameter
    1, // p parameter
    32 // key length
  );

  return crypto.subtle.importKey(
    'raw',
    new Uint8Array(keyBuffer),
    { name: ALGORITHM },
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Get or create the encryption key
 */
const getKey = async (): Promise<CryptoKey> => {
  if (!keyPromise) {
    const password = config.security.xAccessTokenPassword;
    keyPromise = deriveKey(password);
  }
  return keyPromise;
};

/**
 * Encrypt a string
 */
export const encrypt = async (text: string): Promise<string> => {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    new TextEncoder().encode(text)
  );

  return `${toHex(iv)}:${toHex(new Uint8Array(encrypted))}`;
};

/**
 * Decrypt a string
 */
export const decrypt = async (data: string): Promise<string | null> => {
  try {
    const key = await getKey();
    const [ivHex, encryptedHex] = data.split(':');
    const iv = fromHex(ivHex);
    const encrypted = fromHex(encryptedHex);

    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv: new Uint8Array(iv) },
      key,
      new Uint8Array(encrypted)
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
};

// Class-based API for backwards compatibility
export class CryptoService {
  static encrypt = encrypt;
  static decrypt = decrypt;
  static toHex = toHex;
  static fromHex = fromHex;
}
