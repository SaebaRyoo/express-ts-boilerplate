import express, { Router } from 'express';
import validate from '../../middlewares/validate';
import * as userValidation from '../../validations/user.validation';
import * as userController from '../../controllers/user.controller';

const router: Router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(validate(userValidation.getUser), userController.getUser)
  .patch(validate(userValidation.updateUser), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.deleteUser);

router.route('/:userId/roles').post(validate(userValidation.setUserRoles), userController.setUserRoles);

export default router;
