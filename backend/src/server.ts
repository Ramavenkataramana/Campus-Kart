import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// In-Memory Data Store (Easily swap with pg / drizzle connection)
interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  collegeBranch: string;
  collegeYear: string;
  phone?: string;
  hostelAddress?: string;
  campusName?: string;
  isVerified?: boolean;
}

interface DbProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: string;
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
  notesDetail?: {
    highlighting: 'None' | 'Pencil Only' | 'Moderate' | 'Heavy';
    missingPages: boolean;
    editionOrModel?: string;
  };
  status: 'available' | 'sold';
  createdAt: string;
}

interface DbOrder {
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
  handoverTime?: string;
  items: {
    productId: string;
    title: string;
    price: number;
    imageUrl: string;
    sellerName: string;
    pickupSpot: string;
  }[];
}

interface DbRequest {
  id: string;
  requesterName: string;
  requesterBranch: string;
  requesterYear: string;
  itemTitle: string;
  category: string;
  budgetMax: number;
  urgency: 'Today / Urgent' | 'This Week' | 'Anytime';
  neededAt: string;
  responsesCount: number;
  createdAt: string;
}

interface DbOffer {
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

const users: DbUser[] = [
  {
    id: 'user-demo-1',
    name: 'Aarav Patel',
    email: 'aarav@college.edu',
    passwordHash: 'password123',
    collegeBranch: 'Computer Science & Engineering',
    collegeYear: '3rd Year (B.Tech)',
    phone: '+91 98765 43210',
    hostelAddress: 'Hostel Block 3, Room 214',
    campusName: 'Main University Campus',
    isVerified: true
  },
  {
    id: 'user-demo-2',
    name: 'Priya Sen',
    email: 'priya@college.edu',
    passwordHash: 'password123',
    collegeBranch: 'Electronics & Communication',
    collegeYear: '2nd Year (B.Tech)',
    phone: '+91 91234 56789',
    hostelAddress: 'Girls Hostel B, Room 102',
    campusName: 'Main University Campus',
    isVerified: true
  }
];

const products: DbProduct[] = [
  {
    id: 'prod-1',
    title: 'Engineering Mathematics by B.S. Grewal (44th Edition)',
    description: 'Essential reference textbook for semester engineering math. Bright clean pages, key formulas marked with cheerful sticky tabs, zero torn pages or missing chapters.',
    price: 450,
    originalPrice: 850,
    category: 'Textbooks',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    pickupSpot: 'Central Library Steps',
    sellerId: 'user-demo-1',
    sellerName: 'Aarav Patel',
    sellerBranch: 'Computer Science',
    sellerYear: '3rd Year',
    sellerContact: 'aarav@college.edu',
    sellerPhone: '+91 98765 43210',
    isVerifiedStudent: true,
    campusName: 'Main University Campus',
    viewsCount: 42,
    savesCount: 9,
    allowOffers: true,
    notesDetail: {
      highlighting: 'Pencil Only',
      missingPages: false,
      editionOrModel: '44th Revised Edition with formula charts'
    },
    status: 'available',
    createdAt: '2026-10-01T10:00:00.000Z'
  },
  {
    id: 'prod-2',
    title: 'Casio FX-991EX Classwiz Scientific Calculator (552 Functions)',
    description: 'Natural high-resolution spreadsheet display calculator. Dual power solar + battery, includes clean snap-on protective cover. Authorized for semester exams.',
    price: 799,
    originalPrice: 1450,
    category: 'Electronics',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&auto=format&fit=crop&q=80',
    pickupSpot: 'Tech Cafeteria / SAC Gate',
    sellerId: 'user-demo-2',
    sellerName: 'Priya Sen',
    sellerBranch: 'Electronics (ECE)',
    sellerYear: '2nd Year',
    sellerContact: 'priya@college.edu',
    sellerPhone: '+91 91234 56789',
    isVerifiedStudent: true,
    campusName: 'Main University Campus',
    viewsCount: 75,
    savesCount: 16,
    allowOffers: true,
    notesDetail: {
      highlighting: 'None',
      missingPages: false,
      editionOrModel: 'Original Casio India Warranty unit'
    },
    status: 'available',
    createdAt: '2026-10-02T14:30:00.000Z'
  }
];

const requests: DbRequest[] = [
  {
    id: 'req-1',
    requesterName: 'Devansh Roy',
    requesterBranch: 'Mechanical Engg',
    requesterYear: '2nd Year',
    itemTitle: 'Need Casio FX-991EX Calculator for Midterms Tomorrow',
    category: 'Electronics',
    budgetMax: 700,
    urgency: 'Today / Urgent',
    neededAt: 'Before 1:30 PM Exam at Mechanical Block',
    responsesCount: 3,
    createdAt: '2026-10-03T11:30:00.000Z'
  }
];

const offers: DbOffer[] = [];
const orders: DbOrder[] = [];

function generateToken(userId: string) {
  return Buffer.from(JSON.stringify({ userId, issuedAt: Date.now() })).toString('base64');
}

function verifyToken(tokenHeader?: string): string | null {
  if (!tokenHeader) return null;
  const token = tokenHeader.replace('Bearer ', '');
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    return decoded.userId;
  } catch (err) {
    return null;
  }
}

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, collegeBranch, collegeYear, phone, hostelAddress, campusName } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, password required' });

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'Student already registered' });

  const newUser: DbUser = {
    id: 'user-' + Date.now(),
    name,
    email,
    passwordHash: password,
    collegeBranch: collegeBranch || 'Computer Science',
    collegeYear: collegeYear || '1st Year',
    phone: phone || '',
    hostelAddress: hostelAddress || '',
    campusName: campusName || 'Main University Campus',
    isVerified: true
  };

  users.push(newUser);
  const token = generateToken(newUser.id);
  const { passwordHash, ...safeUser } = newUser;
  res.status(201).json({ token, user: safeUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid college email or password' });
  }

  const token = generateToken(user.id);
  const { passwordHash, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

app.get('/api/auth/me', (req, res) => {
  const userId = verifyToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Products
app.get('/api/products', (req, res) => {
  const { search, category, sellerId, status, sort, maxPrice } = req.query;
  let results = [...products];

  if (category && category !== 'All') {
    results = results.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (sellerId) {
    results = results.filter(p => p.sellerId === String(sellerId));
  }
  if (status) {
    results = results.filter(p => p.status === String(status));
  }
  if (maxPrice) {
    results = results.filter(p => p.price <= Number(maxPrice));
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else {
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({ products: results });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  product.viewsCount += 1;
  res.json({ product });
});

app.post('/api/products', (req, res) => {
  const userId = verifyToken(req.headers.authorization);
  const user = userId ? users.find(u => u.id === userId) : null;
  const { title, description, price, originalPrice, category, condition, imageUrl, pickupSpot } = req.body;

  if (!title || !price || !category || !condition) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const newProduct: DbProduct = {
    id: 'prod-' + Date.now(),
    title,
    description: description || 'Used item in great condition.',
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    category,
    condition,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    pickupSpot: pickupSpot || 'Campus Library Steps',
    sellerId: user ? user.id : 'user-demo-1',
    sellerName: user ? user.name : 'Campus Student',
    sellerBranch: user ? user.collegeBranch : 'Computer Science',
    sellerYear: user ? user.collegeYear : '3rd Year',
    sellerContact: user ? user.email : 'contact@college.edu',
    isVerifiedStudent: true,
    campusName: 'Main University Campus',
    viewsCount: 1,
    savesCount: 0,
    allowOffers: true,
    status: 'available',
    createdAt: new Date().toISOString()
  };

  products.unshift(newProduct);
  res.status(201).json({ product: newProduct });
});

app.patch('/api/products/:id/status', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  product.status = req.body.status;
  res.json({ product });
});

app.delete('/api/products/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  products.splice(idx, 1);
  res.json({ success: true });
});

// Offers & Requests
app.post('/api/offers', (req, res) => {
  const { productId, productTitle, offeredPrice, originalAskingPrice, buyerName, buyerContact, proposedMeetup } = req.body;
  const newOffer: DbOffer = {
    id: 'off-' + Date.now(),
    productId,
    productTitle,
    offeredPrice: Number(offeredPrice),
    originalAskingPrice: Number(originalAskingPrice),
    buyerName,
    buyerContact,
    proposedMeetup,
    status: 'accepted',
    sellerResponseNote: `Offer accepted! Let's meet at ${proposedMeetup}.`,
    createdAt: new Date().toISOString()
  };
  offers.unshift(newOffer);
  res.status(201).json({ offer: newOffer });
});

app.get('/api/requests', (req, res) => res.json({ requests }));

app.post('/api/requests', (req, res) => {
  const { itemTitle, category, budgetMax, urgency, neededAt, requesterName, requesterBranch, requesterYear } = req.body;
  const newReq: DbRequest = {
    id: 'req-' + Date.now(),
    requesterName: requesterName || 'Student Peer',
    requesterBranch: requesterBranch || 'Engineering',
    requesterYear: requesterYear || '2nd Year',
    itemTitle,
    category,
    budgetMax: Number(budgetMax),
    urgency: urgency || 'This Week',
    neededAt: neededAt || 'Central Library',
    responsesCount: 0,
    createdAt: new Date().toISOString()
  };
  requests.unshift(newReq);
  res.status(201).json({ request: newReq });
});

// Orders
app.get('/api/orders', (req, res) => res.json({ orders }));

app.post('/api/orders', (req, res) => {
  const { buyerName, buyerEmail, buyerPhone, deliveryLocation, items, totalAmount } = req.body;
  const newOrder: DbOrder = {
    id: 'ord-' + Date.now().toString().slice(-5),
    userId: 'user-demo-1',
    buyerName,
    buyerEmail,
    buyerPhone,
    deliveryLocation,
    totalAmount: Number(totalAmount),
    paymentMethod: 'Cash/UPI on Campus Handover',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    items
  };
  orders.unshift(newOrder);
  res.status(201).json({ order: newOrder });
});

app.listen(PORT, () => {
  console.log(`CampusKart Backend running on port ${PORT}`);
});
