import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateAdminRole } from '../../middlewares/validate-role.js';
import { authRateLimit } from '../../middlewares/request-limit.js';
import {
  validateLogin,
  validateCreateAdmin,
} from '../../middlewares/user-validators.js';

const router = Router();

router.post('/login', authRateLimit, validateLogin, authController.login);

router.post(
  '/register',
  authRateLimit,
  validateJWT,
  validateAdminRole,
  validateCreateAdmin,
  authController.register
);

export default router;
