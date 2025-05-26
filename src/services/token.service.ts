import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import config from '../config/config';

/**
 * 生成token
 * @param {string} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId: string, expires: Moment, type: string, secret = config.jwt.secret): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * 生成认证tokens
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (userId: string) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(userId, accessTokenExpires, 'access');

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(userId, refreshTokenExpires, 'refresh');

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * 验证token
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Object>}
 */
const verifyToken = async (token: string, type: string) => {
  const payload = jwt.verify(token, config.jwt.secret) as any;
  if (payload.type !== type) {
    throw new Error('无效的token类型');
  }
  return payload;
};

export { generateToken, generateAuthTokens, verifyToken };
