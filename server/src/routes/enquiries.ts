import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createEnquirySchema, updateEnquiryStatusSchema } from '../lib/schemas';
import { validateBody } from '../middleware/validate';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/enquiries/sent (Buyer's sent enquiries)
router.get(
  '/sent',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const enquiries = await prisma.enquiry.findMany({
        where: { buyerId: req.user!.userId },
        orderBy: { createdAt: 'desc' },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              sport: true,
              listingType: true,
              price: true,
              rentalRate: true,
              rentalPeriod: true,
              images: true,
              availability: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      const formatted = enquiries.map((enq) => ({
        ...enq,
        listing: {
          ...enq.listing,
          images: (() => {
            try {
              return JSON.parse(enq.listing.images);
            } catch {
              return [enq.listing.images];
            }
          })(),
        },
      }));

      res.status(200).json({
        success: true,
        data: { enquiries: formatted },
      });
    } catch (error: any) {
      console.error('Sent enquiries error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve sent enquiries.',
      });
    }
  }
);

// GET /api/enquiries/received (Seller's received enquiries)
router.get(
  '/received',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const enquiries = await prisma.enquiry.findMany({
        where: { sellerId: req.user!.userId },
        orderBy: { createdAt: 'desc' },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              sport: true,
              listingType: true,
              price: true,
              rentalRate: true,
              rentalPeriod: true,
              images: true,
              availability: true,
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              email: true,
            },
          },
        },
      });

      const formatted = enquiries.map((enq) => ({
        ...enq,
        listing: {
          ...enq.listing,
          images: (() => {
            try {
              return JSON.parse(enq.listing.images);
            } catch {
              return [enq.listing.images];
            }
          })(),
        },
      }));

      res.status(200).json({
        success: true,
        data: { enquiries: formatted },
      });
    } catch (error: any) {
      console.error('Received enquiries error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve received enquiries.',
      });
    }
  }
);

// POST /api/listings/:id/enquiries (Send enquiry to seller)
router.post(
  '/:id/enquiries',
  authenticateToken,
  validateBody(createEnquirySchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id: listingId } = req.params;
      const { message, proposedOffer, rentalDates } = req.body;

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

      // Rule: Buyers cannot enquire on their own listing
      if (listing.ownerId === req.user!.userId) {
        res.status(400).json({
          success: false,
          error: 'You cannot enquire about your own equipment listing.',
        });
        return;
      }

      // Rule: Unavailable listings must reject new enquiries
      if (listing.availability !== 'available') {
        res.status(400).json({
          success: false,
          error: 'This listing is currently marked as unavailable or completed and is not accepting enquiries.',
        });
        return;
      }

      // Rule: Duplicate prevention (prevent identical enquiry within last 2 minutes)
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      const recentDuplicate = await prisma.enquiry.findFirst({
        where: {
          listingId,
          buyerId: req.user!.userId,
          message,
          createdAt: { gte: twoMinutesAgo },
        },
      });

      if (recentDuplicate) {
        res.status(429).json({
          success: false,
          error: 'You have recently sent an identical enquiry. Please wait a moment before sending another.',
        });
        return;
      }

      const enquiry = await prisma.enquiry.create({
        data: {
          listingId,
          buyerId: req.user!.userId,
          sellerId: listing.ownerId,
          message,
          proposedOffer: proposedOffer !== undefined ? proposedOffer : null,
          rentalDates: rentalDates || null,
          status: 'New',
        },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Your enquiry has been delivered to the seller! You can track responses in your dashboard.',
        data: { enquiry },
      });
    } catch (error: any) {
      console.error('Create enquiry error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send enquiry.',
      });
    }
  }
);

// PATCH /api/enquiries/:id/status (Seller updates enquiry status / response)
router.patch(
  '/:id/status',
  authenticateToken,
  validateBody(updateEnquiryStatusSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, response } = req.body;

      const enquiry = await prisma.enquiry.findUnique({
        where: { id },
      });

      if (!enquiry) {
        res.status(404).json({
          success: false,
          error: 'Enquiry not found.',
        });
        return;
      }

      // Only the seller or buyer can modify the enquiry
      if (enquiry.sellerId !== req.user!.userId && enquiry.buyerId !== req.user!.userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden: You do not have permission to update this enquiry.',
        });
        return;
      }

      const updated = await prisma.enquiry.update({
        where: { id },
        data: {
          status,
          ...(response !== undefined && { response }),
        },
      });

      res.status(200).json({
        success: true,
        message: 'Enquiry updated successfully.',
        data: { enquiry: updated },
      });
    } catch (error: any) {
      console.error('Update enquiry error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update enquiry status.',
      });
    }
  }
);

export default router;
