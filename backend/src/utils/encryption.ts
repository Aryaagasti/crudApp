// utils/encryption.ts
import crypto from 'crypto';

// Get encryption key from environment
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Validate encryption key
if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY is not defined in environment variables');
}

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be exactly 32 characters long');
}

// Encrypt data to string
export const encryptData = (data: any): string => {
  if (!ENCRYPTION_KEY) {
    throw new Error('Encryption key not configured');
  }

  const text = JSON.stringify(data);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', 
    Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
};

// Decrypt string back to data
export const decryptData = (encryptedData: string): any => {
  if (!ENCRYPTION_KEY) {
    throw new Error('Encryption key not configured');
  }

  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const decipher = crypto.createDecipheriv('aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY), iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return JSON.parse(decrypted);
};