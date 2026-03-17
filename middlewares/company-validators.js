import { body, param } from 'express-validator';
import checkValidators from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { validateAdminRole } from './validate-role.js';


export const validateCreateCompany = [
    validateJWT,
    validateAdminRole,
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre de la empresa es requerido')
        .isLength({ min: 3, max: 150 })
        .withMessage('El nombre debe tener entre 3 y 150 caracteres'),
    body('businessCategory')
        .notEmpty()
        .withMessage('La categoría empresarial es requerida')
        .isIn(['Tecnología', 'Manufactura', 'Servicios', 'Comercio', 'Otro'])
        .withMessage('Categoría no válida'),
    body('yearsOfExperience')
        .notEmpty()
        .withMessage('Los años de trayectoria son requeridos')
        .isInt({ min: 0, max: 200 })
        .withMessage('Los años deben estar entre 0 y 200'),
    body('impactLevel')
        .notEmpty()
        .withMessage('El nivel de impacto es requerido')
        .isIn(['Bajo', 'Medio', 'Alto', 'Muy Alto'])
        .withMessage('Nivel de impacto no válido'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede exceder 1000 caracteres'),
    body('contactPerson')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('El nombre del contacto no puede exceder 100 caracteres'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Correo electrónico no válido')
        .normalizeEmail(),
    body('phone')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('El teléfono no puede exceder 20 caracteres'),
    body('website')
        .optional()
        .trim()
        .isURL()
        .withMessage('URL no válida'),
    checkValidators,
];


export const validateUpdateCompany = [
    validateJWT,
    validateAdminRole,
    param('id')
        .notEmpty()
        .withMessage('El ID de la empresa es requerido'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage('El nombre debe tener entre 3 y 150 caracteres'),
    body('businessCategory')
        .optional()
        .isIn(['Tecnología', 'Manufactura', 'Servicios', 'Comercio', 'Otro'])
        .withMessage('Categoría no válida'),
    body('yearsOfExperience')
        .optional()
        .isInt({ min: 0, max: 200 })
        .withMessage('Los años deben estar entre 0 y 200'),
    body('impactLevel')
        .optional()
        .isIn(['Bajo', 'Medio', 'Alto', 'Muy Alto'])
        .withMessage('Nivel de impacto no válido'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede exceder 1000 caracteres'),
    body('contactPerson')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('El nombre del contacto no puede exceder 100 caracteres'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Correo electrónico no válido')
        .normalizeEmail(),
    body('phone')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('El teléfono no puede exceder 20 caracteres'),
    body('website')
        .optional()
        .trim()
        .isURL()
        .withMessage('URL no válida'),
    body('status')
        .optional()
        .isIn(['Activo', 'Inactivo', 'Suspendido'])
        .withMessage('Estado no válido'),
    checkValidators,
];
