import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import * as permissionService from '../services/permission.service';
import * as userService from '../services/user.service';

/**
 * 检查用户是否具有指定的权限
 * @param requiredPermissions 需要的权限列表 (格式: action:resource)
 */
const checkPermission =
  (...requiredPermissions: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, '请先登录');
      }

      // 如果没有指定权限要求，则只需要登录即可
      if (!requiredPermissions.length) {
        return next();
      }

      // 从数据库查询用户信息（包含角色）
      // @ts-expect-error User实体
      const userWithRoles = await userService.getUserById(req.user.id);
      if (!userWithRoles) {
        throw new ApiError(httpStatus.UNAUTHORIZED, '用户不存在');
      }

      // 获取用户的角色ID列表
      const roleIds = userWithRoles.roles?.map((role) => role.id) || [];

      // 获取用户的所有权限
      const userPermissions = await permissionService.getUserPermissionsByRoles(roleIds);

      // 检查用户是否具有所需的权限
      const hasPermission = requiredPermissions.every((requiredPermission) => {
        const [action, resource] = requiredPermission.split(':');
        return userPermissions.some((permission) => permission.action === action && permission.resource === resource);
      });

      if (!hasPermission) {
        throw new ApiError(httpStatus.FORBIDDEN, '权限不足');
      }

      next();
    } catch (error) {
      next(error);
    }
  };

/**
 * 检查用户是否具有指定的角色
 * @param requiredRoles 需要的角色列表
 */
const checkRole =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, '请先登录');
      }

      // 如果没有指定角色要求，则只需要登录即可
      if (!requiredRoles.length) {
        return next();
      }

      // 从数据库查询用户信息（包含角色）
      // @ts-expect-error User实体
      const userWithRoles = await userService.getUserById(req.user.id);
      if (!userWithRoles) {
        throw new ApiError(httpStatus.UNAUTHORIZED, '用户不存在');
      }

      // 检查用户是否具有所需的角色
      const hasRole = requiredRoles.some((requiredRole) =>
        userWithRoles.roles?.some((role) => role.name === requiredRole),
      );

      if (!hasRole) {
        throw new ApiError(httpStatus.FORBIDDEN, '角色权限不足');
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export { checkPermission, checkRole };
