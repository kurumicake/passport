import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated() && req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  };