import { Request, Response, NextFunction } from 'express';
import {
  GenericError,
  ServiceError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
} from '../../lib/errors';
import { errorLogger } from '../../lib/logger';
import config from '../../configTypes';

export default (
  err: GenericError,
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  if (res.headersSent) {
    return next(err);
  }
  switch (err.name) {
    case ServiceError.name:
    case NotFoundError.name:
    case AuthenticationError.name:
    case AuthorizationError.name:
      return res.status(err.statusCode).send({
        status: 'error',
        message: err.message,
      });
    case ValidationError.name:
      return res.status(err.statusCode).send({
        status: 'error',
        message: err.message,
        errors: (err as ValidationError).errors,
      });
    default:
      errorLogger.error(err.message, {
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        stack: err.stack,
      });
      return res.status(500).send({
        status: 'error',
        message: 'an error occurred',
        ...(['local', 'development'].includes(config.app.env) ? { stack: err.stack } : {}),
      });
  }
};
