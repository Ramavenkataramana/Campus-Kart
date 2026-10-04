import React from 'react';
import { Package, PlusCircle, CheckCircle, Tag, Trash2, ExternalLink } from 'lucide-react';
import { Product } from '../types';

interface MyProductsViewProps {
  products: Product[];
  onOpenSellModal: () => void;
  onToggleStatus: (id: string, currentStatus: 'available' | 'sold') => void;
  onDeleteProduct: (id: string) => void;
  onViewProduct: (product: Product) => void;
}

export const MyProductsView: React.FC<MyProductsViewProps> = ({
  products,
  onOpenSellModal,
  onToggleStatus,
  onDeleteProduct,
  onViewProduct
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-zinc-100">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            My Posted Products ({products.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your listings, update item status when handed over, or remove completed sales.
          </p>
        </div>

        <button
          onClick={onOpenSellModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-colors shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Post Another Item</span>
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 text-blue-400 mx-auto flex items-center justify-center animate-float">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-white">
            You haven't listed any items yet
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Have old textbooks, an extra calculator, or semester notes? Put them up for sale for campus peers in seconds.
          </p>
          <button
            onClick={onOpenSellModal}
            className="mt-2 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md"
          >
            Sell Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(product => {
            const isSold = product.status === 'sold';

            return (
              <div
                key={product.id}
                className="bg-zinc-900/90 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl floating-card flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 bg-zinc-950 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-md ${
                        isSold
                          ? 'bg-rose-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isSold ? 'SOLD' : 'AVAILABLE'}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-blue-400 text-[11px] font-mono font-bold border border-white/10">
                      ₹{product.price}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    <div className="text-[11px] text-zinc-500 font-medium">
                      {product.category} · {product.condition}
                    </div>

                    <h3 className="text-sm font-bold text-zinc-100 line-clamp-2">
                      {product.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Seller Actions */}
                <div className="p-4 pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() =>
                      onToggleStatus(product.id, isSold ? 'available' : 'sold')
                    }
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                      isSold
                        ? 'border-emerald-600/50 text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40'
                        : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {isSold ? 'Mark Available' : 'Mark as Sold'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewProduct(product)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 transition-colors"
                      title="View details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
