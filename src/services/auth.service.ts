import httpStatus from 'http-status';
import { getUserByEmail, createUser } from './user.service';
import { generateAuthTokens, verifyToken } from './token.service';
import { User } from '../models/entities/user.entity';
import ApiError from '../utils/ApiError';

/**
 * 用户登录
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '邮箱或密码错误');
  }
  return user;
};

/**
 * 用户注册
 * @param {Object} userBody
 * @returns {Promise<Object>}
 */
const register = async (userBody: any) => {
  const user = await createUser(userBody);
  const tokens = await generateAuthTokens(user.id);
  return { user, tokens };
};

/**
 * 用户登录
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
const login = async (email: string, password: string) => {
  const user = await loginUserWithEmailAndPassword(email, password);
  const tokens = await generateAuthTokens(user.id);
  return { user, tokens };
};

/**
 * 刷新认证tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, 'refresh');
    const tokens = await generateAuthTokens(refreshTokenDoc.sub);
    return tokens;
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, '请重新登录');
  }
};

export { register, login, refreshAuth };
