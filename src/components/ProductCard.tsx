import React from 'react';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
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

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image, stock, onAdd, view }) => {
  const [imgError, setImgError] = React.useState(false);

  const getStockStatus = (stock: number): { color: string; text: string } => {
    if (stock === 0) return { color: 'bg-red-100 text-red-600', text: 'Out of Stock' };
    if (stock < 10) return { color: 'bg-yellow-100 text-yellow-700', text: 'Low Stock' };
    return { color: 'bg-green-100 text-green-700', text: 'In Stock' };
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
        className="flex items-center gap-6 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-disabled={stock === 0}
      >
        <div className="relative flex-shrink-0 w-20 h-20 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
          {!imgError ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-pink-300 text-black text-3xl font-bold">
              {getInitials(name)}
            </div>
          )}
          <span className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs font-semibold ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 truncate">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-base font-semibold">LKR {price.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); handleClick(e); }}
          disabled={stock === 0}
          className={`px-5 py-2 rounded-lg font-semibold text-sm shadow transition-all duration-200 ${
            stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {stock === 0 ? 'Out of Stock' : 'Add'}
        </button>
      </div>
    );
  }

  // --- Grid View ---
  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group relative cursor-pointer"
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-disabled={stock === 0}
    >
      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center">
        {!imgError ? (
          <img
            src={image}
            alt={name}
            className="w-24 h-24 object-cover rounded-xl border border-gray-100 transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center bg-pink-300 text-black text-4xl font-bold rounded-xl">
            {getInitials(name)}
          </div>
        )}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded text-xs font-semibold ${stockStatus.color} shadow`}>
          {stockStatus.text}
        </span>
        <span className="absolute top-3 right-3 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow">
          LKR {price.toFixed(2)}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2">{name}</h3>
        <div className="flex-1" />
        <button
          onClick={e => { e.stopPropagation(); handleClick(e); }}
          disabled={stock === 0}
          className={`w-full py-2 rounded-lg font-semibold text-sm mt-2 transition-all duration-200 ${
            stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {stock === 0 ? 'Out of Stock' : 'Add to Order'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
