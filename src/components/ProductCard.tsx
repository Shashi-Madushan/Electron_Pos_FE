import React from 'react';

interface ProductCardProps {
  name: string;
  price: number;
  stock: number;
  onAdd: () => void;
  view: 'grid' | 'list';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, stock, onAdd, view }) => {
  const getStockStatus = (stock: number): { color: string; text: string } => {
    if (stock === 0) return { color: 'bg-red-50 text-red-700', text: 'Out of Stock' };
    if (stock < 10) return { color: 'bg-amber-50 text-amber-700', text: 'Low Stock' };
    return { color: 'bg-emerald-50 text-emerald-700', text: 'In Stock' };
  };

  const stockStatus = getStockStatus(stock);

  // Update button click handler
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (stock > 0) {
      onAdd();
    }
  };

  // --- List View ---
  if (view === 'list') {
    return (
      <div
        className="flex items-center gap-8 p-5 bg-white border border-gray-200 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-disabled={stock === 0}
      >
        <div className="relative flex-shrink-0 w-24 h-24 flex items-center justify-center bg-slate-200 rounded-xl overflow-hidden text-slate-600 text-2xl font-semibold">
          {getInitials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">{name}</h3>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-blue-600">LKR {price.toFixed(2)}</span>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
              {stock} in stock
            </span>
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); handleClick(e); }}
          disabled={stock === 0}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 active:transform active:scale-95'
          }`}
        >
          {stock === 0 ? 'Out of Stock' : 'Add to Order'}
        </button>
      </div>
    );
  }

  // --- Grid View ---
  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-disabled={stock === 0}
    >
      <div className="relative w-full aspect-square p-6 bg-slate-200 flex items-center justify-center">
        <div className="w-32 h-32 flex items-center justify-center text-slate-600 text-3xl font-semibold rounded-xl">
          {getInitials(name)}
        </div>
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <span className="bg-white shadow-sm text-blue-600 px-3 py-1.5 rounded-lg text-sm font-bold">
            LKR {price.toFixed(2)}
          </span>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${stockStatus.color}`}>
            {stock} in stock
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-gray-900 mb-4 line-clamp-2 min-h-[48px]">{name}</h3>
        <div className="mt-auto">
          <button
            onClick={e => { e.stopPropagation(); handleClick(e); }}
            disabled={stock === 0}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 active:transform active:scale-95'
            }`}
          >
            {stock === 0 ? 'Out of Stock' : 'Add to Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
