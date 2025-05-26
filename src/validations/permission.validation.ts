import Joi from 'joi';

// 验证规则类型定义
interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

const createPermission: ValidationSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().max(100),
    action: Joi.string().required().max(100),
    resource: Joi.string().required().max(100),
    description: Joi.string().max(200),
    category: Joi.string().max(50),
    isActive: Joi.boolean(),
  }),
};

const getPermissions: ValidationSchema = {
  query: Joi.object().keys({
    name: Joi.string(),
    action: Joi.string(),
    resource: Joi.string(),
    category: Joi.string(),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPermission: ValidationSchema = {
  params: Joi.object().keys({
    permissionId: Joi.string().required(),
  }),
};

const updatePermission: ValidationSchema = {
  params: Joi.object().keys({
    permissionId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().max(100),
      action: Joi.string().max(100),
      resource: Joi.string().max(100),
      description: Joi.string().max(200),
      category: Joi.string().max(50),
      isActive: Joi.boolean(),
    })
    .min(1),
};

const deletePermission: ValidationSchema = {
  params: Joi.object().keys({
    permissionId: Joi.string().required(),
  }),
};

export { createPermission, getPermissions, getPermission, updatePermission, deletePermission };
