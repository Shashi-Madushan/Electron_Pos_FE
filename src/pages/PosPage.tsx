import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import CategoryScroll from '../components/CategoryScroll';
import OrderSummary from '../components/OrderSummary';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const PosPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'coffee', name: '☕ Coffee' },
    { id: 'beverages', name: '🥤 Beverages' },
    { id: 'snacks', name: '🍿 Snacks' },
  ];

  const brands = [
    { id: 'all', name: 'All Brands' },
    { id: 'costa', name: 'Costa' },
    { id: 'starbucks', name: 'Starbucks' },
  ];

  const handleUpdateQuantity = (id: string, change: number) => {
    setOrderItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleAddToOrder = (product: { name: string; price: number }) => {
    setOrderItems(items => {
      const existingItem = items.find(item => item.name === product.name);
      if (existingItem) {
        return items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...items, {
        id: Date.now().toString(),
        name: product.name,
        price: product.price,
        quantity: 1
      }];
    });
  };

  return (
    <div className="h-screen bg-white flex gap-4 p-4 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full gap-4 overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black">Point of Sale</h1>
            <div className="bg-gray-100 rounded p-1 flex border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded transition-all duration-300 text-sm font-medium ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-black hover:bg-gray-200'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded transition-all duration-300 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-black hover:bg-gray-200'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Categories Scroll */}
        <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
          <CategoryScroll
            items={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Brands Scroll */}
        <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
          <CategoryScroll
            items={brands}
            selected={selectedBrand}
            onSelect={setSelectedBrand}
          />
        </div>

        {/* Products Grid/List */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 flex-1 overflow-hidden">
          <div className={`h-full overflow-y-auto ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
              : 'grid grid-cols-1 gap-4'
          }`}>
            {/* Sample products - replace with actual data */}
            {[1, 2, 3, 4].map((item) => (
              <ProductCard
                key={item}
                name={`Product ${item}`}
                price={9.99}
                image="/placeholder.jpg"
                onAdd={() => handleAddToOrder({ name: `Product ${item}`, price: 9.99 })}
                view={viewMode}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-96 h-full">
        <OrderSummary
          items={orderItems}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </div>
    </div>
  );
};

export default PosPage;