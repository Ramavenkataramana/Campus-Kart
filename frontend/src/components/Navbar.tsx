import React from 'react';
import {
  ShoppingBag,
  PlusCircle,
  Package,
  Clock,
  User as UserIcon,
  Search,
  BookOpen,
  LogOut,
  Server,
  HelpCircle,
  MapPin,
  Download
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  cartCount: number;
  activeView: 'home' | 'my-products' | 'my-orders' | 'requests';
  onNavigate: (view: 'home' | 'my-products' | 'my-orders' | 'requests') => void;
  onOpenSellModal: () => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenArchitecture: () => void;
  onOpenDownload: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCampus: string;
  onCampusChange: (c: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  cartCount,
  activeView,
  onNavigate,
  onOpenSellModal,
  onOpenCart,
  onOpenAuth,
  onLogout,
  onOpenArchitecture,
  onOpenDownload,
  searchQuery,
  onSearchChange,
  selectedCampus,
  onCampusChange
}) => {
  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl">
      {/* Top Campus Strip */}
      <div className="bg-zinc-950/90 border-b border-zinc-900 text-[11px] px-4 sm:px-6 py-1.5 flex items-center justify-between text-zinc-400">
        <div className="flex items-center gap-1.5 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-zinc-300">
              <MapPin className="w-3 h-3 text-blue-400" />
              <span>Campus:</span>
            </span>
            <select
              value={selectedCampus}
              onChange={e => onCampusChange(e.target.value)}
              className="bg-zinc-900 text-zinc-200 rounded-md px-2 py-0.5 text-[11px] font-medium border border-zinc-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="Main University Campus">Main University Campus (North)</option>
              <option value="Engineering & Tech Campus">Engineering & Tech Campus</option>
              <option value="Medical & Health Sciences Campus">Medical & Health Sciences Campus</option>
              <option value="South Campus Hostels">South Campus Hostels</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified Student Network
            </span>
            <span>·</span>
            <span>Zero Shipping Fees</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                Campus<span className="text-blue-500">Kart</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                P2P
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-medium">
              Student-to-Student Marketplace
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search books, author, lab coats, calculators, room gear..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-900/90 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Download Project Zip Button */}
          <button
            onClick={onOpenDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-900 hover:bg-zinc-800 text-blue-400 border border-blue-500/30 shadow-md transition-all hover:scale-102"
            title="Download Backend & Frontend Code (.zip)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download Code</span>
          </button>

          {/* Sell Button */}
          <button
            onClick={onOpenSellModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all hover:scale-102"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Sell Item</span>
          </button>

          {/* Browse Items */}
          <button
            onClick={() => onNavigate('home')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeView === 'home'
                ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <span>Browse</span>
          </button>

          {/* Campus Wishlist */}
          <button
            onClick={() => onNavigate('requests')}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeView === 'requests'
                ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Wishlist</span>
          </button>

          {/* My Products */}
          <button
            onClick={() => onNavigate('my-products')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeView === 'my-products'
                ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Items</span>
          </button>

          {/* My Orders */}
          <button
            onClick={() => onNavigate('my-orders')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeView === 'my-orders'
                ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Orders</span>
          </button>

          {/* Cart button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors border border-zinc-800/80"
            title="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Cloud Architecture */}
          <button
            onClick={onOpenArchitecture}
            className="p-2 rounded-xl text-zinc-400 hover:text-blue-400 hover:bg-zinc-900 transition-colors border border-zinc-800/80"
            title="Cloud Architecture & VPC Specs"
          >
            <Server className="w-4 h-4" />
          </button>

          {/* User Auth */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
              <div className="text-right hidden xl:block">
                <div className="text-xs font-bold text-zinc-200 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {currentUser.collegeBranch.split('&')[0]}
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
                {currentUser.name[0]}
              </div>

              <button
                onClick={onLogout}
                title="Log Out"
                className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-900 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-700 hover:bg-zinc-900 text-zinc-200 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-2.5">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search books, calculators, gear..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>
    </header>
  );
};
