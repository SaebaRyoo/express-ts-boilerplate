import express, { Router } from 'express';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import * as menuValidation from '../../validations/menu.validation';
import * as menuController from '../../controllers/menu.controller';
import { checkPermission } from '../../middlewares/permission';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), checkPermission('menu-create'), validate(menuValidation.createMenu), menuController.createMenu)
  .get(auth(), menuController.getAllMenus);

router.route('/select').get(auth(), menuController.getAllMenusForSelect);

router.route('/user-menus').post(auth(), validate(menuValidation.getUserMenus), menuController.getUserMenus);

router.route('/user-menus-tree').post(auth(), validate(menuValidation.getUserMenus), menuController.getUserMenusTree);

router
  .route('/:menuId')
  .get(auth(), validate(menuValidation.getMenu), menuController.getMenu)
  .patch(auth(), checkPermission('menu-update'), validate(menuValidation.updateMenu), menuController.updateMenu)
  .delete(auth(), checkPermission('menu-delete'), validate(menuValidation.deleteMenu), menuController.deleteMenu);

export default router;
