import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve public directory for static zip downloads
app.use(express.static(path.resolve(__dirname, 'public')));

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
  },
  {
    id: 'user-demo-3',
    name: 'Rohan Joshi',
    email: 'rohan.j@college.edu',
    passwordHash: 'password123',
    collegeBranch: 'Mechanical Engineering',
    collegeYear: '4th Year (B.Tech)',
    phone: '+91 98111 22334',
    hostelAddress: 'Hostel 7, Room 408',
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
    imageUrl: '/src/assets/images/dark_textbooks_1791056395760.jpg',
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
    imageUrl: '/src/assets/images/dark_calculator_1791056407327.jpg',
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
  },
  {
    id: 'prod-3',
    title: 'Introduction to Algorithms (CLRS 3rd Edition Hardcover)',
    description: 'The golden algorithms textbook for Data Structures and campus placements. Clean binding, crisp diagrams, includes chapter index ribbons.',
    price: 620,
    originalPrice: 1299,
    category: 'Textbooks',
    condition: 'Like New',
    imageUrl: '/src/assets/images/product_clrs_algorithms_1791055933403.jpg',
    pickupSpot: 'Computer Science Department Porch',
    sellerId: 'user-demo-1',
    sellerName: 'Aarav Patel',
    sellerBranch: 'Computer Science',
    sellerYear: '3rd Year',
    sellerContact: 'aarav@college.edu',
    sellerPhone: '+91 98765 43210',
    isVerifiedStudent: true,
    campusName: 'Main University Campus',
    viewsCount: 58,
    savesCount: 14,
    allowOffers: true,
    notesDetail: {
      highlighting: 'None',
      missingPages: false,
      editionOrModel: 'MIT Press Hardcover'
    },
    status: 'available',
    createdAt: '2026-10-02T15:00:00.000Z'
  },
  {
    id: 'prod-4',
    title: 'Warm Minimalist LED Desk Study Lamp & Night Setup',
    description: 'Rechargeable 3-temperature warm study lamp. Gentle on eyes for late-night hostel revisions without disturbing your roommates.',
    price: 320,
    originalPrice: 799,
    category: 'Hostel Essentials',
    condition: 'Like New',
    imageUrl: '/src/assets/images/dark_dorm_setup_1791056421901.jpg',
    pickupSpot: 'Girls Hostel B Gate / Canteen',
    sellerId: 'user-demo-2',
    sellerName: 'Priya Sen',
    sellerBranch: 'Electronics (ECE)',
    sellerYear: '2nd Year',
    sellerContact: 'priya@college.edu',
    sellerPhone: '+91 91234 56789',
    isVerifiedStudent: true,
    campusName: 'Main University Campus',
    viewsCount: 39,
    savesCount: 11,
    allowOffers: true,
    notesDetail: {
      highlighting: 'None',
      missingPages: false,
      editionOrModel: 'USB-C Rechargeable with 12hr battery'
    },
    status: 'available',
    createdAt: '2026-10-02T16:00:00.000Z'
  },
  {
    id: 'prod-5',
    title: 'Prestige 1.5L Stainless Steel Electric Kettle for Hostel',
    description: 'A hostel student must-have! Fast boiling kettle for late night Maggie, green tea, and soup during exam season. Auto shut-off safety sensor.',
    price: 420,
    originalPrice: 1050,
    category: 'Hostel Essentials',
    condition: 'Good',
    imageUrl: '/src/assets/images/product_electric_kettle_1791055913223.jpg',
    pickupSpot: 'Hostel Block 3 Mess Entrance',
    sellerId: 'user-demo-3',
    sellerName: 'Rohan Joshi',
    sellerBranch: 'Mechanical Engg',
    sellerYear: '4th Year',
    sellerContact: 'rohan.j@college.edu',
    sellerPhone: '+91 98111 22334',
    isVerifiedStudent: true,
    campusName: 'Main University Campus',
    viewsCount: 88,
    savesCount: 22,
    allowOffers: true,
    notesDetail: {
      highlighting: 'None',
      missingPages: false,
      editionOrModel: '1500W Quick Boil 1.5L'
    },
    status: 'available',
    createdAt: '2026-10-03T08:30:00.000Z'
  },
  {
    id: 'prod-6',
    title: 'Foldable Bed Study Table with Laptop Slot & Cup Holder',
    description: 'Lightweight wooden laptop bed table with curved ergonomic edge and sturdy foldable legs. Super comfortable for studying in bed.',
    price: 340,
    originalPrice: 799,
    category: 'Hostel Essentials',
    condition: 'Like New',
    imageUrl: '/src/assets/images/product_bed_table_1791055899080.jpg',
    pickupSpot: 'Hostel 3 Common Room',
    sellerId: 'user-demo-1',
    sellerName: 'Aarav Patel',
    sellerBranch: 'Computer Science',
    sellerYear: '3rd Year',
    sellerContact: 'aarav@college.edu',
    sellerPhone: '+91 98765 43210',
    isVerifiedStudent: true,
    campusName: 'Main University Campus',
    viewsCount: 61,
    savesCount: 15,
    allowOffers: true,
    notesDetail: {
      highlighting: 'None',
      missingPages: false,
      editionOrModel: '60cm x 40cm wooden grain'
    },
    status: 'available',
    createdAt: '2026-10-03T09:10:00.000Z'
  },
  {
    id: 'prod-7',
    title: 'Hero Sprint 26T Campus Commuter Bicycle with Heavy Cable Lock',
    description: 'Smooth riding campus cycle with comfortable padded saddle, bell, mudguards, and a heavy-duty numbered combination lock. Ideal for getting between hostels and academic blocks.',
    price: 1850,
    originalPrice: 4500,
    category: 'Cycles & Mobility',
    condition: 'Good',
    imageUrl: '/src/assets/images/product_campus_bicycle_1791055922465.jpg',
    pickupSpot: 'Main Gate Campus Cycle Stand',
    sellerId: 'user-demo-3',
    sellerName: 'Rohan Joshi',
    sellerBranch: 'Mechanical Engg',
    sellerYear: '4th Year',
    sellerContact: 'rohan.j@college.edu',
    sellerPhone: '+91 98111 22334',
    isVerifiedStudent: true,
    campusName: 'Main University Campus',
    viewsCount: 134,
    savesCount: 31,
    allowOffers: true,
    notesDetail: {
      highlighting: 'None',
      missingPages: false,
      editionOrModel: 'Single Speed 26-inch steel frame'
    },
    status: 'available',
    createdAt: '2026-10-03T10:15:00.000Z'
  },
  {
    id: 'prod-8',
    title: 'White Cotton Lab Coat (Size 38) + Clear UV Safety Goggles',
    description: 'Clean washed white lab coat for chemistry & bio practicals with deep pockets for pens. Goggles have clear scratch-resistant lenses.',
    price: 280,
    originalPrice: 650,
    category: 'Lab & Study Gear',
    condition: 'Good',
    imageUrl: '/src/assets/images/product_lab_gear_1791055565923.jpg',
    pickupSpot: 'Chemistry Department Main Porch',
    sellerId: 'user-demo-3',
    sellerName: 'Rohan Joshi',
    sellerBranch: 'Mechanical Engg',
    sellerYear: '4th Year',
    sellerContact: 'rohan.j@college.edu',
    sellerPhone: '+91 98111 22334',
    isVerifiedStudent: true,
    campusName: 'Main University Campus',
    viewsCount: 34,
    savesCount: 5,
    allowOffers: false,
    notesDetail: {
      highlighting: 'None',
      missingPages: false,
      editionOrModel: 'Size 38 Unisex Cotton'
    },
    status: 'available',
    createdAt: '2026-10-03T11:00:00.000Z'
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
  },
  {
    id: 'req-2',
    requesterName: 'Ananya Sharma',
    requesterBranch: 'Computer Science',
    requesterYear: '3rd Year',
    itemTitle: 'Looking for Database System Concepts (Navathe / Korth)',
    category: 'Textbooks',
    budgetMax: 400,
    urgency: 'This Week',
    neededAt: 'Central Library / CS Block',
    responsesCount: 2,
    createdAt: '2026-10-03T10:10:00.000Z'
  }
];

const offers: DbOffer[] = [
  {
    id: 'off-1',
    productId: 'prod-1',
    productTitle: 'Engineering Mathematics by B.S. Grewal',
    offeredPrice: 400,
    originalAskingPrice: 450,
    buyerName: 'Sneha Verma',
    buyerContact: 'sneha.v@college.edu',
    proposedMeetup: 'Today 5:00 PM outside Library',
    status: 'pending',
    createdAt: '2026-10-03T11:20:00.000Z'
  }
];

const orders: DbOrder[] = [
  {
    id: 'ord-1001',
    userId: 'user-demo-1',
    buyerName: 'Aarav Patel',
    buyerEmail: 'aarav@college.edu',
    buyerPhone: '+91 98765 43210',
    deliveryLocation: 'Hostel Block 3, Room 214',
    totalAmount: 799,
    paymentMethod: 'Cash/UPI on Campus Handover',
    status: 'confirmed',
    handoverTime: 'Today between 5:00 PM - 6:30 PM',
    createdAt: '2026-10-02T18:00:00.000Z',
    items: [
      {
        productId: 'prod-2',
        title: 'Casio FX-991EX Classwiz Scientific Calculator',
        price: 799,
        imageUrl: '/src/assets/images/dark_calculator_1791056407327.jpg',
        sellerName: 'Priya Sen',
        pickupSpot: 'Tech Cafeteria / SAC Gate'
      }
    ]
  }
];

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

// Routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, collegeBranch, collegeYear, phone, hostelAddress, campusName } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Student with this email already registered' });
  }

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
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

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
        p.sellerName.toLowerCase().includes(q) ||
        p.pickupSpot.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'discount') {
    results.sort((a, b) => {
      const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
      const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
      return discB - discA;
    });
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

  const {
    title,
    description,
    price,
    originalPrice,
    category,
    condition,
    imageUrl,
    pickupSpot,
    sellerName,
    sellerContact,
    sellerPhone,
    notesDetail
  } = req.body;

  if (!title || !price || !category || !condition) {
    return res.status(400).json({ error: 'Title, price, category, and condition are required' });
  }

  const newProduct: DbProduct = {
    id: 'prod-' + Date.now(),
    title,
    description: description || 'Used college item in great condition.',
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    category,
    condition,
    imageUrl: imageUrl || '/src/assets/images/dark_textbooks_1791056395760.jpg',
    pickupSpot: pickupSpot || 'Campus Library Steps',
    sellerId: user ? user.id : 'user-demo-1',
    sellerName: sellerName || (user ? user.name : 'Campus Student'),
    sellerBranch: user ? user.collegeBranch : 'Computer Science',
    sellerYear: user ? user.collegeYear : '3rd Year',
    sellerContact: sellerContact || (user ? user.email : 'contact@college.edu'),
    sellerPhone: sellerPhone || (user ? user.phone : '+91 98765 43210'),
    isVerifiedStudent: true,
    campusName: user ? user.campusName || 'Main Campus' : 'Main University Campus',
    viewsCount: 1,
    savesCount: 0,
    allowOffers: true,
    notesDetail: notesDetail || {
      highlighting: 'None',
      missingPages: false
    },
    status: 'available',
    createdAt: new Date().toISOString()
  };

  products.unshift(newProduct);
  res.status(201).json({ product: newProduct });
});

app.patch('/api/products/:id/status', (req, res) => {
  const { status } = req.body;
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (status === 'available' || status === 'sold') {
    product.status = status;
  }
  res.json({ product });
});

app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  products.splice(index, 1);
  res.json({ success: true, message: 'Listing removed' });
});

app.post('/api/offers', (req, res) => {
  const { productId, productTitle, offeredPrice, originalAskingPrice, buyerName, buyerContact, proposedMeetup } = req.body;
  const newOffer: DbOffer = {
    id: 'off-' + Date.now(),
    productId,
    productTitle,
    offeredPrice: Number(offeredPrice),
    originalAskingPrice: Number(originalAskingPrice),
    buyerName,
    buyerContact: buyerContact || 'student@college.edu',
    proposedMeetup: proposedMeetup || 'Library Steps at 5 PM',
    status: 'accepted',
    sellerResponseNote: `Offer accepted! Let's meet at ${proposedMeetup || 'Library Steps at 5 PM'}.`,
    createdAt: new Date().toISOString()
  };
  offers.unshift(newOffer);
  res.status(201).json({ offer: newOffer });
});

app.get('/api/requests', (req, res) => {
  res.json({ requests });
});

app.post('/api/requests', (req, res) => {
  const { itemTitle, category, budgetMax, urgency, neededAt, requesterName, requesterBranch, requesterYear } = req.body;
  const newReq: DbRequest = {
    id: 'req-' + Date.now(),
    requesterName: requesterName || 'Student Peer',
    requesterBranch: requesterBranch || 'Engineering',
    requesterYear: requesterYear || '2nd Year',
    itemTitle,
    category: category || 'Textbooks',
    budgetMax: Number(budgetMax),
    urgency: urgency || 'This Week',
    neededAt: neededAt || 'Campus Library / Hostel',
    responsesCount: 0,
    createdAt: new Date().toISOString()
  };
  requests.unshift(newReq);
  res.status(201).json({ request: newReq });
});

app.get('/api/orders', (req, res) => {
  const userId = verifyToken(req.headers.authorization);
  if (!userId) {
    return res.json({ orders: orders.filter(o => o.userId === 'user-demo-1') });
  }
  const userOrders = orders.filter(o => o.userId === userId);
  res.json({ orders: userOrders });
});

app.post('/api/orders', (req, res) => {
  const userId = verifyToken(req.headers.authorization);
  const { buyerName, buyerEmail, buyerPhone, deliveryLocation, items, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const newOrder: DbOrder = {
    id: 'ord-' + Date.now().toString().slice(-5),
    userId: userId || 'user-demo-1',
    buyerName: buyerName || 'Student Buyer',
    buyerEmail: buyerEmail || 'buyer@college.edu',
    buyerPhone: buyerPhone || '+91 99999 88888',
    deliveryLocation: deliveryLocation || 'Campus Main Library',
    totalAmount: Number(totalAmount),
    paymentMethod: 'Cash/UPI on Campus Handover',
    status: 'confirmed',
    handoverTime: 'Estimated today between 4:30 PM - 6:00 PM',
    createdAt: new Date().toISOString(),
    items: items.map((item: any) => ({
      productId: item.product?.id || item.productId,
      title: item.product?.title || item.title,
      price: item.product?.price || item.price,
      imageUrl: item.product?.imageUrl || item.imageUrl,
      sellerName: item.product?.sellerName || item.sellerName || 'Campus Seller',
      pickupSpot: item.product?.pickupSpot || item.pickupSpot || 'Campus Library'
    }))
  };

  orders.unshift(newOrder);

  newOrder.items.forEach(item => {
    const prod = products.find(p => p.id === item.productId);
    if (prod) prod.status = 'sold';
  });

  res.status(201).json({ order: newOrder });
});

// Download endpoint for zips
app.get('/api/download/:type', (req, res) => {
  const { type } = req.params;
  let filename = 'campuskart-fullstack.zip';
  if (type === 'backend' || type === 'campuskart-backend.zip') filename = 'campuskart-backend.zip';
  if (type === 'frontend' || type === 'campuskart-frontend.zip') filename = 'campuskart-frontend.zip';

  const possiblePaths = [
    path.resolve(__dirname, filename),
    path.resolve(__dirname, 'public', filename)
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return res.download(p, filename);
    }
  }

  res.status(404).json({ error: 'Download archive not found' });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusKart server running at http://localhost:${PORT}`);
  });
}

startServer();
