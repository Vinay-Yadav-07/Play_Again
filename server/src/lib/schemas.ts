import { z } from 'zod';

export const SportEnum = z.enum([
  'Cricket',
  'Football',
  'Badminton',
  'Basketball',
  'Tennis',
  'Fitness',
  'Other',
]);

export const ListingTypeEnum = z.enum(['sale', 'swap', 'rent']);
export const ConditionEnum = z.enum(['Like New', 'Good', 'Fair']);
export const AvailabilityEnum = z.enum(['available', 'reserved', 'completed']);

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const createListingSchema = z
  .object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120),
    description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000),
    sport: SportEnum,
    listingType: ListingTypeEnum,
    condition: ConditionEnum,
    price: z.coerce.number().min(0, 'Price must be non-negative'),
    rentalRate: z.coerce.number().min(0, 'Rental rate must be non-negative').optional().nullable(),
    rentalPeriod: z.string().trim().max(50).optional().nullable(),
    desiredSwap: z.string().trim().max(200).optional().nullable(),
    images: z.union([z.string().min(1, 'At least one image is required'), z.array(z.string()).min(1, 'At least one image is required')]),
    pickupArea: z.string().trim().min(2, 'General pickup area is required').max(150),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must acknowledge the terms and safety guidelines',
    }),
  })
  .refine(
    (data) => {
      if (data.listingType === 'rent') {
        return data.rentalRate !== undefined && data.rentalRate !== null && data.rentalRate >= 0;
      }
      return true;
    },
    {
      message: 'Rental rate is required for rental listings',
      path: ['rentalRate'],
    }
  )
  .refine(
    (data) => {
      if (data.listingType === 'swap') {
        return Boolean(data.desiredSwap && data.desiredSwap.trim().length > 0);
      }
      return true;
    },
    {
      message: 'Desired swap item description is required for swap listings',
      path: ['desiredSwap'],
    }
  );

export const updateListingSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  description: z.string().trim().min(10).max(2000).optional(),
  sport: SportEnum.optional(),
  listingType: ListingTypeEnum.optional(),
  condition: ConditionEnum.optional(),
  price: z.coerce.number().min(0).optional(),
  rentalRate: z.coerce.number().min(0).optional().nullable(),
  rentalPeriod: z.string().trim().max(50).optional().nullable(),
  desiredSwap: z.string().trim().max(200).optional().nullable(),
  images: z.union([z.string(), z.array(z.string())]).optional(),
  pickupArea: z.string().trim().min(2).max(150).optional(),
  availability: AvailabilityEnum.optional(),
});

export const createEnquirySchema = z.object({
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(1000),
  proposedOffer: z.coerce.number().min(0, 'Proposed offer must be non-negative').optional().nullable(),
  rentalDates: z.string().trim().max(100).optional().nullable(),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(['New', 'Responded', 'Closed']),
  response: z.string().trim().max(1000).optional().nullable(),
});

export const createReportSchema = z.object({
  reason: z.string().trim().min(3, 'Reason is required').max(100),
  details: z.string().trim().max(1000).optional().nullable(),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  avatarUrl: z.string().trim().url().optional().nullable(),
});
