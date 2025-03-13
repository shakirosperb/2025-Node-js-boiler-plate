import { plainToInstance } from 'class-transformer';
import { registerDecorator, validate, validateSync, ValidationArguments, ValidationError, ValidationOptions } from 'class-validator';
import { RequestHandler } from 'express';

const validationMiddleware = (
  type: any,
  value: 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = false,
): RequestHandler => {
  return async (req, _res, next) => {
    const object = plainToInstance(type, req[value]);
    const errors = await validate(object, { skipMissingProperties, whitelist, forbidNonWhitelisted });

    if (errors.length > 0) {
      const message = errors.map((error: ValidationError) => Object.values(error.constraints || {})).join(', ');
      console.log({message});
      
      next(message);
    } else {
      next();
    }
  };
};

export default validationMiddleware;

/**
 * @decorator
 * @description A custom decorator to validate a validation-schema within a validation schema up to N levels
 * @param schema The validation Class
 */
export function ValidateNested(
  schema: new () => any,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    const options = validationOptions ? validationOptions : {};
    registerDecorator({
      name: 'ValidateNested',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (Array.isArray(value)) {
            return value.every(item => validateSync(plainToInstance(schema, item)).length === 0);
          } else {
            return validateSync(plainToInstance(schema, value)).length === 0;
          }
        },
        defaultMessage(args: ValidationArguments) {
          if (Array.isArray(args.value)) {
            return args.value
              .map((item, index) => 
                `${args.property}::index${index} -> ` +
                validateSync(plainToInstance(schema, item))
                  .map(e => Object.values(e.constraints || {}))
                  .flat()
                  .join(', ')
              ).join('; ');
          } else {
            return (
              `${args.property}: ` +
              validateSync(plainToInstance(schema, args.value))
                .map(e => Object.values(e.constraints || {}))
                .flat()
                .join(', ')
            );
          }
        },
      },
    });
  };
}
