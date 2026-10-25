import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../lib/jwt';
import { prisma } from '../lib/prisma';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload & {
    name?: string;
  };
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in to continue.',
    });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired session. Please log in again.',
    });
    return;
  }

  // Ensure user still exists in database
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    res.status(401).json({
      success: false,
      error: 'User account no longer exists.',
    });
    return;
  }

  req.user = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  next();
}

export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true, role: true },
      });
      if (user) {
        req.user = {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    }
  }
  next();
}
