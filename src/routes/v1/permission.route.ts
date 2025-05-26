import express, { Router } from 'express';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import * as permissionValidation from '../../validations/permission.validation';
import * as permissionController from '../../controllers/permission.controller';
import { checkPermission } from '../../middlewares/permission';

const router: Router = express.Router();

router
  .route('/')
  .post(
    auth(),
    checkPermission('permission-create'),
    validate(permissionValidation.createPermission),
    permissionController.createPermission,
  )
  .get(auth(), validate(permissionValidation.getPermissions), permissionController.getPermissions);

router
  .route('/:permissionId')
  .get(
    auth(),
    checkPermission('permission-get'),
    validate(permissionValidation.getPermission),
    permissionController.getPermission,
  )
  .patch(
    auth(),
    checkPermission('permission-update'),
    validate(permissionValidation.updatePermission),
    permissionController.updatePermission,
  )
  .delete(
    auth(),
    checkPermission('permission-delete'),
    validate(permissionValidation.deletePermission),
    permissionController.deletePermission,
  );

router.route('/all').get(auth(), permissionController.getAllPermissions);

export default router;
