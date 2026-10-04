import React from 'react';
import { Clock, CheckCircle2, ShoppingBag, MapPin, Calendar, Tag } from 'lucide-react';
import { Order } from '../types';

interface MyOrdersViewProps {
  orders: Order[];
  onBrowseItems: () => void;
}

export const MyOrdersView: React.FC<MyOrdersViewProps> = ({
  orders,
  onBrowseItems
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-zinc-100">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            My Campus Orders ({orders.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Track orders placed for textbooks, lab manuals, and electronics with student sellers.
          </p>
        </div>

        <button
          onClick={onBrowseItems}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-colors shrink-0"
        >
          Browse Marketplace
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 text-blue-400 mx-auto flex items-center justify-center animate-float">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-white">
            No orders placed yet
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Find discounted textbooks, calculators, and hostel essentials from students on your campus.
          </p>
          <button
            onClick={onBrowseItems}
            className="mt-2 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md"
          >
            Explore Used Items
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={order.id}
                className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-5 shadow-xl space-y-4 text-zinc-100"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-blue-400">
                      #{order.id}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-400">{dateStr}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{order.status === 'confirmed' ? 'Awaiting Handover' : order.status}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Total:</span>
                    <span className="text-sm font-extrabold text-blue-400 font-mono">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-white">
                            {item.title}
                          </h4>
                          <span className="text-zinc-400 text-[11px]">
                            Seller: {item.sellerName}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono font-bold text-blue-400 shrink-0">
                        ₹{item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery & Handover info */}
                <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>
                      Meetup Location: <strong className="text-zinc-200">{order.deliveryLocation}</strong>
                    </span>
                  </div>

                  <div>
                    Payment: <strong className="text-zinc-200">{order.paymentMethod}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
