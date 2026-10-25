import { Router, Response, Request } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/analytics/counts
router.get('/counts', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalListings,
      availableListings,
      reservedListings,
      completedListings,
      demoListingsCount,
      userListingsCount,
      totalUsers,
      demoUsersCount,
      totalEnquiries,
      totalFavourites,
      listingsBySport,
      listingsByType,
      enquiriesByStatus,
    ] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({ where: { availability: 'available' } }),
      prisma.listing.count({ where: { availability: 'reserved' } }),
      prisma.listing.count({ where: { availability: 'completed' } }),
      prisma.listing.count({ where: { isDemoListing: true } }),
      prisma.listing.count({ where: { isDemoListing: false } }),
      prisma.user.count(),
      prisma.user.count({ where: { isDemoUser: true } }),
      prisma.enquiry.count(),
      prisma.favourite.count(),
      prisma.listing.groupBy({
        by: ['sport'],
        _count: { id: true },
      }),
      prisma.listing.groupBy({
        by: ['listingType'],
        _count: { id: true },
      }),
      prisma.enquiry.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        note: 'Live verifiable database statistics calculated from active SQLite records. Demo/seeded records are clearly delineated.',
        totals: {
          totalListings,
          availableListings,
          reservedListings,
          completedListings,
          demoListingsCount,
          userListingsCount,
          totalUsers,
          demoUsersCount,
          realUsersCount: totalUsers - demoUsersCount,
          totalEnquiries,
          totalFavourites,
        },
        listingsBySport: listingsBySport.map((g) => ({
          sport: g.sport,
          count: g._count.id,
        })),
        listingsByType: listingsByType.map((g) => ({
          type: g.listingType,
          count: g._count.id,
        })),
        enquiriesByStatus: enquiriesByStatus.map((g) => ({
          status: g.status,
          count: g._count.id,
        })),
      },
    });
  } catch (error: any) {
    console.error('Analytics query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics metrics.',
    });
  }
});

export default router;
