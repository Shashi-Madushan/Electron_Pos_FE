import React from 'react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  discount: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (id: string, change: number) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, onUpdateQuantity }) => {
  const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const discountTotal = items.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const formatLKR = (amount: number) => {
    return `LKR ${amount.toFixed(2)}`;
  };

  const handlePayNow = () => {
    const orderSummary = {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: item.quantity,
        discount: item.discount,
      })),
      originalTotal,
      discountTotal,
      subtotal,
      total,
    };
    console.log('Order Summary:', orderSummary);
  };

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
                <p className="text-blue-600">
                  {item.discount > 0 ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">
                        {formatLKR(item.originalPrice)}
                      </span>
                      {formatLKR(item.price)}
                    </>
                  ) : (
                    formatLKR(item.price)
                  )}
                  {item.discount > 0 && (
                    <span className="text-red-500 text-sm ml-2">(-{item.discount}%)</span>
                  )}
                </p>
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
          <span className="text-gray-600">Original Total</span>
          <span className="font-medium">{formatLKR(originalTotal)}</span>
        </div>
        <div className="flex justify-between mb-2 text-red-600">
          <span>Total Discount</span>
          <span>-{formatLKR(discountTotal)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatLKR(subtotal)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold text-black">Total</span>
          <span className="font-bold text-blue-600">{formatLKR(total)}</span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-2 text-red-600 border border-red-100 rounded font-medium hover:bg-red-50 transition-colors">
            Cancel
          </button>
          <button
            className="flex-1 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
            onClick={handlePayNow}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
