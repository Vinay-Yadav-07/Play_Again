import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting deterministic database seed for PlayAgain ---');

  // Clean existing tables safely
  await prisma.report.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.favourite.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash('Demo123!', 10);

  // 1. Create Demo Users
  const demoSeller = await prisma.user.create({
    data: {
      name: 'Rohan Verma (Demo Seller)',
      email: 'demo.seller@playagain.campus',
      passwordHash: defaultPasswordHash,
      role: 'seller',
      isDemoUser: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
  });

  const demoBuyer = await prisma.user.create({
    data: {
      name: 'Aarav Sharma (Demo Buyer)',
      email: 'demo.buyer@playagain.campus',
      passwordHash: defaultPasswordHash,
      role: 'user',
      isDemoUser: true,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    },
  });

  const clubUser = await prisma.user.create({
    data: {
      name: 'Campus Badminton Club (Demo)',
      email: 'badminton.club@playagain.campus',
      passwordHash: defaultPasswordHash,
      role: 'club',
      isDemoUser: true,
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80',
    },
  });

  console.log('Created 3 demo accounts:');
  console.log(' - demo.seller@playagain.campus (Demo123!)');
  console.log(' - demo.buyer@playagain.campus (Demo123!)');
  console.log(' - badminton.club@playagain.campus (Demo123!)');

  // 2. Create Realistic Demo Listings
  const sampleListings = [
    {
      ownerId: demoSeller.id,
      title: 'SS Kashmir Willow Cricket Bat (SH - 1200g)',
      description: 'Used for two college tournament seasons. Knocked in with oiled finish and anti-scuff toe guard intact. Perfect balanced pickup for college club matches or weekend practice nets. Selling because I upgraded to English Willow.',
      sport: 'Cricket',
      listingType: 'sale',
      condition: 'Good',
      price: 650,
      rentalRate: null,
      rentalPeriod: null,
      desiredSwap: null,
      images: JSON.stringify(['/gear/cricket_bat.jpg']),
      pickupArea: 'Campus North Sports Pavilion (Grounds Office)',
      availability: 'available',
      isDemoListing: true,
    },
    {
      ownerId: demoBuyer.id,
      title: 'Nivia Storm Football (Size 5) + Shin Guards Set',
      description: 'Barely used football with high air retention bladder. Includes a pair of medium size Nivia hard-shell shin guards with padded ankles. Excellent for campus 7-a-side turf leagues.',
      sport: 'Football',
      listingType: 'sale',
      condition: 'Like New',
      price: 450,
      rentalRate: null,
      rentalPeriod: null,
      desiredSwap: null,
      images: JSON.stringify(['/gear/football.jpg']),
      pickupArea: 'Student Activity Center (SAC) Courtyard',
      availability: 'available',
      isDemoListing: true,
    },
    {
      ownerId: clubUser.id,
      title: 'Yonex Nanoray 10F Badminton Racket (Strung @ 24lbs)',
      description: 'Isometric head with headlight balance for fast defensive play. Recently restrung with BG-65 strings at 24 lbs tension. Grip has fresh overgrip wrap. Interested in swapping for an even-balance racket or badminton kit bag.',
      sport: 'Badminton',
      listingType: 'swap',
      condition: 'Good',
      price: 0,
      rentalRate: null,
      rentalPeriod: null,
      desiredSwap: 'Looking to swap for Yonex Astrox racket or 3-racket thermal kit bag',
      images: JSON.stringify(['/gear/badminton_racket.jpg']),
      pickupArea: 'Campus Indoor Sports Complex (Badminton Court 2)',
      availability: 'available',
      isDemoListing: true,
    },
    {
      ownerId: demoSeller.id,
      title: 'SG Campus Cricket Wicketkeeping Pads & Gloves Combo',
      description: 'High-density foam pads with compact wrap-around shape and cotton-palm keeping gloves. Available for short-term rental during inter-hostel matches or weekend friendly fixtures.',
      sport: 'Cricket',
      listingType: 'rent',
      condition: 'Good',
      price: 0,
      rentalRate: 120,
      rentalPeriod: 'per match day',
      desiredSwap: null,
      images: JSON.stringify(['/gear/cricket_pads.jpg']),
      pickupArea: 'Hostel Block 3 Common Room / Kit Desk',
      availability: 'available',
      isDemoListing: true,
    },
    {
      ownerId: demoBuyer.id,
      title: 'Spalding NBA Outdoor All-Surface Basketball (Size 7)',
      description: 'Durable rubber composite grip designed specifically for concrete outdoor courts. Good bounce and deep pebbles. Ideal for college pickup games and afternoon hoops.',
      sport: 'Basketball',
      listingType: 'sale',
      condition: 'Fair',
      price: 320,
      rentalRate: null,
      rentalPeriod: null,
      desiredSwap: null,
      images: JSON.stringify(['/gear/basketball.jpg']),
      pickupArea: 'Outdoor Basketball Courts, Gate 2',
      availability: 'available',
      isDemoListing: true,
    },
    {
      ownerId: demoSeller.id,
      title: 'Domyos 10kg Adjustable Dumbbells Pair (Chrome Plates)',
      description: 'Pair of threaded metal bars with spinlock collars and cast iron plates (4x 1.25kg, 4x 0.5kg plates). Ideal for hostel room workouts and progressive strength training without needing a costly gym membership.',
      sport: 'Fitness',
      listingType: 'rent',
      condition: 'Like New',
      price: 0,
      rentalRate: 180,
      rentalPeriod: 'per month',
      desiredSwap: null,
      images: JSON.stringify(['/gear/dumbbells.jpg']),
      pickupArea: 'Hostel Block D Reception Desk',
      availability: 'available',
      isDemoListing: true,
    },
    {
      ownerId: clubUser.id,
      title: 'Wilson Tour Slam Adult Tennis Racket (Strung 4 3/8)',
      description: 'Over-sized 112 sq inch sweet spot providing effortless power and vibration dampening. Clean frame with minor edge scuffs from court use. Comes with protective sleeve.',
      sport: 'Tennis',
      listingType: 'sale',
      condition: 'Good',
      price: 950,
      rentalRate: null,
      rentalPeriod: null,
      desiredSwap: null,
      images: JSON.stringify(['/gear/tennis_racket.jpg']),
      pickupArea: 'North Lawn Tennis Court Club Desk',
      availability: 'available',
      isDemoListing: true,
    },
    {
      ownerId: demoBuyer.id,
      title: 'Decathlon Quechua 20L Sports Backpack + Shaker Bottle',
      description: 'Ventilated back lightweight sports bag with dedicated shoe compartment and 700ml leak-proof protein shaker. Mint condition, used only twice for campus marathons.',
      sport: 'Other',
      listingType: 'swap',
      condition: 'Like New',
      price: 0,
      rentalRate: null,
      rentalPeriod: null,
      desiredSwap: 'Looking to swap for resistance bands set or foam roller',
      images: JSON.stringify(['/gear/backpack.jpg']),
      pickupArea: 'Main College Library Plaza',
      availability: 'available',
      isDemoListing: true,
    },
  ];

  const createdListings = [];
  for (const item of sampleListings) {
    const created = await prisma.listing.create({ data: item });
    createdListings.push(created);
  }
  console.log(`Created ${createdListings.length} demonstration sports listings.`);

  // 3. Create Sample Enquiry (Buyer to Seller)
  const sampleEnquiry = await prisma.enquiry.create({
    data: {
      listingId: createdListings[0].id, // Cricket Bat
      buyerId: demoBuyer.id,
      sellerId: demoSeller.id,
      message: 'Hi Rohan! Is the SS Cricket bat still available for practice this Saturday? Can we meet at the North Pavilion around 4:30 PM for inspection?',
      proposedOffer: 600,
      rentalDates: null,
      status: 'New',
    },
  });
  console.log(`Created sample enquiry ID: ${sampleEnquiry.id}`);

  // 4. Create Sample Favourite
  await prisma.favourite.create({
    data: {
      userId: demoBuyer.id,
      listingId: createdListings[0].id,
    },
  });
  await prisma.favourite.create({
    data: {
      userId: demoBuyer.id,
      listingId: createdListings[2].id, // Badminton
    },
  });
  console.log('Created sample favourites for demo buyer.');

  console.log('--- Database seeding completed successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
