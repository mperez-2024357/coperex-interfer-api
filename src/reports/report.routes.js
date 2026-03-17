import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateAdminRole } from '../../middlewares/validate-role.js';
import { requestLimit } from '../../middlewares/request-limit.js';
import { generateCompaniesExcel } from './report.controller.js';

const router = Router();


router.get(
  '/companies-excel',
  requestLimit,
  validateJWT,
  validateAdminRole,
  generateCompaniesExcel
);

export default router;
