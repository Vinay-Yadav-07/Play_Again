import { Listing, Favourite, Enquiry, User, AnalyticsData } from '../types';

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function getToken(): string | null {
  return localStorage.getItem('playagain_token');
}

export function setToken(token: string): void {
  localStorage.setItem('playagain_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('playagain_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.error || 'A network error occurred. Please try again.',
      response.status,
      data.details
    );
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    async register(payload: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) {
      const res = await request<{
        success: boolean;
        message: string;
        data: { user: User; token: string };
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setToken(res.data.token);
      return res.data;
    },

    async login(payload: { email: string; password: string }) {
      const res = await request<{
        success: boolean;
        message: string;
        data: { user: User; token: string };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setToken(res.data.token);
      return res.data;
    },

    async logout() {
      try {
        await request('/auth/logout', { method: 'POST' });
      } finally {
        clearToken();
      }
    },

    async getMe() {
      const res = await request<{ success: boolean; data: { user: User } }>('/auth/me');
      return res.data.user;
    },
  },

  // Listings
  listings: {
    async getAll(params: Record<string, string | number | undefined> = {}) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
      const res = await request<{
        success: boolean;
        data: {
          listings: Listing[];
          pagination: { total: number; page: number; limit: number; totalPages: number };
        };
      }>(`/listings?${query.toString()}`);
      return res.data;
    },

    async getById(id: string) {
      const res = await request<{
        success: boolean;
        data: { listing: Listing; similarListings: Listing[] };
      }>(`/listings/${id}`);
      return res.data;
    },

    async create(listingData: any) {
      const res = await request<{
        success: boolean;
        message: string;
        data: { listing: Listing };
      }>('/listings', {
        method: 'POST',
        body: JSON.stringify(listingData),
      });
      return res.data.listing;
    },

    async update(id: string, updateData: any) {
      const res = await request<{
        success: boolean;
        message: string;
        data: { listing: Listing };
      }>(`/listings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
      return res.data.listing;
    },

    async delete(id: string) {
      return request<{ success: boolean; message: string }>(`/listings/${id}`, {
        method: 'DELETE',
      });
    },

    async uploadImage(file: File) {
      const formData = new FormData();
      formData.append('image', file);
      const res = await request<{ success: boolean; data: { url: string } }>(
        '/listings/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      return res.data.url;
    },
  },

  // Favourites
  favourites: {
    async getAll() {
      const res = await request<{ success: boolean; data: { favourites: Favourite[] } }>(
        '/favourites'
      );
      return res.data.favourites;
    },

    async add(listingId: string) {
      return request<{ success: boolean; message: string }>(`/favourites/${listingId}`, {
        method: 'POST',
      });
    },

    async remove(listingId: string) {
      return request<{ success: boolean; message: string }>(`/favourites/${listingId}`, {
        method: 'DELETE',
      });
    },
  },

  // Enquiries
  enquiries: {
    async getSent() {
      const res = await request<{ success: boolean; data: { enquiries: Enquiry[] } }>(
        '/enquiries/sent'
      );
      return res.data.enquiries;
    },

    async getReceived() {
      const res = await request<{ success: boolean; data: { enquiries: Enquiry[] } }>(
        '/enquiries/received'
      );
      return res.data.enquiries;
    },

    async create(
      listingId: string,
      payload: { message: string; proposedOffer?: number; rentalDates?: string }
    ) {
      const res = await request<{
        success: boolean;
        message: string;
        data: { enquiry: Enquiry };
      }>(`/listings/${listingId}/enquiries`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res.data.enquiry;
    },

    async updateStatus(
      enquiryId: string,
      payload: { status: 'New' | 'Responded' | 'Closed'; response?: string }
    ) {
      const res = await request<{
        success: boolean;
        message: string;
        data: { enquiry: Enquiry };
      }>(`/enquiries/${enquiryId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      return res.data.enquiry;
    },
  },

  // Reports
  reports: {
    async create(listingId: string, payload: { reason: string; details?: string }) {
      return request<{ success: boolean; message: string }>(
        `/listings/${listingId}/reports`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );
    },
  },

  // User Profile
  users: {
    async getMe() {
      const res = await request<{ success: boolean; data: { user: User & { listings: Listing[] } } }>(
        '/users/me'
      );
      return res.data.user;
    },

    async updateMe(payload: { name?: string; avatarUrl?: string }) {
      const res = await request<{ success: boolean; data: { user: User } }>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      return res.data.user;
    },

    async getPublic(userId: string) {
      const res = await request<{ success: boolean; data: { user: User & { listings: Listing[] } } }>(
        `/users/${userId}/public`
      );
      return res.data.user;
    },
  },

  // Analytics
  analytics: {
    async getCounts() {
      const res = await request<{ success: boolean; data: AnalyticsData }>(
        '/analytics/counts'
      );
      return res.data;
    },
  },
};
