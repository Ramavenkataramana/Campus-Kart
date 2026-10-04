import React, { useState } from 'react';
import { X, PlusCircle, Image as ImageIcon, MapPin, Tag } from 'lucide-react';
import { ProductCategory, ProductCondition, User } from '../types';

interface SellItemModalProps {
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (productData: any) => Promise<void>;
  onOpenAuth: () => void;
}

const PRESET_IMAGES = [
  {
    label: 'Textbooks / Notes',
    url: '/src/assets/images/dark_textbooks_1791056395760.jpg'
  },
  {
    label: 'Scientific Calculator / Electronics',
    url: '/src/assets/images/dark_calculator_1791056407327.jpg'
  },
  {
    label: 'Hostel Study Lamp / Desk Gear',
    url: '/src/assets/images/dark_dorm_setup_1791056421901.jpg'
  },
  {
    label: 'Campus Bicycle / Mobility',
    url: '/src/assets/images/product_campus_bicycle_1791055922465.jpg'
  }
];

export const SellItemModal: React.FC<SellItemModalProps> = ({
  currentUser,
  onClose,
  onSubmit,
  onOpenAuth
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Textbooks');
  const [condition, setCondition] = useState<ProductCondition>('Like New');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [pickupSpot, setPickupSpot] = useState('Central Library Steps');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      setErrorMsg('Please enter a title and price');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onSubmit({
        title: title.trim(),
        category,
        condition,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        description: description.trim() || 'Used college item in great condition.',
        pickupSpot: pickupSpot.trim(),
        imageUrl: customImageUrl.trim() || selectedImage,
        sellerName: currentUser ? currentUser.name : 'Campus Student',
        sellerContact: currentUser ? currentUser.email : 'student@college.edu'
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to list product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 max-w-xl w-full max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col text-zinc-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-none">
                Sell a College Item
              </h3>
              <span className="text-xs text-zinc-400">
                Post textbooks, calculators, or hostel gear for campus peers
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {!currentUser && (
            <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-800/60 text-blue-300 flex items-center justify-between">
              <span>Posting as student guest. Sign in to link directly to your profile.</span>
              <button
                type="button"
                onClick={onOpenAuth}
                className="font-bold underline text-blue-400 hover:text-blue-300"
              >
                Log In
              </button>
            </div>
          )}

          <div>
            <label className="block text-zinc-300 font-bold mb-1">
              Item Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Data Structures in C++ by Sahni (3rd Ed)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ProductCategory)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="Textbooks">Textbooks</option>
                <option value="Electronics">Electronics</option>
                <option value="Lab & Study Gear">Lab & Study Gear</option>
                <option value="Hostel Essentials">Hostel Essentials</option>
                <option value="Cycles & Mobility">Cycles & Mobility</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Item Condition</label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as ProductCondition)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="Like New">Like New (Barely used)</option>
                <option value="Brand New">Brand New (Unopened)</option>
                <option value="Good">Good (Light wear/highlighting)</option>
                <option value="Fair">Fair (Readable, worn)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">
                Your Price (₹) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="400"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Original Price (₹)</label>
              <input
                type="number"
                placeholder="800 (optional)"
                value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          {/* Photo Preset Selection */}
          <div className="space-y-1.5">
            <label className="block text-zinc-300 font-bold">Select Item Photo</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setSelectedImage(preset.url);
                    setCustomImageUrl('');
                  }}
                  className={`p-1.5 rounded-xl border text-left transition-all overflow-hidden ${
                    selectedImage === preset.url && !customImageUrl
                      ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/30'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full aspect-4/3 object-cover rounded-lg mb-1"
                  />
                  <div className="text-[10px] text-zinc-400 font-medium truncate">
                    {preset.label}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-1">
              <input
                type="text"
                placeholder="Or paste custom image URL (optional)"
                value={customImageUrl}
                onChange={e => setCustomImageUrl(e.target.value)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1">Campus Pickup Spot</label>
            <input
              type="text"
              placeholder="e.g. Central Library Steps or Hostel 3 Mess"
              value={pickupSpot}
              onChange={e => setPickupSpot(e.target.value)}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1">Description / Notes</label>
            <textarea
              rows={3}
              placeholder="Mention semester, edition, notes written inside, or bundled accessories..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white shadow-lg shadow-blue-600/25 transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Post Item on CampusKart'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
