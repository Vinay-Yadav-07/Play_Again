export type SportCategory =
  | 'Cricket'
  | 'Football'
  | 'Badminton'
  | 'Basketball'
  | 'Tennis'
  | 'Fitness'
  | 'Other';

export type ListingType = 'sale' | 'swap' | 'rent';
export type ItemCondition = 'Like New' | 'Good' | 'Fair';
export type AvailabilityStatus = 'available' | 'reserved' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  isDemoUser?: boolean;
  createdAt: string;
  _count?: {
    listings: number;
    favourites: number;
    enquiriesReceived: number;
    enquiriesSent: number;
  };
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  sport: SportCategory;
  listingType: ListingType;
  condition: ItemCondition;
  price: number;
  rentalRate?: number | null;
  rentalPeriod?: string | null;
  desiredSwap?: string | null;
  images: string[];
  pickupArea: string;
  availability: AvailabilityStatus;
  isDemoListing: boolean;
  createdAt: string;
  updatedAt: string;
  isFavourited?: boolean;
  owner?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    isDemoUser?: boolean;
    createdAt?: string;
  };
}

export interface Favourite {
  id: string;
  createdAt: string;
  listing: Listing;
}

export interface Enquiry {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  message: string;
  proposedOffer?: number | null;
  rentalDates?: string | null;
  status: 'New' | 'Responded' | 'Closed';
  response?: string | null;
  createdAt: string;
  updatedAt: string;
  listing: {
    id: string;
    title: string;
    sport: string;
    listingType: string;
    price: number;
    rentalRate?: number | null;
    rentalPeriod?: string | null;
    images: string[];
    availability: string;
  };
  seller?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  buyer?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    email: string;
  };
}

export interface AnalyticsData {
  note: string;
  totals: {
    totalListings: number;
    availableListings: number;
    reservedListings: number;
    completedListings: number;
    demoListingsCount: number;
    userListingsCount: number;
    totalUsers: number;
    demoUsersCount: number;
    realUsersCount: number;
    totalEnquiries: number;
    totalFavourites: number;
  };
  listingsBySport: { sport: string; count: number }[];
  listingsByType: { type: string; count: number }[];
  enquiriesByStatus: { status: string; count: number }[];
}
