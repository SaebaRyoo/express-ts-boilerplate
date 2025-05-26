import { Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import * as permissionService from '../services/permission.service';

const createPermission = catchAsync(async (req: Request, res: Response) => {
  const permission = await permissionService.createPermission(req.body);
  res.status(httpStatus.CREATED).send(permission);
});

const getPermissions = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'action', 'resource', 'category', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await permissionService.queryPermissions(filter, options);
  res.send(result);
});

const getAllPermissions = catchAsync(async (req: Request, res: Response) => {
  const permissions = await permissionService.getAllPermissions();
  res.send(permissions);
});

const getPermission = catchAsync(async (req: Request, res: Response) => {
  const permission = await permissionService.getPermissionById(req.params.permissionId);
  if (!permission) {
    throw new ApiError(httpStatus.NOT_FOUND, '权限不存在');
  }
  res.send(permission);
});

const updatePermission = catchAsync(async (req: Request, res: Response) => {
  const permission = await permissionService.updatePermissionById(req.params.permissionId, req.body);
  res.send(permission);
});

const deletePermission = catchAsync(async (req: Request, res: Response) => {
  await permissionService.deletePermissionById(req.params.permissionId);
  res.status(httpStatus.NO_CONTENT).send();
});

export { createPermission, getPermissions, getAllPermissions, getPermission, updatePermission, deletePermission };
