import httpStatus from 'http-status';
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/typeorm.config';
import { Permission } from '../models/entities/permission.entity';
import ApiError from '../utils/ApiError';

interface QueryResult {
  results: Permission[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

interface PermissionFilterOptions {
  name?: string;
  action?: string;
  resource?: string;
  category?: string;
  isActive?: boolean;
}

interface QueryOptions {
  sortBy?: string;
  limit?: number;
  page?: number;
}

const PermissionRepository: Repository<Permission> = AppDataSource.getRepository('Permission');

/**
 * Create a permission
 */
const createPermission = async (permissionBody: Partial<Permission>): Promise<Permission> => {
  const existingPermission = await PermissionRepository.findOne({
    where: { name: permissionBody.name },
  });
  if (existingPermission) {
    throw new ApiError(httpStatus.BAD_REQUEST, '权限名称已存在');
  }

  const permission = PermissionRepository.create(permissionBody);
  return PermissionRepository.save(permission);
};

/**
 * Query for permissions
 */
const queryPermissions = async (filter: PermissionFilterOptions, options: QueryOptions): Promise<QueryResult> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const orderBy: Record<string, 'ASC' | 'DESC'> = {};
  if (options.sortBy) {
    const parts = options.sortBy.split(':');
    orderBy[parts[0]] = parts[1] === 'desc' ? 'DESC' : 'ASC';
  }

  const [permissions, total] = await PermissionRepository.findAndCount({
    where: filter,
    skip,
    take: limit,
    order: orderBy,
  });

  return {
    results: permissions,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalResults: total,
  };
};

/**
 * Get permission by id
 */
const getPermissionById = async (id: string): Promise<Permission | null> => {
  return PermissionRepository.findOneBy({ id });
};

/**
 * Update permission by id
 */
const updatePermissionById = async (permissionId: string, updateBody: Partial<Permission>): Promise<Permission> => {
  const permission = await getPermissionById(permissionId);
  if (!permission) {
    throw new ApiError(httpStatus.NOT_FOUND, '权限不存在');
  }

  if (updateBody.name && updateBody.name !== permission.name) {
    const existingPermission = await PermissionRepository.findOne({
      where: { name: updateBody.name },
    });
    if (existingPermission) {
      throw new ApiError(httpStatus.BAD_REQUEST, '权限名称已存在');
    }
  }

  Object.assign(permission, updateBody);
  return PermissionRepository.save(permission);
};

/**
 * Delete permission by id
 */
const deletePermissionById = async (permissionId: string): Promise<Permission> => {
  const permission = await getPermissionById(permissionId);
  if (!permission) {
    throw new ApiError(httpStatus.NOT_FOUND, '权限不存在');
  }
  await PermissionRepository.remove(permission);
  return permission;
};

/**
 * Get user permissions by roles
 */
const getUserPermissionsByRoles = async (roleIds: string[]): Promise<Permission[]> => {
  if (!roleIds.length) return [];

  return PermissionRepository.createQueryBuilder('permission')
    .innerJoin('permission.roles', 'role')
    .where('role.id IN (:...roleIds)', { roleIds })
    .andWhere('permission.isActive = :isActive', { isActive: true })
    .getMany();
};

/**
 * Get all permissions with minimal data (for dropdown/select)
 */
const getAllPermissions = async (): Promise<Permission[]> => {
  return PermissionRepository.find({
    where: { isActive: true },
    select: ['id', 'name', 'action', 'resource', 'category'],
    order: { category: 'ASC', name: 'ASC' },
  });
};

export {
  createPermission,
  queryPermissions,
  getPermissionById,
  updatePermissionById,
  deletePermissionById,
  getUserPermissionsByRoles,
  getAllPermissions,
};
