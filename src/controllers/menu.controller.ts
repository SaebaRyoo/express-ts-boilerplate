import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import * as menuService from '../services/menu.service';

const createMenu = catchAsync(async (req: Request, res: Response) => {
  const menu = await menuService.createMenu(req.body);
  res.status(httpStatus.CREATED).send(menu);
});

const getAllMenus = catchAsync(async (req: Request, res: Response) => {
  const menus = await menuService.getAllMenus();
  res.send(menus);
});

const getAllMenusForSelect = catchAsync(async (req: Request, res: Response) => {
  const menus = await menuService.getAllMenusForSelect();
  res.send(menus);
});

const getMenu = catchAsync(async (req: Request, res: Response) => {
  const menu = await menuService.getMenuById(req.params.menuId);
  if (!menu) {
    throw new ApiError(httpStatus.NOT_FOUND, '菜单不存在');
  }
  res.send(menu);
});

const updateMenu = catchAsync(async (req: Request, res: Response) => {
  const menu = await menuService.updateMenuById(req.params.menuId, req.body);
  res.send(menu);
});

const deleteMenu = catchAsync(async (req: Request, res: Response) => {
  await menuService.deleteMenuById(req.params.menuId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getUserMenus = catchAsync(async (req: Request, res: Response) => {
  // 假设从token中获取用户角色信息
  const { roleIds } = req.body;
  const menus = await menuService.getUserMenusByRoles(roleIds);
  res.send(menus);
});

const getUserMenusTree = catchAsync(async (req: Request, res: Response) => {
  // 假设从token中获取用户角色信息
  const { roleIds } = req.body;
  const menus = await menuService.getUserMenusByRolesTree(roleIds);
  res.send(menus);
});

export {
  createMenu,
  getAllMenus,
  getAllMenusForSelect,
  getMenu,
  updateMenu,
  deleteMenu,
  getUserMenus,
  getUserMenusTree,
};
