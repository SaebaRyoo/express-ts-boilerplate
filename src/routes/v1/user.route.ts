import express, { Router } from 'express';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import * as userValidation from '../../validations/user.validation';
import * as userController from '../../controllers/user.controller';
import { checkPermission } from '../../middlewares/permission';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), checkPermission('user-create'), validate(userValidation.createUser), userController.createUser)
  .get(auth(), checkPermission('user-get'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth(), checkPermission('user-detail-get'), validate(userValidation.getUser), userController.getUser)
  .patch(auth(), checkPermission('user-detail-update'), validate(userValidation.updateUser), userController.updateUser)
  .delete(
    auth(),
    checkPermission('user-detail-delete'),
    validate(userValidation.deleteUser),
    userController.deleteUser,
  );

router
  .route('/:userId/roles')
  .post(
    auth(),
    checkPermission('user-role-update'),
    validate(userValidation.setUserRoles),
    userController.setUserRoles,
  );

export default router;
