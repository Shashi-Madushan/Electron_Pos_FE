import React from 'react';
import type { SaleItemDTO } from '../types/Sale';
import OrderSummary from './OrderSummary';
import type { Product } from '../types/Product';

interface CheckoutSectionProps {
  orderItems: SaleItemDTO[];
  products: Product[];
  paymentMethod: string;
  orderTotals: {
    originalTotal: number;
    itemDiscounts: number;
    subtotal: number;
    orderDiscountPercentage: number;
    orderDiscount: number;
  };
  onOrderTotalsChange: (totals: {
    originalTotal: number;
    itemDiscounts: number;
    subtotal: number;
    orderDiscountPercentage: number;
    orderDiscount: number;
  }) => void;
  onUpdateQuantity: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
  onPaymentMethodChange: (method: string) => void;
  onCheckout: () => void;
  onClear: () => void;
}

const CheckoutSection: React.FC<CheckoutSectionProps> = ({
  orderItems,
  products,
  paymentMethod,
  onUpdateQuantity,
  onRemoveItem,
  onPaymentMethodChange,
  onCheckout,
  onClear,
  onOrderTotalsChange
}) => {
  return (
    <div className="w-96 h-full flex flex-col">
      <OrderSummary
        items={orderItems}
        products={products}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onOrderTotalsChange={onOrderTotalsChange}
      />
      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={e => onPaymentMethodChange(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 text-red-600 border border-red-100 rounded font-medium hover:bg-red-50 transition-colors"
            onClick={onClear}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700"
            onClick={onCheckout}
            disabled={orderItems.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;