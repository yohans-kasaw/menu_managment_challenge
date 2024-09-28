import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message =
        typeof exception.getResponse() === 'string'
          ? exception.getResponse()
          : (exception.getResponse() as any).message;

      this.logger.error(
        `HTTP ${status} - ${JSON.stringify(message)} - Path: ${request.url}`,
      );

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    } else {
      this.logger.error(
        `Unexpected error: ${JSON.stringify(exception)} - Path: ${request.url}`,
      );
      response.status(500).json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Internal server error',
      });
    }
  }
}
