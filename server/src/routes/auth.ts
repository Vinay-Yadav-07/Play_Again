import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { generateToken } from '../lib/jwt';
import { registerSchema, loginSchema } from '../lib/schemas';
import { validateBody } from '../middleware/validate';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  validateBody(registerSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'An account with this email address already exists.',
        });
        return;
      }

      // Hash password securely with bcrypt
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'user',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
        },
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to PlayAgain.',
        data: {
          user,
          token,
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create account. Please try again.',
      });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  validateBody(loginSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Generic error message to prevent user enumeration
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password.',
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password.',
        });
        return;
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
            isDemoUser: user.isDemoUser,
            createdAt: user.createdAt,
          },
          token,
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to log in. Please try again.',
      });
    }
  }
);

// POST /api/auth/logout
router.post('/logout', (req: AuthenticatedRequest, res: Response): void => {
  // Client discards JWT; server confirms logout
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// GET /api/auth/me
router.get(
  '/me',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          isDemoUser: true,
          createdAt: true,
          _count: {
            select: {
              listings: true,
              favourites: true,
              enquiriesReceived: true,
              enquiriesSent: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      console.error('Get me error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve user profile.',
      });
    }
  }
);

export default router;
