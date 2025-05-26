import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { register, login, refreshAuth } from '../services/auth.service';

/**
 * 用户注册
 */
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await register(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: '注册成功',
    data: result,
  });
});

/**
 * 用户登录
 */
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await login(email, password);
  res.status(httpStatus.OK).json({
    success: true,
    message: '登录成功',
    data: result,
  });
});

/**
 * 刷新认证tokens
 */
const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await refreshAuth(refreshToken);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Token刷新成功',
    data: { tokens },
  });
});

export { registerUser, loginUser, refreshTokens };
