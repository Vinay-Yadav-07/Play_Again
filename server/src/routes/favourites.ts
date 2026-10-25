import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/favourites
router.get(
  '/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const favourites = await prisma.favourite.findMany({
        where: { userId: req.user!.userId },
        orderBy: { createdAt: 'desc' },
        include: {
          listing: {
            include: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      });

      const formatted = favourites.map((fav) => ({
        id: fav.id,
        createdAt: fav.createdAt,
        listing: {
          ...fav.listing,
          images: (() => {
            try {
              return JSON.parse(fav.listing.images);
            } catch {
              return [fav.listing.images];
            }
          })(),
          isFavourited: true,
        },
      }));

      res.status(200).json({
        success: true,
        data: { favourites: formatted },
      });
    } catch (error: any) {
      console.error('Get favourites error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve favourites.',
      });
    }
  }
);

// POST /api/favourites/:listingId
router.post(
  '/:listingId',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { listingId } = req.params;

      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
      });

      if (!listing) {
        res.status(404).json({
          success: false,
          error: 'Listing not found.',
        });
        return;
      }

      // Check if already favourited
      const existing = await prisma.favourite.findUnique({
        where: {
          userId_listingId: {
            userId: req.user!.userId,
            listingId,
          },
        },
      });

      if (existing) {
        res.status(200).json({
          success: true,
          message: 'Listing is already in your favourites.',
          data: { favourite: existing },
        });
        return;
      }

      const favourite = await prisma.favourite.create({
        data: {
          userId: req.user!.userId,
          listingId,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Saved to favourites.',
        data: { favourite },
      });
    } catch (error: any) {
      console.error('Add favourite error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add to favourites.',
      });
    }
  }
);

// DELETE /api/favourites/:listingId
router.delete(
  '/:listingId',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { listingId } = req.params;

      await prisma.favourite.deleteMany({
        where: {
          userId: req.user!.userId,
          listingId,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Removed from favourites.',
      });
    } catch (error: any) {
      console.error('Remove favourite error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove from favourites.',
      });
    }
  }
);

export default router;
