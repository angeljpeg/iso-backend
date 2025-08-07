import { ErrorManager } from './error-manager';
import { config } from 'dotenv';

config({
  path: '.env',
});

export function getEnvVar(key: string): string {
  try {
    const value = process.env[key];
    // console.log(`${key} :: ${value}`);
    if (!value) {
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: `Variable ${key} is not set in the .env file`,
      });
    }
    return value;
  } catch (error) {
    if (error instanceof ErrorManager) {
      ErrorManager.createSignatureError(error.message);
    }
    throw error;
  }
}
