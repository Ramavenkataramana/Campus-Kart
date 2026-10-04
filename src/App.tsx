import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SellItemModal } from './components/SellItemModal';
import { CartDrawer } from './components/CartDrawer';
import { MyProductsView } from './components/MyProductsView';
import { MyOrdersView } from './components/MyOrdersView';
import { AuthModal } from './components/AuthModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { DownloadModal } from './components/DownloadModal';
import { MakeOfferModal } from './components/MakeOfferModal';
import { CampusRequestsView } from './components/CampusRequestsView';
import {
  Product,
  User,
  CartItem,
  Order,
  ProductCategory,
  CampusItemRequest
} from './types';
import {
  getProducts,
  createProduct,
  updateProductStatus,
  deleteProduct,
  loginUser,
  registerUser,
  getOrders,
  placeOrder,
  getCampusRequests
} from './services/api';
import {
  BookOpen,
  Search,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Layers,
  ArrowRight,
  CheckCircle2,
  Tag,
  Laptop,
  FlaskConical,
  Coffee,
  HelpCircle,
  Server,
  Bike,
  Smile,
  Download
} from 'lucide-react';

const CATEGORIES: { label: string; value: string; icon: React.ReactNode }[] = [
  { label: 'All Items', value: 'All', icon: <Tag className="w-4 h-4" /> },
  { label: 'Textbooks', value: 'Textbooks', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Electronics', value: 'Electronics', icon: <Laptop className="w-4 h-4" /> },
  { label: 'Lab & Study Gear', value: 'Lab & Study Gear', icon: <FlaskConical className="w-4 h-4" /> },
  { label: 'Hostel Essentials', value: 'Hostel Essentials', icon: <Coffee className="w-4 h-4" /> },
  { label: 'Cycles & Mobility', value: 'Cycles & Mobility', icon: <Bike className="w-4 h-4" /> }
];

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<CampusItemRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('Main University Campus');
  const [sortBy, setSortBy] = useState('newest');
  const [maxBudget, setMaxBudget] = useState<number | undefined>(undefined);

  // Modals & Navigation
  const [activeView, setActiveView] = useState<'home' | 'my-products' | 'my-orders' | 'requests'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellModalPrefill, setSellModalPrefill] = useState<{ title: string; category: ProductCategory } | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [offerProduct, setOfferProduct] = useState<Product | null>(null);

  // User session
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'user-demo-1',
    name: 'Aarav Patel',
    email: 'aarav@college.edu',
    collegeBranch: 'Computer Science & Engineering',
    collegeYear: '3rd Year (B.Tech)',
    phone: '+91 98765 43210',
    hostelAddress: 'Hostel Block 3, Room 214',
    campusName: 'Main University Campus',
    isVerified: true
  });
  const [authToken, setAuthToken] = useState<string>('demo-jwt-token-aarav');

  // Cart & Orders
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts({
        category: selectedCategory,
        search: searchQuery,
        sort: sortBy,
        maxPrice: maxBudget
      });
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRequestsAndOrders = async () => {
    try {
      const [reqData, ordData] = await Promise.all([
        getCampusRequests(),
        getOrders(authToken)
      ]);
      setRequests(reqData);
      setOrders(ordData);
    } catch (err) {
      console.error('Error loading requests/orders:', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, sortBy, maxBudget]);

  useEffect(() => {
    loadRequestsAndOrders();
  }, [authToken]);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.title.slice(0, 32)}..." to cart!`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handlePlaceOrder = async (orderData: any) => {
    const newOrder = await placeOrder(orderData, authToken);
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    await loadProducts();
    setActiveView('my-orders');
    showToast('Order confirmed! Meet student seller on campus for physical inspection and handover.');
  };

  const handleCreateProduct = async (productData: any) => {
    const created = await createProduct(productData, authToken);
    setProducts(prev => [created, ...prev]);
    setSellModalPrefill(null);
    showToast('Listing posted! Campus peers can now browse your item.');
  };

  const handleToggleProductStatus = async (id: string, currentStatus: 'available' | 'sold') => {
    const newStatus = currentStatus === 'available' ? 'sold' : 'available';
    await updateProductStatus(id, newStatus, authToken);
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, status: newStatus } : p))
    );
    showToast(`Item marked as ${newStatus}`);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id, authToken);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Listing removed from CampusKart');
  };

  const handleLogin = async (email: string, pass: string) => {
    const res = await loginUser(email, pass);
    setCurrentUser(res.user);
    setAuthToken(res.token);
    showToast(`Welcome back, ${res.user.name}!`);
  };

  const handleRegister = async (data: any) => {
    const res = await registerUser(data);
    setCurrentUser(res.user);
    setAuthToken(res.token);
    showToast(`Account created! Welcome, ${res.user.name}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken('');
    showToast('Logged out of CampusKart.');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const myPostedProducts = currentUser
    ? products.filter(p => p.sellerId === currentUser.id)
    : [];

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white relative overflow-x-hidden">
      {/* Sleek Dark Ambient Floating Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-float-reverse" />
      <div className="absolute bottom-1/4 right-0 w-88 h-88 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none animate-float" />

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        cartCount={totalCartCount}
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenSellModal={() => {
          setSellModalPrefill(null);
          setIsSellModalOpen(true);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
      />

      {/* Main View Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 relative z-10">
        {/* Floating Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-zinc-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-float border border-zinc-700/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* View 1: Home Marketplace */}
        {activeView === 'home' && (
          <div className="space-y-6">
            {/* Dark Sleek Campus Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-black text-white shadow-2xl border border-zinc-800">
              <img
                src="/src/assets/images/campuskart_dark_hero_1791056382674.jpg"
                alt="Modern illuminated university campus"
                className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-screen"
              />
              <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-xs animate-float">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Verified Campus Marketplace
                  </span>

                  <span className="text-xs text-zinc-300 bg-zinc-900/80 backdrop-blur-md px-3 py-0.5 rounded-full border border-zinc-700">
                    {selectedCampus}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                  Buy & sell used textbooks, calculators & college gear.
                </h1>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                  Connect directly with student peers on campus. Save up to 70% with zero shipping fees, zero commission markups, and friendly physical handovers.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSellModalPrefill(null);
                      setIsSellModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <span>+ Sell Your Old Books</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsDownloadOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-semibold text-xs border border-blue-500/40 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Download Project (.zip)</span>
                  </button>

                  <button
                    onClick={() => setActiveView('requests')}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs border border-zinc-700 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Wishlist ({requests.length})</span>
                  </button>
                </div>
              </div>

              {/* Floating badge sticker */}
              <div className="hidden lg:flex absolute right-8 bottom-8 bg-zinc-900/90 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-zinc-700/80 items-center gap-3 animate-float-slow">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg">
                  🎓
                </div>
                <div className="text-left text-xs">
                  <div className="font-extrabold text-white">Student Verified</div>
                  <div className="text-zinc-400 font-medium">100% peer handovers</div>
                </div>
              </div>
            </div>

            {/* Floating Quick Feature Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 floating-card shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Pocket Friendly</div>
                  <div className="text-[11px] text-zinc-400">Up to 70% off retail</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 floating-card shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/60 text-blue-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Safe Handover</div>
                  <div className="text-[11px] text-zinc-400">Meet at library / cafe</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 floating-card shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-400 flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Make an Offer</div>
                  <div className="text-[11px] text-zinc-400">Friendly negotiation</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 floating-card shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-400 flex items-center justify-center shrink-0">
                  <Smile className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Zero Commission</div>
                  <div className="text-[11px] text-zinc-400">Direct peer-to-peer</div>
                </div>
              </div>
            </div>

            {/* Filter and Sorting Controls */}
            <div className="bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 p-4 sm:p-5 shadow-xl space-y-3.5">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === cat.value
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-102'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Secondary Filters */}
              <div className="pt-2.5 border-t border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <span className="text-zinc-400 font-medium shrink-0">Budget:</span>
                  {[
                    { label: 'All', value: undefined },
                    { label: 'Under ₹350', value: 350 },
                    { label: 'Under ₹500', value: 500 },
                    { label: 'Under ₹1000', value: 1000 }
                  ].map(b => (
                    <button
                      key={b.label}
                      onClick={() => setMaxBudget(b.value)}
                      className={`px-3 py-1 rounded-lg border font-mono font-medium transition-colors ${
                        maxBudget === b.value
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                          : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-zinc-400 font-medium">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  >
                    <option value="newest">Newest Listed</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="discount">Biggest Savings (%)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div
                    key={i}
                    className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-4 space-y-3 animate-pulse"
                  >
                    <div className="aspect-4/3 bg-zinc-950 rounded-xl" />
                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                    <div className="h-3 bg-zinc-850 rounded w-1/2" />
                    <div className="h-6 bg-zinc-800 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-zinc-900/90 backdrop-blur-md rounded-3xl border border-zinc-800 p-12 text-center space-y-3 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 text-blue-400 mx-auto flex items-center justify-center animate-float">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">
                  No items found matching your filters
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Try clearing your search query or price budget filter to browse all active campus items.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setMaxBudget(undefined);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                    onOpenMakeOffer={setOfferProduct}
                    isInCart={cart.some(item => item.product.id === product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 2: Campus Wishlist / Item Requests */}
        {activeView === 'requests' && (
          <CampusRequestsView
            requests={requests}
            currentUser={currentUser}
            onRequestCreated={newReq => setRequests(prev => [newReq, ...prev])}
            onOpenSellWithPrefill={(title, category) => {
              setSellModalPrefill({ title, category });
              setIsSellModalOpen(true);
            }}
            onShowToast={showToast}
          />
        )}

        {/* View 3: My Products */}
        {activeView === 'my-products' && (
          <MyProductsView
            products={myPostedProducts}
            onOpenSellModal={() => {
              setSellModalPrefill(null);
              setIsSellModalOpen(true);
            }}
            onToggleStatus={handleToggleProductStatus}
            onDeleteProduct={handleDeleteProduct}
            onViewProduct={setSelectedProduct}
          />
        )}

        {/* View 4: My Orders */}
        {activeView === 'my-orders' && (
          <MyOrdersView
            orders={orders}
            onBrowseItems={() => setActiveView('home')}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onOpenMakeOffer={setOfferProduct}
          isInCart={cart.some(item => item.product.id === selectedProduct.id)}
        />
      )}

      {/* Make an Offer Modal */}
      {offerProduct && (
        <MakeOfferModal
          product={offerProduct}
          currentUser={currentUser}
          onClose={() => setOfferProduct(null)}
          onOfferSuccess={msg => showToast(msg)}
        />
      )}

      {/* Sell Item Modal */}
      {isSellModalOpen && (
        <SellItemModal
          currentUser={currentUser}
          onClose={() => {
            setIsSellModalOpen(false);
            setSellModalPrefill(null);
          }}
          onSubmit={handleCreateProduct}
          onOpenAuth={() => {
            setIsSellModalOpen(false);
            setIsAuthOpen(true);
          }}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        currentUser={currentUser}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSelectDemoUser={(user, token) => {
          setCurrentUser(user);
          setAuthToken(token);
          showToast(`Logged in as demo student ${user.name}`);
        }}
      />

      {/* Cloud Architecture & VPC Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Download Codebase Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 text-xs text-zinc-500 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">CampusKart</span>
            <span>·</span>
            <span>College Student Marketplace</span>
            <span>·</span>
            <span>{selectedCampus}</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <button
              onClick={() => setIsDownloadOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Code (.zip)</span>
            </button>
            <button
              onClick={() => setActiveView('home')}
              className="hover:text-blue-400 transition-colors"
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveView('requests')}
              className="hover:text-blue-400 transition-colors"
            >
              Wishlist
            </button>
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="hover:text-blue-400 transition-colors"
            >
              Sell Item
            </button>
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="hover:text-blue-400 transition-colors flex items-center gap-1 font-semibold text-blue-400"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Architecture</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
