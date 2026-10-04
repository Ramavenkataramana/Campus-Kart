export type ProductCategory =
  | 'Textbooks'
  | 'Electronics'
  | 'Lab & Study Gear'
  | 'Hostel Essentials'
  | 'Cycles & Mobility'
  | 'Notes & Guides';

export type ProductCondition = 'Brand New' | 'Like New' | 'Good' | 'Fair';

export interface User {
  id: string;
  name: string;
  email: string;
  collegeBranch: string;
  collegeYear: string;
  phone?: string;
  hostelAddress?: string;
  campusName?: string;
  isVerified?: boolean;
}

export interface ItemNotesDetail {
  highlighting: 'None' | 'Pencil Only' | 'Moderate' | 'Heavy';
  missingPages: boolean;
  cdOrAccessCode?: string;
  editionOrModel?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  condition: ProductCondition;
  imageUrl: string;
  pickupSpot: string;
  sellerId: string;
  sellerName: string;
  sellerBranch: string;
  sellerYear: string;
  sellerContact: string;
  sellerPhone?: string;
  isVerifiedStudent: boolean;
  campusName: string;
  viewsCount: number;
  savesCount: number;
  allowOffers: boolean;
  notesDetail?: ItemNotesDetail;
  status: 'available' | 'sold';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  sellerName: string;
  pickupSpot: string;
}

export interface Order {
  id: string;
  userId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  deliveryLocation: string;
  totalAmount: number;
  paymentMethod: string;
  status: 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
  items: OrderItem[];
  handoverTime?: string;
}

export interface CampusItemRequest {
  id: string;
  requesterName: string;
  requesterBranch: string;
  requesterYear: string;
  itemTitle: string;
  category: ProductCategory;
  budgetMax: number;
  urgency: 'Today / Urgent' | 'This Week' | 'Anytime';
  neededAt: string;
  responsesCount: number;
  createdAt: string;
}

export interface PriceOffer {
  id: string;
  productId: string;
  productTitle: string;
  offeredPrice: number;
  originalAskingPrice: number;
  buyerName: string;
  buyerContact: string;
  proposedMeetup: string;
  status: 'pending' | 'accepted' | 'countered' | 'declined';
  sellerResponseNote?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
