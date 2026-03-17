'use strict';

import { body } from 'express-validator';
import checkValidators from './checkValidators.js';

export const validateLogin = [
  body('emailOrUsername')
    .trim()
    .notEmpty()
    .withMessage('El email o usuario es requerido')
    .isLength({ min: 3, max: 100 })
    .withMessage('El email o usuario debe tener entre 3 y 100 caracteres'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener mínimo 8 caracteres'),
  checkValidators,
];

export const validateCreateAdmin = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('surname')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3, max: 50 })
    .withMessage('El usuario debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('El usuario solo puede contener letras, números, guiones y guiones bajos'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo es requerido')
    .isEmail()
    .withMessage('Correo electrónico no válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener mínimo 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]/)
    .withMessage('La contraseña debe contener mayúscula, minúscula, número y carácter especial'),
  checkValidators,
];