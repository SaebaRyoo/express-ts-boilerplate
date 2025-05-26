import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const verifyCallback =
  (req: Request, resolve: any, reject: any) =>
  async (err: any, user: any, info: any): Promise<void> => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    // 接收用户信息
    req.user = user;

    resolve();
  };

const auth =
  () =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
