import Joi from 'joi';

// 验证规则类型定义
interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

const createRole: ValidationSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().max(50),
    description: Joi.string().max(200),
    isActive: Joi.boolean(),
  }),
};

const getRoles: ValidationSchema = {
  query: Joi.object().keys({
    name: Joi.string(),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRole: ValidationSchema = {
  params: Joi.object().keys({
    roleId: Joi.string().required(),
  }),
};

const updateRole: ValidationSchema = {
  params: Joi.object().keys({
    roleId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().max(50),
      description: Joi.string().max(200),
      isActive: Joi.boolean(),
    })
    .min(1),
};

const deleteRole: ValidationSchema = {
  params: Joi.object().keys({
    roleId: Joi.string().required(),
  }),
};

const setRoleMenus: ValidationSchema = {
  params: Joi.object().keys({
    roleId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    menuIds: Joi.array().items(Joi.string()).required(),
  }),
};

const setRolePermissions: ValidationSchema = {
  params: Joi.object().keys({
    roleId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    permissionIds: Joi.array().items(Joi.string()).required(),
  }),
};

export { createRole, getRoles, getRole, updateRole, deleteRole, setRoleMenus, setRolePermissions };
