import React from 'react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (id: string, change: number) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, onUpdateQuantity }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.015;
  const total = subtotal + tax;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-black">Checkout</h2>
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No items in order</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 mb-4 p-2 hover:bg-gray-50 rounded">
              <div className="flex-1">
                <h3 className="text-black font-medium">{item.name}</h3>
                <p className="text-blue-600">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-black"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-black"
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Tax (1.5%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold text-black">Total</span>
          <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-2 text-red-600 border border-red-100 rounded font-medium hover:bg-red-50 transition-colors">
            Cancel
          </button>
          <button className="flex-1 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
