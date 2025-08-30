import React, { useState } from 'react';
import type{ Product } from '../types/Product';
interface AddToCartModalProps {
  product: Product;
  onClose: () => void;
  onAdd: (product: Product, quantity: number, discount: number) => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ product, onClose, onAdd }) => {
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);

  const originalTotal = product.salePrice * quantity;
  const discountAmount = originalTotal * (discount / 100);
  const finalTotal = originalTotal - discountAmount;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{product.productName}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-gray-100 rounded"
                >-</button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border rounded p-1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-gray-100 rounded"
                >+</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <span>Original Price:</span>
                <span>LKR {product.salePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>×{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>LKR {originalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>-LKR {discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Final Total:</span>
                <span>LKR {finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onAdd(product, quantity, discount)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
