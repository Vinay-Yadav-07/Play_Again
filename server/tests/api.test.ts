import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/index';
import { prisma } from '../src/lib/prisma';

let userAToken: string;
let userAId: string;
let userBToken: string;
let userBId: string;
let createdListingId: string;
let unavailableListingId: string;

beforeAll(async () => {
  // Ensure DB connection is active
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('PlayAgain Sports Equipment Exchange — Automated Test Suite', () => {
  // 1. Registration validation
  describe('1. Registration Validation', () => {
    it('should reject registration if passwords do not match', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test Student',
        email: 'mismatch@campus.edu',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword!',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should successfully register a valid student user', async () => {
      const randomSuffix = Math.floor(Math.random() * 100000);
      const res = await request(app).post('/api/auth/register').send({
        name: 'User Alpha',
        email: `alpha.${randomSuffix}@campus.edu`,
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      userAToken = res.body.data.token;
      userAId = res.body.data.user.id;
    });

    it('should register a second student user for peer interaction tests', async () => {
      const randomSuffix = Math.floor(Math.random() * 100000);
      const res = await request(app).post('/api/auth/register').send({
        name: 'User Beta',
        email: `beta.${randomSuffix}@campus.edu`,
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      });
      expect(res.status).toBe(201);
      userBToken = res.body.data.token;
      userBId = res.body.data.user.id;
    });
  });

  // 2. Successful and invalid login
  describe('2. Authentication & Login Flow', () => {
    it('should reject login with incorrect password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'demo.seller@playagain.campus',
        password: 'WrongPassword999!',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should successfully login with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'demo.seller@playagain.campus',
        password: 'Demo123!',
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });
  });

  // 3. Public listing retrieval
  describe('3. Public Listing Retrieval', () => {
    it('should allow unauthenticated users to view public listings', async () => {
      const res = await request(app).get('/api/listings');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.listings)).toBe(true);
      expect(res.body.data.listings.length).toBeGreaterThan(0);
    });

    it('should retrieve single listing details by ID', async () => {
      const listRes = await request(app).get('/api/listings');
      const firstId = listRes.body.data.listings[0].id;

      const res = await request(app).get(`/api/listings/${firstId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.listing.id).toBe(firstId);
      expect(res.body.data.listing.owner).toBeDefined();
    });
  });

  // 4. Search and sport filtering
  describe('4. Search and Sport Filtering', () => {
    it('should filter listings by sport category (Cricket)', async () => {
      const res = await request(app).get('/api/listings?sport=Cricket');
      expect(res.status).toBe(200);
      expect(res.body.data.listings.length).toBeGreaterThan(0);
      res.body.data.listings.forEach((item: any) => {
        expect(item.sport).toBe('Cricket');
      });
    });

    it('should perform text search across title and description', async () => {
      const res = await request(app).get('/api/listings?search=Football');
      expect(res.status).toBe(200);
      expect(res.body.data.listings.length).toBeGreaterThan(0);
    });
  });

  // 5. Authenticated listing creation
  describe('5. Authenticated Listing Creation', () => {
    it('should allow logged-in user to create a sports equipment listing', async () => {
      const res = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'Yonex Muscle Power 29 Light Badminton Racket',
          description: 'Isometric carbon graphite frame with 26lbs tension. Used for one inter-college tournament.',
          sport: 'Badminton',
          listingType: 'sale',
          condition: 'Like New',
          price: 1100,
          images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'],
          pickupArea: 'Campus Badminton Court Reception Desk',
          termsAccepted: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.listing.title).toContain('Yonex Muscle Power');
      createdListingId = res.body.data.listing.id;
    });
  });

  // 6. Rejection of unauthenticated listing creation
  describe('6. Unauthenticated Protection', () => {
    it('should reject listing creation without authentication token', async () => {
      const res = await request(app)
        .post('/api/listings')
        .send({
          title: 'Unauthorized Cricket Gloves',
          description: 'High quality padded gloves',
          sport: 'Cricket',
          listingType: 'sale',
          condition: 'Good',
          price: 300,
          images: 'https://images.unsplash.com/test.jpg',
          pickupArea: 'Sports Complex',
          termsAccepted: true,
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // 7. Preventing edits to another user's listing
  describe("7. Listing Ownership Enforcement", () => {
    it("should prevent User B from editing User A's listing", async () => {
      const res = await request(app)
        .patch(`/api/listings/${createdListingId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          title: 'Hacked Title Attempt',
          price: 50,
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("should allow User A (the owner) to edit their own listing", async () => {
      const res = await request(app)
        .patch(`/api/listings/${createdListingId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          price: 950,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.listing.price).toBe(950);
    });
  });

  // 8. Adding/removing favourites
  describe('8. Favourites Persistence', () => {
    it('should add a listing to user favourites', async () => {
      const res = await request(app)
        .post(`/api/favourites/${createdListingId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should retrieve user favourites list', async () => {
      const res = await request(app)
        .get('/api/favourites')
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(200);
      const ids = res.body.data.favourites.map((f: any) => f.listing.id);
      expect(ids).toContain(createdListingId);
    });

    it('should remove a listing from user favourites', async () => {
      const res = await request(app)
        .delete(`/api/favourites/${createdListingId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // 9. Creating an enquiry
  describe('9. Enquiry Flow', () => {
    it('should allow User B (buyer) to send an enquiry to User A (seller)', async () => {
      const res = await request(app)
        .post(`/api/listings/${createdListingId}/enquiries`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          message: 'Hello! Can we meet at the badminton reception desk at 5 PM today for inspection?',
          proposedOffer: 900,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.enquiry.message).toContain('badminton reception desk');
    });
  });

  // 10. Preventing enquiries on one's own listing
  describe("10. Self-Enquiry Prevention", () => {
    it('should prevent an owner from enquiring on their own listing', async () => {
      const res = await request(app)
        .post(`/api/listings/${createdListingId}/enquiries`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          message: 'Can I buy my own item?',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('own');
    });
  });

  // 11. Rejecting enquiries on unavailable listings
  describe('11. Unavailable Listing Rule', () => {
    it('should reject enquiries on items marked as reserved or completed', async () => {
      // First, mark the listing as reserved
      await request(app)
        .patch(`/api/listings/${createdListingId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          availability: 'reserved',
        });

      // User B attempts to enquire on reserved item
      const res = await request(app)
        .post(`/api/listings/${createdListingId}/enquiries`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          message: 'Is this item still available despite being reserved?',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('unavailable');
    });
  });

  // 12. Invalid prices and malformed data
  describe('12. Validation of Malformed Data & Negative Prices', () => {
    it('should reject negative listing price', async () => {
      const res = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'Negative Price Bat',
          description: 'This has an invalid price configuration',
          sport: 'Cricket',
          listingType: 'sale',
          condition: 'Fair',
          price: -500,
          images: 'https://images.unsplash.com/bat.jpg',
          pickupArea: 'Pavilion',
          termsAccepted: true,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject rental listing without rental rate', async () => {
      const res = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'Rental Cricket Kit',
          description: 'Full kit available for weekend inter-hostel matches',
          sport: 'Cricket',
          listingType: 'rent',
          condition: 'Good',
          price: 0,
          rentalRate: null, // Missing required rental rate
          images: 'https://images.unsplash.com/kit.jpg',
          pickupArea: 'Grounds',
          termsAccepted: true,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
