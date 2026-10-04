import {
  Product,
  User,
  Order,
  AuthResponse,
  CampusItemRequest,
  PriceOffer
} from '../types';

const API_BASE = '/api';

export async function getProducts(params?: {
  category?: string;
  search?: string;
  sellerId?: string;
  sort?: string;
  maxPrice?: number;
  condition?: string;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'All') {
    query.set('category', params.category);
  }
  if (params?.search) {
    query.set('search', params.search);
  }
  if (params?.sellerId) {
    query.set('sellerId', params.sellerId);
  }
  if (params?.sort) {
    query.set('sort', params.sort);
  }
  if (params?.maxPrice) {
    query.set('maxPrice', String(params.maxPrice));
  }
  if (params?.condition && params.condition !== 'All') {
    query.set('condition', params.condition);
  }

  const res = await fetch(`${API_BASE}/products?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.products;
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  const data = await res.json();
  return data.product;
}

export async function createProduct(
  productData: Partial<Product>,
  token?: string
): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to list product');
  }
  const data = await res.json();
  return data.product;
}

export async function updateProductStatus(
  id: string,
  status: 'available' | 'sold',
  token?: string
): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update status');
  const data = await res.json();
  return data.product;
}

export async function deleteProduct(id: string, token?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to log in');
  }
  return res.json();
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  collegeBranch: string;
  collegeYear: string;
  phone?: string;
  hostelAddress?: string;
  campusName?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to register');
  }
  return res.json();
}

export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Session expired');
  const data = await res.json();
  return data.user;
}

export async function getOrders(token?: string): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  const data = await res.json();
  return data.orders;
}

export async function placeOrder(
  orderData: {
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    deliveryLocation: string;
    totalAmount: number;
    items: any[];
  },
  token?: string
): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to place order');
  }
  const data = await res.json();
  return data.order;
}

export async function makePriceOffer(offerData: {
  productId: string;
  productTitle: string;
  offeredPrice: number;
  originalAskingPrice: number;
  buyerName: string;
  buyerContact: string;
  proposedMeetup: string;
}): Promise<PriceOffer> {
  const res = await fetch(`${API_BASE}/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offerData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit offer');
  }
  const data = await res.json();
  return data.offer;
}

export async function getCampusRequests(): Promise<CampusItemRequest[]> {
  const res = await fetch(`${API_BASE}/requests`);
  if (!res.ok) throw new Error('Failed to fetch requests');
  const data = await res.json();
  return data.requests;
}

export async function createCampusRequest(requestData: Partial<CampusItemRequest>): Promise<CampusItemRequest> {
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create request');
  }
  const data = await res.json();
  return data.request;
}
