import Validator from 'fastest-validator';
import { ValidationError, ValidationErrorObject } from '../lib/errors';

const validator = new Validator();

const wrapServiceAction = (validationParams: any, action: (params: any) => Promise<any>) => {
  const validate = validationParams ? validator.compile(validationParams) : null;

  return async (params = {}) => {
    if (validate) {
      const errors = validate(params);
      if (Array.isArray(errors)) {
        throw new ValidationError(errors as ValidationErrorObject[]);
      }
    }
    return action(params);
  };
};

export default function Validate(params: { [key: string]: any }) {
  return (target: any, propertyKey: string): void => {
    // eslint-disable-next-line no-param-reassign
    target[propertyKey] = wrapServiceAction(params, target[propertyKey]);
  };
}
