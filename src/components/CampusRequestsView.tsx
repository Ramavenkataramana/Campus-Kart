import React, { useState } from 'react';
import {
  HelpCircle,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  Tag,
  MessageCircle,
  Send,
  X
} from 'lucide-react';
import { CampusItemRequest, ProductCategory, User } from '../types';
import { createCampusRequest } from '../services/api';

interface CampusRequestsViewProps {
  requests: CampusItemRequest[];
  currentUser: User | null;
  onRequestCreated: (newReq: CampusItemRequest) => void;
  onOpenSellWithPrefill: (title: string, category: ProductCategory) => void;
  onShowToast: (msg: string) => void;
}

export const CampusRequestsView: React.FC<CampusRequestsViewProps> = ({
  requests,
  currentUser,
  onRequestCreated,
  onOpenSellWithPrefill,
  onShowToast
}) => {
  const [isPosting, setIsPosting] = useState(false);
  const [itemTitle, setItemTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Textbooks');
  const [budgetMax, setBudgetMax] = useState('');
  const [urgency, setUrgency] = useState<'Today / Urgent' | 'This Week' | 'Anytime'>('This Week');
  const [neededAt, setNeededAt] = useState('Central Library / Hostel Gate');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim() || !budgetMax) return;
    setIsSubmitting(true);

    try {
      const newReq = await createCampusRequest({
        itemTitle: itemTitle.trim(),
        category,
        budgetMax: Number(budgetMax),
        urgency,
        neededAt: neededAt.trim(),
        requesterName: currentUser ? currentUser.name : 'Campus Student',
        requesterBranch: currentUser ? currentUser.collegeBranch : 'Engineering',
        requesterYear: currentUser ? currentUser.collegeYear : '2nd Year'
      });
      onRequestCreated(newReq);
      setIsPosting(false);
      setItemTitle('');
      setBudgetMax('');
      onShowToast('Request posted to Campus Wishlist! Students will be notified.');
    } catch (err: any) {
      alert('Failed to post request: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-zinc-100">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            Campus Wishlist & Item Requests
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Can't find a textbook, drafter, or lab coat listed? Post what you need and peers will reach out!
          </p>
        </div>

        <button
          onClick={() => setIsPosting(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Request</span>
        </button>
      </div>

      {/* Post Request Modal */}
      {isPosting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-lg w-full rounded-3xl shadow-2xl p-6 space-y-4 text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">
                Post an Item Request
              </h3>
              <button
                onClick={() => setIsPosting(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  What item do you need? <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Microprocessors 8085/8086 by Ramesh Gaonkar"
                  value={itemTitle}
                  onChange={e => setItemTitle(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                  >
                    <option value="Textbooks">Textbooks</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Lab & Study Gear">Lab & Study Gear</option>
                    <option value="Hostel Essentials">Hostel Essentials</option>
                    <option value="Cycles & Mobility">Cycles & Mobility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">
                    Max Budget (₹) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 450"
                    value={budgetMax}
                    onChange={e => setBudgetMax(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Urgency</label>
                  <select
                    value={urgency}
                    onChange={e => setUrgency(e.target.value as any)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                  >
                    <option value="Today / Urgent">Today / Urgent (Exam soon)</option>
                    <option value="This Week">This Week</option>
                    <option value="Anytime">Anytime this semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Needed Near</label>
                  <input
                    type="text"
                    placeholder="e.g. CS Block / Hostel 3"
                    value={neededAt}
                    onChange={e => setNeededAt(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPosting(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {isSubmitting ? 'Posting...' : 'Post Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map(req => {
          const isUrgent = req.urgency === 'Today / Urgent';

          return (
            <div
              key={req.id}
              className={`p-5 rounded-2xl border bg-zinc-900/90 backdrop-blur-md shadow-xl floating-card flex flex-col justify-between space-y-4 ${
                isUrgent ? 'border-amber-500/60 ring-1 ring-amber-500/30' : 'border-zinc-800'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      isUrgent
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                        : 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                    }`}
                  >
                    {req.urgency}
                  </span>

                  <span className="text-xs font-mono font-bold text-blue-400">
                    Budget: Up to ₹{req.budgetMax}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-100 leading-snug">
                  {req.itemTitle}
                </h3>

                <div className="space-y-1 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-300">
                      {req.requesterName}
                    </span>
                    <span>·</span>
                    <span>{req.requesterBranch.split(' ')[0]} ({req.requesterYear})</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    <span>{req.neededAt}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">
                  {req.responsesCount} peers responded
                </span>

                <button
                  onClick={() => {
                    onOpenSellWithPrefill(req.itemTitle, req.category);
                    onShowToast(`Prefilled "${req.itemTitle}". Add price to post!`);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  <span>I have this!</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
