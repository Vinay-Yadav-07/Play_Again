import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../lib/prisma';
import { createListingSchema, updateListingSchema, createEnquirySchema } from '../lib/schemas';
import { validateBody } from '../middleware/validate';
import { authenticateToken, optionalAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Ensure uploads directory exists safely
const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage setup for safe image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // Generate safe random hex filename to prevent traversal attacks
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `gear-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP image formats are permitted.'));
    }
  },
});

// POST /api/listings/upload (Upload single image)
router.post(
  '/upload',
  authenticateToken,
  upload.single('image'),
  (req: AuthenticatedRequest, res: Response): void => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No image file uploaded or invalid file format.',
      });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      data: { url: fileUrl },
    });
  }
);

// GET /api/listings (Browse & search with filters)
router.get(
  '/',
  optionalAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const {
        search,
        sport,
        listingType,
        condition,
        minPrice,
        maxPrice,
        availability,
        sortBy = 'newest',
        page = '1',
        limit = '12',
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
      const skip = (pageNum - 1) * limitNum;

      // Construct filter query for SQLite
      const where: any = {};

      if (sport && typeof sport === 'string' && sport !== 'All') {
        where.sport = sport;
      }

      if (listingType && typeof listingType === 'string' && listingType !== 'All') {
        where.listingType = listingType;
      }

      if (condition && typeof condition === 'string' && condition !== 'All') {
        where.condition = condition;
      }

      if (availability && typeof availability === 'string' && availability !== 'All') {
        where.availability = availability;
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined && minPrice !== '') {
          where.price.gte = parseFloat(minPrice as string) || 0;
        }
        if (maxPrice !== undefined && maxPrice !== '') {
          where.price.lte = parseFloat(maxPrice as string) || 1000000;
        }
      }

      if (search && typeof search === 'string' && search.trim().length > 0) {
        const queryTerm = search.trim();
        where.OR = [
          { title: { contains: queryTerm } },
          { description: { contains: queryTerm } },
          { sport: { contains: queryTerm } },
        ];
      }

      // Determine sorting order
      let orderBy: any = { createdAt: 'desc' };
      if (sortBy === 'price_asc') {
        orderBy = { price: 'asc' };
      } else if (sortBy === 'price_desc') {
        orderBy = { price: 'desc' };
      }

      const [total, listings] = await Promise.all([
        prisma.listing.count({ where }),
        prisma.listing.findMany({
          where,
          orderBy,
          skip,
          take: limitNum,
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                isDemoUser: true,
              },
            },
            favourites: req.user
              ? {
                  where: { userId: req.user.userId },
                  select: { id: true },
                }
              : false,
          },
        }),
      ]);

      const formattedListings = listings.map((item) => ({
        ...item,
        images: (() => {
          try {
            return JSON.parse(item.images);
          } catch {
            return [item.images];
          }
        })(),
        isFavourited: req.user ? item.favourites && item.favourites.length > 0 : false,
      }));

      res.status(200).json({
        success: true,
        data: {
          listings: formattedListings,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum) || 1,
          },
        },
      });
    } catch (error: any) {
      console.error('Listings query error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve listings.',
      });
    }
  }
);

// GET /api/listings/:id (Single listing details with similar items)
router.get(
  '/:id',
  optionalAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              isDemoUser: true,
              createdAt: true,
            },
          },
          favourites: req.user
            ? {
                where: { userId: req.user.userId },
                select: { id: true },
              }
            : false,
        },
      });

      if (!listing) {
        res.status(404).json({
          success: false,
          error: 'Listing not found.',
        });
        return;
      }

      // Fetch similar listings in same sport category
      const similarListings = await prisma.listing.findMany({
        where: {
          sport: listing.sport,
          id: { not: listing.id },
          availability: 'available',
        },
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      const formattedListing = {
        ...listing,
        images: (() => {
          try {
            return JSON.parse(listing.images);
          } catch {
            return [listing.images];
          }
        })(),
        isFavourited: req.user ? listing.favourites && listing.favourites.length > 0 : false,
      };

      const formattedSimilar = similarListings.map((item) => ({
        ...item,
        images: (() => {
          try {
            return JSON.parse(item.images);
          } catch {
            return [item.images];
          }
        })(),
      }));

      res.status(200).json({
        success: true,
        data: {
          listing: formattedListing,
          similarListings: formattedSimilar,
        },
      });
    } catch (error: any) {
      console.error('Listing detail error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve listing details.',
      });
    }
  }
);

// POST /api/listings (Create new listing)
router.post(
  '/',
  authenticateToken,
  validateBody(createListingSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const {
        title,
        description,
        sport,
        listingType,
        condition,
        price,
        rentalRate,
        rentalPeriod,
        desiredSwap,
        images,
        pickupArea,
      } = req.body;

      const serializedImages = Array.isArray(images)
        ? JSON.stringify(images)
        : JSON.stringify([images]);

      const newListing = await prisma.listing.create({
        data: {
          ownerId: req.user!.userId,
          title,
          description,
          sport,
          listingType,
          condition,
          price: listingType === 'swap' ? 0 : price,
          rentalRate: listingType === 'rent' ? rentalRate : null,
          rentalPeriod: listingType === 'rent' ? rentalPeriod || 'per day' : null,
          desiredSwap: listingType === 'swap' ? desiredSwap : null,
          images: serializedImages,
          pickupArea,
          availability: 'available',
          isDemoListing: false,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Equipment listing published successfully!',
        data: {
          listing: {
            ...newListing,
            images: JSON.parse(newListing.images),
          },
        },
      });
    } catch (error: any) {
      console.error('Create listing error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create listing. Please try again.',
      });
    }
  }
);

// PATCH /api/listings/:id (Update listing - owner only)
router.patch(
  '/:id',
  authenticateToken,
  validateBody(updateListingSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const listing = await prisma.listing.findUnique({
        where: { id },
      });

      if (!listing) {
        res.status(404).json({
          success: false,
          error: 'Listing not found.',
        });
        return;
      }

      // Strictly verify ownership
      if (listing.ownerId !== req.user!.userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden: You do not have permission to modify this listing.',
        });
        return;
      }

      const updateData: any = { ...req.body };

      if (updateData.images) {
        updateData.images = Array.isArray(updateData.images)
          ? JSON.stringify(updateData.images)
          : JSON.stringify([updateData.images]);
      }

      const updated = await prisma.listing.update({
        where: { id },
        data: updateData,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Listing updated successfully.',
        data: {
          listing: {
            ...updated,
            images: (() => {
              try {
                return JSON.parse(updated.images);
              } catch {
                return [updated.images];
              }
            })(),
          },
        },
      });
    } catch (error: any) {
      console.error('Update listing error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update listing.',
      });
    }
  }
);

// DELETE /api/listings/:id (Delete listing - owner only)
router.delete(
  '/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const listing = await prisma.listing.findUnique({
        where: { id },
      });

      if (!listing) {
        res.status(404).json({
          success: false,
          error: 'Listing not found.',
        });
        return;
      }

      // Strictly verify ownership
      if (listing.ownerId !== req.user!.userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden: You do not have permission to delete this listing.',
        });
        return;
      }

      await prisma.listing.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Listing removed successfully.',
      });
    } catch (error: any) {
      console.error('Delete listing error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete listing.',
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

export default router;
