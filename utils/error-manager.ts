import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorManager extends Error {
  constructor({
    type,
    message,
  }: {
    type: keyof typeof HttpStatus;
    message: string;
  }) {
    super(`${type} :: ${message}`);
  }

  public static createSignatureError(message: string) {
    const name = message.split(' :: ')[0];
    const messageError = message.split(' :: ')[1];
    if (name && name in HttpStatus) {
      const status = HttpStatus[name as keyof typeof HttpStatus];
      throw new HttpException(messageError, status);
    }

    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
