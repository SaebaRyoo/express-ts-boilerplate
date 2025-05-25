import Joi from 'joi';
import { password } from './custom.validation';

// 验证规则类型定义
interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

const createUser: ValidationSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const getUsers: ValidationSchema = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser: ValidationSchema = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const updateUser: ValidationSchema = {
  params: Joi.object().keys({
    userId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser: ValidationSchema = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const setUserRoles: ValidationSchema = {
  params: Joi.object().keys({
    userId: Joi.required(),
  }),
  body: Joi.object().keys({
    roleIds: Joi.array().items(Joi.string()).required(),
  }),
};

export { createUser, getUsers, getUser, updateUser, deleteUser, setUserRoles };
