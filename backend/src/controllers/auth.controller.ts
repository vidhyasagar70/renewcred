import { Request, Response } from 'express';

/**
 * Placeholder auth controller.
 * Implement business logic in follow-up iterations.
 */

export const register = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' });
};

export const login = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' });
};

export const getMe = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' });
};
