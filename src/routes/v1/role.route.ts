import express, { Router } from 'express';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import * as roleValidation from '../../validations/role.validation';
import * as roleController from '../../controllers/role.controller';
import { checkPermission } from '../../middlewares/permission';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), checkPermission('role-create'), validate(roleValidation.createRole), roleController.createRole)
  .get(auth(), validate(roleValidation.getRoles), roleController.getRoles);

router.route('/all').get(auth(), roleController.getAllRoles);

router
  .route('/:roleId')
  .get(auth(), validate(roleValidation.getRole), roleController.getRole)
  .patch(auth(), checkPermission('role-update'), validate(roleValidation.updateRole), roleController.updateRole)
  .delete(auth(), checkPermission('role-delete'), validate(roleValidation.deleteRole), roleController.deleteRole);

router.route('/:roleId/menus').post(auth(), validate(roleValidation.setRoleMenus), roleController.setRoleMenus);

router
  .route('/:roleId/permissions')
  .post(
    auth(),
    checkPermission('role-permission-update'),
    validate(roleValidation.setRolePermissions),
    roleController.setRolePermissions,
  );

export default router;
