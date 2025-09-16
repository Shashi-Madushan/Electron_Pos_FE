import React from 'react';
import type { Product}  from '../types/Product';

interface ProductsDisplayProps {
  viewMode: 'grid' | 'list';
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const ProductsDisplay: React.FC<ProductsDisplayProps> = ({
  viewMode,
  products,
  onProductSelect,
}) => {
  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span className="text-lg font-medium">No products found</span>
        <p className="text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.productId} className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:border-blue-400 transition cursor-pointer group" onClick={() => onProductSelect(product)}>
            <div className="flex-1 flex flex-col justify-between">
              <span className="font-semibold text-lg text-gray-900 mb-2 truncate">{product.productName}</span>
              <span className="text-blue-600 font-bold text-base mb-2">LKR {product.salePrice.toFixed(2)}</span>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${product.qty === 0 ? 'bg-red-50 text-red-700' : product.qty < 10 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{product.qty} in stock</span>
            </div>
            <button
              className={`w-full py-2 rounded-lg font-semibold text-sm mt-2 transition-all duration-200 ${product.qty === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'}`}
              disabled={product.qty === 0}
            >
              {product.qty === 0 ? 'Out of Stock' : 'Add'}
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul className="w-full flex flex-col gap-3">
      {products.map((product) => (
        <li key={product.productId} className="flex items-center justify-between px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:bg-blue-50 transition cursor-pointer" onClick={() => onProductSelect(product)}>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-semibold text-lg text-gray-900 truncate">{product.productName}</span>
            <span className="text-xs text-gray-500">ID: {product.productId}</span>
          </div>
          <span className="text-blue-600 font-bold text-base mx-6">LKR {product.salePrice.toFixed(2)}</span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium mx-2 ${product.qty === 0 ? 'bg-red-50 text-red-700' : product.qty < 10 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{product.qty} in stock</span>
          <button
            className={`ml-6 px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${product.qty === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
            disabled={product.qty === 0}
          >
            {product.qty === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ProductsDisplay;