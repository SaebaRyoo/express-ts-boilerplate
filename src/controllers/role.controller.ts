import { Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import * as roleService from '../services/role.service';

const createRole = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.createRole(req.body);
  res.status(httpStatus.CREATED).send(role);
});

const getRoles = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await roleService.queryRoles(filter, options);
  res.send(result);
});

const getAllRoles = catchAsync(async (req: Request, res: Response) => {
  const roles = await roleService.getAllRoles();
  res.send(roles);
});

const getRole = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.getRoleById(req.params.roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, '角色不存在');
  }
  res.send(role);
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.updateRoleById(req.params.roleId, req.body);
  res.send(role);
});

const deleteRole = catchAsync(async (req: Request, res: Response) => {
  await roleService.deleteRoleById(req.params.roleId);
  res.status(httpStatus.NO_CONTENT).send();
});

const setRoleMenus = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.setRoleMenus(req.params.roleId, req.body.menuIds);
  res.send(role);
});

const setRolePermissions = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.setRolePermissions(req.params.roleId, req.body.permissionIds);
  res.send(role);
});

export { createRole, getRoles, getAllRoles, getRole, updateRole, deleteRole, setRoleMenus, setRolePermissions };
