import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';

interface ValidationSchema {
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  body?: Joi.ObjectSchema;
}

const validate = (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }

  // express-xss-sanitizer 这个中间件会对 req.query、req.body 等参数做“防御性”处理，它会把这些对象“冻结”或用 Object.defineProperty 设置为只读
  // 所以分别处理每个属性，避免修改只读属性
  if (value.body) {
    req.body = value.body;
  }
  if (value.params) {
    req.params = value.params;
  }
  if (value.query) {
    // 清除现有的query参数
    Object.keys(req.query).forEach((key) => {
      delete (req.query as any)[key];
    });
    // 添加验证后的query参数
    Object.keys(value.query).forEach((key) => {
      (req.query as any)[key] = value.query[key];
    });
  }

  return next();
};

export default validate;
