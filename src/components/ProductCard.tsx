import React from 'react';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  onAdd: () => void;
  view: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image, onAdd, view }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${view === 'grid' ? 'w-full' : 'w-full flex gap-4'}`}>
      <img src={image} alt={name} className="w-32 h-32 object-cover mx-auto rounded" />
      <div className={view === 'list' ? 'flex-1' : ''}>
        <h3 className="text-lg font-semibold mt-2 text-black">{name}</h3>
        <p className="text-blue-600 font-bold">${price.toFixed(2)}</p>
        <button
          onClick={onAdd}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors w-full"
        >
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
