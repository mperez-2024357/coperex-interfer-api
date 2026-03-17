import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../configs/config.js';

export const generateToken = (userData, options = {}) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId: userData.userId,
      email: userData.email,
      username: userData.username,
      role: userData.role || 'ADMIN_ROLE',
      jti: crypto.randomUUID(),
      iat: Math.floor(Date.now() / 1000),
    };

    const signOptions = {
      expiresIn: options.expiresIn || config.jwt.expiresIn || '24h',
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
    };

    jwt.sign(payload, config.jwt.secret, signOptions, (err, token) => {
      if (err) {
        console.error('Error generando JWT:', err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};


export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        console.error('Error verificando JWT:', err);
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const generateJWT = (userId, extraClaims = {}, options = {}) => {
  return new Promise((resolve, reject) => {
    const payload = {
      sub: String(userId),
      jti: crypto.randomUUID(),
      iat: Math.floor(Date.now() / 1000),
      ...extraClaims,
    };

    const signOptions = {
      expiresIn: options.expiresIn || config.jwt.expiresIn,
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
    };

    jwt.sign(payload, config.jwt.secret, signOptions, (err, token) => {
      if (err) {
        console.error('Error generating JWT:', err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        console.error('Error verifying JWT:', err);
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const verifyVerificationToken = (token) => {
  return verifyJWT(token);
};
