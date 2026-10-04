import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  MapPin,
  User,
  ShieldCheck,
  Tag,
  Phone,
  MessageCircle,
  Eye,
  Check,
  Clock,
  Sparkles,
  Flame
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onOpenMakeOffer: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onOpenMakeOffer,
  isInCart
}) => {
  const [imgError, setImgError] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const whatsappMessage = encodeURIComponent(
    `Hi ${product.sellerName.split(' ')[0]}, I saw your listing for "${product.title}" on CampusKart. Is it still available to meet near ${product.pickupSpot}?`
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col text-zinc-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {product.category}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                product.condition === 'Like New'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-600/40'
                  : product.condition === 'Brand New'
                  ? 'bg-blue-950/60 text-blue-400 border border-blue-600/40'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {product.condition}
            </span>
            {product.viewsCount > 10 && (
              <span className="text-[11px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-800/40 font-medium flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>{product.viewsCount} campus views</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div className="aspect-4/3 rounded-2xl bg-zinc-950 overflow-hidden relative border border-zinc-800">
              {!imgError ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  onError={() => setImgError(true)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-blue-400 p-4 text-center">
                  <Tag className="w-8 h-8 text-blue-400 mb-2" />
                  <span className="font-bold text-sm">{product.title}</span>
                </div>
              )}

              {discountPercent && discountPercent > 0 && (
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-black text-xs font-extrabold shadow-lg">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Price & Primary Specs */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {product.title}
                </h2>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-blue-400 font-mono">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-zinc-500 line-through font-mono">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Seller Badge Box */}
                <div className="mt-4 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-zinc-200">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>{product.sellerName}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60 font-semibold">
                      Verified Student
                    </span>
                  </div>

                  <div className="text-zinc-400 text-[11px]">
                    {product.sellerBranch} · {product.sellerYear}
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-300 pt-1 border-t border-zinc-800/80">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Meetup Spot: <strong className="text-white">{product.pickupSpot}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onBuyNow(product)}
                    disabled={product.status === 'sold'}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    {product.status === 'sold' ? 'Sold Out' : 'Buy Now'}
                  </button>

                  <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.status === 'sold'}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                      isInCart
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600/60'
                        : 'border-zinc-700 hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>In Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-zinc-400" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenMakeOffer(product);
                    }}
                    className="py-2 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-700/60 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>Make an Offer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Condition Grading Checklist */}
          {product.notesDetail && (
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
              <h4 className="font-bold text-zinc-300 uppercase tracking-wider text-[11px]">
                Student Inspection Checklist
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Markings:</span>
                  <strong className="text-zinc-200">{product.notesDetail.highlighting}</strong>
                </div>
                <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Pages:</span>
                  <strong className={product.notesDetail.missingPages ? 'text-rose-400' : 'text-emerald-400'}>
                    {product.notesDetail.missingPages ? 'Has torn pages' : '100% Intact'}
                  </strong>
                </div>
                <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Model / Edition:</span>
                  <strong className="text-zinc-200 truncate block">
                    {product.notesDetail.editionOrModel || 'Verified'}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2 border-t border-zinc-800 pt-4">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Seller Notes & Details
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          {/* Handover note */}
          <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/50 text-xs text-blue-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold text-blue-300">Campus Handover Safety</strong>
              Always meet in public college areas (e.g. Central Library, Student Cafeteria, or Department Lobby). Inspect before paying via UPI or cash.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
