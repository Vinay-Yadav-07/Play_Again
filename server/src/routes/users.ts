import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { updateProfileSchema } from '../lib/schemas';
import { validateBody } from '../middleware/validate';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/users/me
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
          listings: {
            orderBy: { createdAt: 'desc' },
            include: {
              _count: {
                select: {
                  favourites: true,
                  enquiries: true,
                },
              },
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

      const formattedListings = user.listings.map((l) => ({
        ...l,
        images: (() => {
          try {
            return JSON.parse(l.images);
          } catch {
            return [l.images];
          }
        })(),
      }));

      res.status(200).json({
        success: true,
        data: {
          user: {
            ...user,
            listings: formattedListings,
          },
        },
      });
    } catch (error: any) {
      console.error('User profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve user profile.',
      });
    }
  }
);

// PATCH /api/users/me
router.patch(
  '/me',
  authenticateToken,
  validateBody(updateProfileSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { name, avatarUrl } = req.body;

      const updated = await prisma.user.update({
        where: { id: req.user!.userId },
        data: {
          ...(name && { name }),
          ...(avatarUrl !== undefined && { avatarUrl }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          isDemoUser: true,
          createdAt: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: { user: updated },
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile.',
      });
    }
  }
);

// GET /api/users/:id/public (Public seller profile)
router.get('/:id/public', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        isDemoUser: true,
        createdAt: true,
        listings: {
          where: { availability: 'available' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            sport: true,
            listingType: true,
            condition: true,
            price: true,
            rentalRate: true,
            rentalPeriod: true,
            images: true,
            pickupArea: true,
            availability: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User profile not found.',
      });
      return;
    }

    const formattedListings = user.listings.map((l) => ({
      ...l,
      images: (() => {
        try {
          return JSON.parse(l.images);
        } catch {
          return [l.images];
        }
      })(),
    }));

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user,
          listings: formattedListings,
        },
      },
    });
  } catch (error: any) {
    console.error('Public profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve public seller profile.',
    });
  }
});

export default router;
