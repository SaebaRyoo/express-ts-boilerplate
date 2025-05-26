import httpStatus from 'http-status';
import { Repository, Not, FindOptionsWhere, In } from 'typeorm';
import { AppDataSource } from '../config/typeorm.config';
import { User } from '../models/entities/user.entity';
import { Role } from '../models/entities/role.entity';
import ApiError from '../utils/ApiError';
import bcrypt from 'bcryptjs';

interface QueryResult {
  results: User[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

interface UserFilterOptions {
  email?: string;
  name?: string;
  role?: string;
}

interface QueryOptions {
  sortBy?: string;
  limit?: number;
  page?: number;
}

const UserRepository: Repository<User> = AppDataSource.getRepository('User');
const RoleRepository: Repository<Role> = AppDataSource.getRepository('Role');

/**
 * 哈希密码
 */
const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 8);
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody: Partial<User>): Promise<User> => {
  const existingUser = await UserRepository.findOne({ where: { email: userBody.email } });
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // 加密密码
  if (userBody.password) {
    userBody.password = await hashPassword(userBody.password);
  }

  const user = UserRepository.create(userBody);
  return UserRepository.save(user);
};

/**
 * Query for users
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter: UserFilterOptions, options: QueryOptions): Promise<QueryResult> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const orderBy: Record<string, 'ASC' | 'DESC'> = {};
  if (options.sortBy) {
    const parts = options.sortBy.split(':');
    orderBy[parts[0]] = parts[1] === 'desc' ? 'DESC' : 'ASC';
  }

  const [users, total] = await UserRepository.findAndCount({
    where: filter,
    skip,
    take: limit,
    order: orderBy,
    relations: ['roles'],
  });

  return {
    results: users,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalResults: total,
  };
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserById = async (id: string): Promise<User | null> => {
  return UserRepository.findOne({
    where: { id },
    relations: ['roles'],
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email: string): Promise<User | null> => {
  return UserRepository.findOne({
    where: { email },
    select: ['id', 'name', 'email', 'password', 'isEmailVerified', 'createdAt', 'updatedAt'],
    relations: ['roles'],
  });
};

/**
 * Update user by id
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId: string, updateBody: Partial<User>): Promise<User> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (updateBody.email) {
    const existingUser = await UserRepository.findOne({
      where: {
        email: updateBody.email,
        id: Not(userId),
      } as FindOptionsWhere<User>,
    });
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  }

  // 如果更新密码，需要加密
  if (updateBody.password) {
    updateBody.password = await hashPassword(updateBody.password);
  }

  Object.assign(user, updateBody);
  return UserRepository.save(user);
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: string): Promise<User> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await UserRepository.remove(user);
  return user;
};

/**
 * Set roles for a user
 * @param {string} userId - User id
 * @param {Array} roleIds - Array of role ids
 * @returns {Promise<User>}
 */
const setUserRoles = async (userId: string, roleIds: string[]): Promise<User> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const roles = await RoleRepository.find({
    where: { id: In(roleIds) },
  });

  if (roles.length !== roleIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'One or more roles not found');
  }

  user.roles = roles;
  return UserRepository.save(user);
};

export { createUser, queryUsers, getUserById, getUserByEmail, updateUserById, deleteUserById, setUserRoles };
