'use strict';

import jwt from 'jsonwebtoken';


export const validateJWT = (req, res, next) => {
  const jwtConfig = {
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  };

  if (!jwtConfig.secret) {
    console.error('Error de validación JWT: JWT_SECRET no está definido');
    return res.status(500).json({
      success: false,
      message: 'Configuración del servidor inválida: falta JWT_SECRET',
    });
  }

  const token =
    req.header('x-token') || 
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No se proporcionó un token',
      error: 'MISSING_TOKEN',
    });
  }

  try {
    const verifyOptions = {};
    if (jwtConfig.issuer) verifyOptions.issuer = jwtConfig.issuer;
    if (jwtConfig.audience) verifyOptions.audience = jwtConfig.audience;

    const decoded = jwt.verify(token, jwtConfig.secret, verifyOptions);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('Error verificando JWT:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'El token ha expirado',
        error: 'TOKEN_EXPIRED',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        error: 'INVALID_TOKEN',
      });
    }

    res.status(401).json({
      success: false,
      message: 'Error al verificar el token',
    });
  }
};

