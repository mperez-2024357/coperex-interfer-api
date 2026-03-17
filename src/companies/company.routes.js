import { Router } from 'express';
import {
  registerCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from './company.controller.js';
import { requestLimit } from '../../middlewares/request-limit.js';
import {
  validateCreateCompany,
  validateUpdateCompany,
} from '../../middlewares/company-validators.js';

const router = Router();

router.post(
  '/',
  requestLimit,
  validateCreateCompany,
  registerCompany
);

router.get('/', requestLimit, getCompanies);

router.get('/:id', requestLimit, getCompanyById);

router.put(
  '/:id',
  requestLimit,
  validateUpdateCompany,
  updateCompany
);

export default router;
