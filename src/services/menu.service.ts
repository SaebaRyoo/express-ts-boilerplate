import httpStatus from 'http-status';
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/typeorm.config';
import { Menu } from '../models/entities/menu.entity';
import ApiError from '../utils/ApiError';

const MenuRepository: Repository<Menu> = AppDataSource.getRepository('Menu');

/**
 * Create a menu
 */
const createMenu = async (menuBody: Partial<Menu>): Promise<Menu> => {
  const menu = MenuRepository.create(menuBody);
  return MenuRepository.save(menu);
};

/**
 * Get all menus (tree structure)
 */
const getAllMenus = async (): Promise<Menu[]> => {
  return MenuRepository.find({
    where: { isActive: true },
    relations: ['children'],
    order: { sort: 'ASC' },
  });
};

/**
 * Get menu by id
 */
const getMenuById = async (id: string): Promise<Menu | null> => {
  return MenuRepository.findOne({
    where: { id },
    relations: ['parent', 'children'],
  });
};

/**
 * Update menu by id
 */
const updateMenuById = async (menuId: string, updateBody: Partial<Menu>): Promise<Menu> => {
  const menu = await getMenuById(menuId);
  if (!menu) {
    throw new ApiError(httpStatus.NOT_FOUND, '菜单不存在');
  }

  Object.assign(menu, updateBody);
  return MenuRepository.save(menu);
};

/**
 * Delete menu by id
 */
const deleteMenuById = async (menuId: string): Promise<Menu> => {
  const menu = await getMenuById(menuId);
  if (!menu) {
    throw new ApiError(httpStatus.NOT_FOUND, '菜单不存在');
  }

  // 检查是否有子菜单
  if (menu.children && menu.children.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, '请先删除子菜单');
  }

  await MenuRepository.remove(menu);
  return menu;
};

/**
 * Get user menus by roles
 */
const getUserMenusByRoles = async (roleIds: string[]): Promise<Menu[]> => {
  if (!roleIds.length) return [];

  return MenuRepository.createQueryBuilder('menu')
    .innerJoin('menu.roles', 'role')
    .where('role.id IN (:...roleIds)', { roleIds })
    .andWhere('menu.isActive = :isActive', { isActive: true })
    .andWhere('menu.isVisible = :isVisible', { isVisible: true })
    .orderBy('menu.sort', 'ASC')
    .getMany();
};

/**
 * Build menu tree structure
 */
const buildMenuTree = (menus: Menu[]): Menu[] => {
  const menuMap = new Map<string, Menu>();
  const rootMenus: Menu[] = [];

  // 创建菜单映射
  menus.forEach((menu) => {
    menuMap.set(menu.id, { ...menu, children: [] });
  });

  // 构建树结构
  menus.forEach((menu) => {
    const menuItem = menuMap.get(menu.id)!;
    if (menu.parentId && menuMap.has(menu.parentId)) {
      const parent = menuMap.get(menu.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(menuItem);
    } else {
      rootMenus.push(menuItem);
    }
  });

  return rootMenus;
};

/**
 * Get all menus with minimal data (for dropdown/select)
 */
const getAllMenusForSelect = async (): Promise<Menu[]> => {
  return MenuRepository.find({
    where: { isActive: true },
    select: ['id', 'name', 'title', 'parentId'],
    order: { sort: 'ASC' },
  });
};

/**
 * Get user menus by roles (with tree structure)
 */
const getUserMenusByRolesTree = async (roleIds: string[]): Promise<Menu[]> => {
  const menus = await getUserMenusByRoles(roleIds);
  return buildMenuTree(menus);
};

export {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenuById,
  deleteMenuById,
  getUserMenusByRoles,
  buildMenuTree,
  getAllMenusForSelect,
  getUserMenusByRolesTree,
};
