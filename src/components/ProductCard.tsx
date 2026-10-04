import React, { useState } from 'react';
import { ShoppingBag, MapPin, User, Eye, Check, Tag, ShieldCheck, Flame, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenMakeOffer: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
  onOpenMakeOffer,
  isInCart
}) => {
  const [imgError, setImgError] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 floating-card overflow-hidden flex flex-col group relative shadow-xl">
      {/* Product Image Box */}
      <div
        onClick={() => onViewDetails(product)}
        className="relative aspect-4/3 bg-zinc-950 overflow-hidden cursor-pointer"
      >
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-blue-400 p-4 text-center">
            <span className="font-bold text-sm">{product.category}</span>
            <span className="text-xs text-zinc-500 mt-1">Campus Item</span>
          </div>
        )}

        {/* Floating Condition Tag */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg backdrop-blur-md flex items-center gap-1 border border-white/10 ${
            product.condition === 'Like New'
              ? 'bg-emerald-600/90 text-white'
              : product.condition === 'Brand New'
              ? 'bg-blue-600/90 text-white'
              : 'bg-zinc-800/90 text-zinc-200'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>{product.condition}</span>
        </span>

        {/* Floating Discount Sticker */}
        {discountPercent && discountPercent > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-black text-[11px] font-extrabold shadow-lg animate-float">
            {discountPercent}% OFF
          </span>
        )}

        {/* Sold Overlay */}
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3.5 py-1.5 bg-rose-600 text-white font-extrabold text-xs tracking-wider uppercase rounded-full shadow-xl">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span className="text-blue-400 font-bold tracking-wide uppercase text-[10px]">
              {product.category}
            </span>
            <span className="text-[11px] flex items-center gap-1 text-zinc-400">
              <MapPin className="w-3 h-3 text-blue-400" />
              <span className="truncate max-w-[120px]">{product.pickupSpot}</span>
            </span>
          </div>

          <h3
            onClick={() => onViewDetails(product)}
            className="text-sm font-bold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Seller trust pill */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
            <span className="flex items-center gap-1.5 text-zinc-300 bg-zinc-800/70 px-2 py-0.5 rounded-full border border-zinc-700/60">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate max-w-[100px] font-medium">
                {product.sellerName.split(' ')[0]} ({product.sellerBranch ? product.sellerBranch.split(' ')[0] : 'Peer'})
              </span>
            </span>

            {product.viewsCount > 10 && (
              <span className="text-amber-400 flex items-center gap-1 font-semibold text-[10px]">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>{product.viewsCount} views</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2.5 border-t border-zinc-800/80 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-blue-400 font-mono tracking-tight">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-zinc-500 line-through font-mono">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {product.allowOffers && product.status !== 'sold' && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onOpenMakeOffer(product);
                }}
                className="text-[11px] text-amber-300 font-bold hover:bg-amber-900/60 bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-700/60 transition-colors shadow-2xs"
              >
                Make Offer
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(product)}
              className="px-2.5 py-2 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center justify-center gap-1.5 border border-zinc-700/40"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            <button
              onClick={() => onAddToCart(product)}
              disabled={product.status === 'sold'}
              className={`px-2.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md ${
                product.status === 'sold'
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/40'
                  : isInCart
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-600/60'
                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-600/30'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>In Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
