import React, { useState, useRef, useEffect } from 'react';
import type { Product } from '../types/Product';

interface AddToCartModalProps {
  product: Product;
  onClose: () => void;
  onAdd: (product: Product, quantity: number, discount: number) => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ product, onClose, onAdd }) => {
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [discount, setDiscount] = useState('');
  const qtyRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    qtyRef.current?.focus();
  }, []);

  // close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleQtyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      discountRef.current?.focus();
    }
  };

  const handleDiscountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAdd(product, quantity === '' ? 1 : quantity, Number(discount) || 0);
    }
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity('');
    } else {
      const parsedValue = parseInt(value);
      if (!isNaN(parsedValue)) {
        // clamp to [1, product.qty]
        const clamped = Math.max(1, Math.min(parsedValue, product.qty));
        setQuantity(clamped);
      }
    }
  };

  const handleQtyBlur = () => {
    if (quantity === '' || quantity < 1) {
      setQuantity(1);
    }
  };

  const incrementQty = () => {
    const current = quantity === '' ? 1 : quantity;
    if (current < product.qty) setQuantity(current + 1);
  };
  const decrementQty = () => {
    const current = quantity === '' ? 1 : quantity;
    if (current > 1) setQuantity(current - 1);
  };

  const incrementDiscount = () => {
    const current = discount === '' ? 0 : Number(discount);
    const next = Math.min(100, Math.max(0, current + 1));
    setDiscount(String(next));
  };
  const decrementDiscount = () => {
    const current = discount === '' ? 0 : Number(discount);
    const next = Math.min(100, Math.max(0, current - 1));
    setDiscount(String(next));
  };

  const originalTotal = product.salePrice * (quantity === '' ? 1 : quantity);
  const discountAmount = originalTotal * (Number(discount) / 100 || 0);
  const finalTotal = originalTotal - discountAmount;

  // stock badge (enhanced)
  const stockStatus = product.qty === 0 ? 'out' : product.qty < 5 ? 'low' : 'ok';
  const stockBadgeClass =
    stockStatus === 'out'
      ? 'bg-red-100 text-red-800'
      : stockStatus === 'low'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-green-100 text-green-800';

  // clearer label and a small meter (threshold 20 units => full)
  const stockLabel =
    stockStatus === 'out'
      ? 'Out of stock'
      : stockStatus === 'low'
      ? `Only ${product.qty} left`
      : `In stock`;

  const stockPct = Math.min(100, Math.round((product.qty / 20) * 100)); // 20 units = full bar

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-lg shadow-2xl w-full max-w-xl overflow-hidden"
      >
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* optional product image */}
              {/*
                If your Product type includes an image url property like `imageUrl`,
                it will display here. If not available, a compact placeholder is shown.
              */}
              <div className="w-20 h-20 flex-shrink-0 rounded-md bg-gray-50 border flex items-center justify-center overflow-hidden">
                {/*
                  ...existing code...
                */}
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image} alt={product.productName} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-sm text-gray-500 px-2 text-center">
                    No Image
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-semibold leading-tight text-gray-900">{product.productName}</h2>

                {/* REPLACED: larger stock badge + meter */}
                <div className="mt-3 flex items-center gap-3">
                  <div className={`text-sm md:text-base font-semibold px-3 py-1 rounded-full ${stockBadgeClass} flex items-center gap-2`}>
                    {/* optional simple icon */}
                    <span className="inline-block w-2 h-2 rounded-full"
                          style={{ background: stockStatus === 'out' ? '#DC2626' : stockStatus === 'low' ? '#D97706' : '#10B981' }} />
                    <span>{stockLabel}{stockStatus === 'ok' ? ` (${product.qty})` : ''}</span>
                  </div>

                  {/* stock meter for quick visual cue */}
                  <div className="flex flex-col">
                    <div className="text-xs text-gray-500">Stock level</div>
                    <div className="w-40 h-2 bg-gray-200 rounded overflow-hidden">
                      <div
                        style={{ width: `${stockPct}%` }}
                        className={`${stockStatus === 'out' ? 'bg-red-500' : stockStatus === 'low' ? 'bg-yellow-400' : 'bg-green-500'} h-full`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-2xl font-bold text-blue-600">LKR {product.salePrice.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Unit price</div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-gray-400 hover:text-gray-600 ml-auto p-2 rounded"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQty}
                  disabled={product.qty === 0 || (quantity === '' ? 1 : quantity) <= 1}
                  className="w-10 h-10 flex items-center justify-center rounded border bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  ref={qtyRef}
                  type="number"
                  min={1}
                  max={product.qty}
                  value={quantity}
                  onChange={handleQtyChange}
                  onBlur={handleQtyBlur}
                  onKeyDown={handleQtyKeyDown}
                  className="w-24 text-center border rounded p-2"
                  aria-label="Quantity"
                  disabled={product.qty === 0}
                />
                <button
                  onClick={incrementQty}
                  disabled={product.qty === 0 || (quantity === '' ? 1 : quantity) >= product.qty}
                  className="w-10 h-10 flex items-center justify-center rounded border bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  +
                </button>

                {/* REPLACED: more prominent available count */}
                <div className="ml-3 text-sm">
                  <div className="text-xs text-gray-500">Available</div>
                  <div className="font-semibold text-lg">{product.qty}</div>
                </div>
              </div>
              {product.qty === 0 && (
                <div className="mt-2 text-sm text-red-600">This item is currently out of stock.</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Discount (%)</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementDiscount}
                  className="w-10 h-10 flex items-center justify-center rounded border bg-gray-50 hover:bg-gray-100"
                  aria-label="Decrease discount"
                >
                  -
                </button>
                <input
                  ref={discountRef}
                  type="number"
                  min={0}
                  max={100}
                  value={discount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                      setDiscount(value);
                    }
                  }}
                  onKeyDown={handleDiscountKeyDown}
                  className="w-24 text-center border rounded p-2"
                  placeholder="0"
                  aria-label="Discount percent"
                />
                <button
                  onClick={incrementDiscount}
                  className="w-10 h-10 flex items-center justify-center rounded border bg-gray-50 hover:bg-gray-100"
                  aria-label="Increase discount"
                >
                  +
                </button>
                <div className="text-sm text-gray-500 ml-2">Max 100%</div>
              </div>
              {Number(discount) > 50 && (
                <div className="mt-2 text-sm text-yellow-700">Large discount applied</div>
              )}
            </div>

            <div className="md:col-span-2 mt-2">
              <div className="bg-gray-50 border rounded p-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Unit price</span>
                  <span>LKR {product.salePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Quantity</span>
                  <span>×{quantity === '' ? 1 : quantity}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Subtotal</span>
                  <span>LKR {originalTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-red-600 mt-1">
                  <span>Discount</span>
                  <span>-LKR {discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Final Total</span>
                  <span aria-live="polite">LKR {finalTotal.toFixed(2)}</span>
                </div>
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
            onClick={() => onAdd(product, quantity === '' ? 1 : quantity, Number(discount) || 0)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={product.qty === 0}
          >
            {product.qty === 0 ? 'Unavailable' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
