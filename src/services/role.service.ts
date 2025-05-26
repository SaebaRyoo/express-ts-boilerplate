import httpStatus from 'http-status';
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/typeorm.config';
import { Role } from '../models/entities/role.entity';
import { Menu } from '../models/entities/menu.entity';
import { Permission } from '../models/entities/permission.entity';
import ApiError from '../utils/ApiError';

interface QueryResult {
  results: Role[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

interface RoleFilterOptions {
  name?: string;
  isActive?: boolean;
}

interface QueryOptions {
  sortBy?: string;
  limit?: number;
  page?: number;
}

const RoleRepository: Repository<Role> = AppDataSource.getRepository('Role');
const MenuRepository: Repository<Menu> = AppDataSource.getRepository('Menu');
const PermissionRepository: Repository<Permission> = AppDataSource.getRepository('Permission');

/**
 * Create a role
 */
const createRole = async (roleBody: Partial<Role>): Promise<Role> => {
  const existingRole = await RoleRepository.findOne({
    where: { name: roleBody.name },
  });
  if (existingRole) {
    throw new ApiError(httpStatus.BAD_REQUEST, '角色名称已存在');
  }

  const role = RoleRepository.create(roleBody);
  return RoleRepository.save(role);
};

/**
 * Query for roles
 */
const queryRoles = async (filter: RoleFilterOptions, options: QueryOptions): Promise<QueryResult> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const orderBy: Record<string, 'ASC' | 'DESC'> = {};
  if (options.sortBy) {
    const parts = options.sortBy.split(':');
    orderBy[parts[0]] = parts[1] === 'desc' ? 'DESC' : 'ASC';
  }

  const [roles, total] = await RoleRepository.findAndCount({
    where: filter,
    skip,
    take: limit,
    order: orderBy,
    relations: ['menus', 'permissions'],
  });

  return {
    results: roles,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalResults: total,
  };
};

/**
 * Get role by id
 */
const getRoleById = async (id: string): Promise<Role | null> => {
  return RoleRepository.findOne({
    where: { id },
    relations: ['menus', 'permissions'],
  });
};

/**
 * Update role by id
 */
const updateRoleById = async (roleId: string, updateBody: Partial<Role>): Promise<Role> => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, '角色不存在');
  }

  if (updateBody.name && updateBody.name !== role.name) {
    const existingRole = await RoleRepository.findOne({
      where: { name: updateBody.name },
    });
    if (existingRole) {
      throw new ApiError(httpStatus.BAD_REQUEST, '角色名称已存在');
    }
  }

  Object.assign(role, updateBody);
  return RoleRepository.save(role);
};

/**
 * Delete role by id
 */
const deleteRoleById = async (roleId: string): Promise<Role> => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, '角色不存在');
  }

  // 检查是否有用户使用此角色
  const roleWithUsers = await RoleRepository.findOne({
    where: { id: roleId },
    relations: ['users'],
  });

  if (roleWithUsers && roleWithUsers.users && roleWithUsers.users.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, '该角色下还有用户，请先移除用户关联');
  }

  await RoleRepository.remove(role);
  return role;
};

/**
 * Set role menus
 */
const setRoleMenus = async (roleId: string, menuIds: string[]): Promise<Role> => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, '角色不存在');
  }

  // 验证菜单是否存在
  const menus = await MenuRepository.findByIds(menuIds);
  if (menus.length !== menuIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, '部分菜单不存在');
  }

  role.menus = menus;
  return RoleRepository.save(role);
};

/**
 * Set role permissions
 */
const setRolePermissions = async (roleId: string, permissionIds: string[]): Promise<Role> => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, '角色不存在');
  }

  // 验证权限是否存在
  const permissions = await PermissionRepository.findByIds(permissionIds);
  if (permissions.length !== permissionIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, '部分权限不存在');
  }

  role.permissions = permissions;
  return RoleRepository.save(role);
};

/**
 * Get all roles with minimal data (for dropdown/select)
 */
const getAllRoles = async (): Promise<Role[]> => {
  return RoleRepository.find({
    where: { isActive: true },
    select: ['id', 'name', 'description'],
    order: { name: 'ASC' },
  });
};

export {
  createRole,
  queryRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
  setRoleMenus,
  setRolePermissions,
  getAllRoles,
};
