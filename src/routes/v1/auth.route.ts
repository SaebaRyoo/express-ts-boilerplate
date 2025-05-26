import express, { Router } from 'express';
import validate from '../../middlewares/validate';
import * as authValidation from '../../validations/auth.validation';
import * as authController from '../../controllers/auth.controller';

const router: Router = express.Router();

router.post('/register', validate(authValidation.register), authController.registerUser);
router.post('/login', validate(authValidation.login), authController.loginUser);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

export default router;
