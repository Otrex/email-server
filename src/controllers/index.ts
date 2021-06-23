import {
  RequestHandler, Request, Response, NextFunction,
} from 'express';

export interface ServiceActionResult {
  data: any;
  message?: string;
  statusCode?: number;
}

type HandlerFunc =
  | ((req: Request) => Promise<ServiceActionResult>)
  | (() => Promise<ServiceActionResult>);

export function wrapHandler(handler: HandlerFunc): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, message = 'The request was successful', statusCode = 200 } = await handler(req);

      return res.status(statusCode).send({
        status: 'success',
        message,
        data,
      });
    } catch (e) {
      return next(e);
    }
  };
}
