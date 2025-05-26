import Joi from 'joi';
import { password } from './custom.validation';

interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

const register: ValidationSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const login: ValidationSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const refreshTokens: ValidationSchema = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export { register, login, refreshTokens };
