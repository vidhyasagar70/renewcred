import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { createError } from './errorHandler';

export interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request to carry the decoded user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Protects routes by validating the Bearer JWT in the Authorization header.
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(createError('No token provided. Access denied.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    next(createError('Invalid or expired token.', 401));
  }
}

/**
 * Role-based access control guard.
 * Usage: router.get('/admin', authenticate, authorize('admin'), handler)
 */
export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        createError('You do not have permission to access this resource.', 403)
      );
    }
    next();
  };
}
