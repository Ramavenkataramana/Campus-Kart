import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { CartItem, User } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currentUser: User | null;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: (orderData: {
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    deliveryLocation: string;
    totalAmount: number;
    items: CartItem[];
  }) => Promise<void>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  currentUser,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder
}) => {
  const [buyerName, setBuyerName] = useState(currentUser?.name || 'Aarav Patel');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || 'aarav@college.edu');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [deliveryLocation, setDeliveryLocation] = useState(
    currentUser?.hostelAddress || 'Hostel Block 3, Room 214'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!buyerName || !buyerPhone || !deliveryLocation) {
      setErrorMsg('Please fill in your name, phone, and campus pickup location.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onPlaceOrder({
        buyerName,
        buyerEmail,
        buyerPhone,
        deliveryLocation,
        totalAmount,
        items: cart
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="bg-zinc-900 border-l border-zinc-800 w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-y-auto text-zinc-100">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              Marketplace Cart ({cart.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 flex-1 space-y-6">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 text-blue-400 mx-auto flex items-center justify-center animate-float">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white">Your cart is empty</h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Explore textbooks, calculators, and hostel essentials listed by fellow students.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items List */}
              <div className="divide-y divide-zinc-800">
                {cart.map(item => (
                  <div key={item.product.id} className="py-3 flex items-start gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-14 h-14 rounded-xl object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">
                        {item.product.title}
                      </h5>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        ₹{item.product.price} each · {item.product.sellerName.split(' ')[0]}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-zinc-700 rounded-lg text-xs font-mono bg-zinc-950">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="px-2.5 py-0.5 hover:bg-zinc-800 text-zinc-300"
                          >
                            -
                          </button>
                          <span className="px-2 font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="px-2.5 py-0.5 hover:bg-zinc-800 text-zinc-300"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-zinc-500 hover:text-rose-400 text-xs p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="pt-4 border-t border-zinc-800 space-y-3 text-xs">
                <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                  Campus Handover Details
                </h4>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={e => setBuyerName(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={buyerPhone}
                      onChange={e => setBuyerPhone(e.target.value)}
                      className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">College Email</label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={e => setBuyerEmail(e.target.value)}
                      className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Meetup / Hostel Delivery Spot
                  </label>
                  <input
                    type="text"
                    value={deliveryLocation}
                    onChange={e => setDeliveryLocation(e.target.value)}
                    placeholder="e.g. Central Library Lawn or Hostel Block B"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                    required
                  />
                </div>

                <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-800/60 text-[11px] text-blue-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-blue-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Payment: Cash or UPI on Handover</span>
                  </div>
                  <p className="text-zinc-400">
                    Zero advance payment required. Inspect your textbook or gadget in person before transferring funds.
                  </p>
                </div>

                {/* Subtotal & Action */}
                <div className="pt-2 border-t border-zinc-800 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-zinc-400 font-medium">Total Payable:</span>
                    <span className="text-xl font-extrabold text-blue-400 font-mono">
                      ₹{totalAmount}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? 'Confirming...' : 'Place Campus Order'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
