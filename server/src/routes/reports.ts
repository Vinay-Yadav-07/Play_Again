import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createReportSchema } from '../lib/schemas';
import { validateBody } from '../middleware/validate';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// POST /api/listings/:id/reports
router.post(
  '/:id/reports',
  authenticateToken,
  validateBody(createReportSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id: listingId } = req.params;
      const { reason, details } = req.body;

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

      const report = await prisma.report.create({
        data: {
          listingId,
          reporterId: req.user!.userId,
          reason,
          details: details || null,
          status: 'Pending',
        },
      });

      res.status(201).json({
        success: true,
        message: 'Thank you for keeping our sports community safe. Your report has been submitted for review.',
        data: { report },
      });
    } catch (error: any) {
      console.error('Report submission error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit report. Please try again.',
      });
    }
  }
);

export default router;
