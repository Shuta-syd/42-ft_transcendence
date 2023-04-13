import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyInUseException extends HttpException {
  constructor(message: string, name: string) {
    super(
      {
        message: message,
        name: name,
      },
      HttpStatus.NOT_ACCEPTABLE,
    );
  }
}
