import Joi from 'joi';

// 验证规则类型定义
interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

const createMenu: ValidationSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().max(100),
    title: Joi.string().max(200),
    path: Joi.string().max(200),
    icon: Joi.string().max(100),
    component: Joi.string().max(100),
    sort: Joi.number().integer(),
    isVisible: Joi.boolean(),
    isActive: Joi.boolean(),
    parentId: Joi.string().allow(null),
  }),
};

const getMenu: ValidationSchema = {
  params: Joi.object().keys({
    menuId: Joi.string().required(),
  }),
};

const updateMenu: ValidationSchema = {
  params: Joi.object().keys({
    menuId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().max(100),
      title: Joi.string().max(200),
      path: Joi.string().max(200),
      icon: Joi.string().max(100),
      component: Joi.string().max(100),
      sort: Joi.number().integer(),
      isVisible: Joi.boolean(),
      isActive: Joi.boolean(),
      parentId: Joi.string().allow(null),
    })
    .min(1),
};

const deleteMenu: ValidationSchema = {
  params: Joi.object().keys({
    menuId: Joi.string().required(),
  }),
};

const getUserMenus: ValidationSchema = {
  body: Joi.object().keys({
    roleIds: Joi.array().items(Joi.string()).required(),
  }),
};

export { createMenu, getMenu, updateMenu, deleteMenu, getUserMenus };
