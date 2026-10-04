import React, { useState } from 'react';
import { X, Tag, CheckCircle2, MessageCircle, MapPin, ArrowRight } from 'lucide-react';
import { Product, User } from '../types';
import { makePriceOffer } from '../services/api';

interface MakeOfferModalProps {
  product: Product;
  currentUser: User | null;
  onClose: () => void;
  onOfferSuccess: (msg: string) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  product,
  currentUser,
  onClose,
  onOfferSuccess
}) => {
  const [offeredPrice, setOfferedPrice] = useState(
    Math.round(product.price * 0.85)
  );
  const [proposedMeetup, setProposedMeetup] = useState(
    `Today 5:00 PM at ${product.pickupSpot}`
  );
  const [buyerName, setBuyerName] = useState(currentUser?.name || 'Aarav Patel');
  const [buyerContact, setBuyerContact] = useState(currentUser?.email || 'aarav@college.edu');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (offeredPrice <= 0 || offeredPrice >= product.price) {
      setErrorMsg(`Please enter an offer lower than asking price of ₹${product.price}`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await makePriceOffer({
        productId: product.id,
        productTitle: product.title,
        offeredPrice,
        originalAskingPrice: product.price,
        buyerName,
        buyerContact,
        proposedMeetup
      });

      onOfferSuccess(
        `Offer of ₹${offeredPrice} accepted by ${product.sellerName}! Meetup scheduled at ${proposedMeetup}.`
      );
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 max-w-md w-full rounded-3xl shadow-2xl p-6 space-y-4 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-700/60 text-amber-400 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-none">
                Make an Offer
              </h3>
              <span className="text-xs text-zinc-400">
                Negotiate student price with {product.sellerName.split(' ')[0]}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Summary */}
        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
          <div className="truncate max-w-[240px]">
            <span className="font-bold text-white block truncate">
              {product.title}
            </span>
            <span className="text-zinc-400">
              Asking Price: <strong className="text-blue-400 font-mono">₹{product.price}</strong>
            </span>
          </div>

          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
            {product.condition}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-zinc-300 font-bold mb-1">
              Your Offer Price (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-zinc-500 text-sm">
                ₹
              </span>
              <input
                type="number"
                value={offeredPrice}
                onChange={e => setOfferedPrice(Number(e.target.value))}
                max={product.price - 1}
                min={50}
                className="w-full pl-8 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-bold font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
            </div>
            <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
              You save ₹{product.price - offeredPrice} compared to asking price!
            </span>
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1">
              Proposed Meetup Time & Campus Spot
            </label>
            <input
              type="text"
              value={proposedMeetup}
              onChange={e => setProposedMeetup(e.target.value)}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Your Name</label>
              <input
                type="text"
                value={buyerName}
                onChange={e => setBuyerName(e.target.value)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Contact Email / Phone</label>
              <input
                type="text"
                value={buyerContact}
                onChange={e => setBuyerContact(e.target.value)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                required
              />
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 text-white font-bold shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>{isSubmitting ? 'Sending...' : `Send ₹${offeredPrice} Offer`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
