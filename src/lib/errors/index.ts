// eslint-disable-next-line max-classes-per-file
export type ValidationErrorObject = {
  type: string;
  field: string;
  message: string;
};

export class GenericError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ServiceError extends GenericError {}

export class NotFoundError extends GenericError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ValidationError extends GenericError {
  public errors: ValidationErrorObject[];

  constructor(errors: ValidationErrorObject[] = []) {
    const message = `${errors[0].message}`;
    super(message, 422);
    this.errors = errors;
  }
}

export class AuthenticationError extends GenericError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class AuthorizationError extends GenericError {
  constructor(message = 'you are not authorized to perform this action') {
    super(message, 403);
  }
}
