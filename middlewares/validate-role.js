'use strict';

import { ADMIN_ROLE } from '../helpers/role-constants.js';


export const validateAdminRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado',
    });
  }

  if (req.user.role !== ADMIN_ROLE) {
    return res.status(403).json({
      success: false,
      message: 'Solo administradores pueden acceder a este recurso',
    });
  }

  next();
};


export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para acceder a este recurso',
      });
    }

    next();
  };
};