import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsHandler extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsHandler.name);

  constructor(@Inject(HttpAdapterHost) applicationRef: HttpServer) {
    super(applicationRef);
  }

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const { url, method, headers, body } = request;

    exception.name = 'custom-error';

    try {
      const status =
        exception instanceof HttpException ? exception.getStatus() : 500;
      const message =
        exception instanceof HttpException
          ? exception.getResponse()
          : exception.message;

      const log = {
        status,
        headers,
        body,
        url,
        method,
        errorMessage: message,
      };

      this.logger.error(log);

      return response.status(status).json(message);
    } catch (error) {
      return response
        .status(500)
        .json(
          new InternalServerErrorException(
            (error as Error).message,
          ).getResponse(),
        );
    }
  }
}
