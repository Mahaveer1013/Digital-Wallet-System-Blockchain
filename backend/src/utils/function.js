import crypto from 'crypto';
import { ENCRYPTION_KEY } from '../utils/constant.js'; // Ensure this is a 32-character secret

// Function to encrypt the private key
export function encryptPrivateKey(privateKey) {
  const encryptionKey = Buffer.from(ENCRYPTION_KEY, 'utf8');
  const iv = crypto.randomBytes(16); // Generate a random Initialization Vector (IV)
  
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  let encryptedPrivateKey = cipher.update(privateKey, 'utf8', 'hex');
  encryptedPrivateKey += cipher.final('hex');
  
  // Combine IV and encrypted data for storage
  const encryptedData = iv.toString('hex') + ':' + encryptedPrivateKey;
  return encryptedData;
}

// Function to decrypt the private key
export function decryptPrivateKey(encryptedData) {
  const encryptionKey = Buffer.from(ENCRYPTION_KEY, 'utf8');
  const [ivHex, encryptedPrivateKey] = encryptedData.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
  
  let decrypted = decipher.update(encryptedPrivateKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
