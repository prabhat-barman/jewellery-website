import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import type { CartItem } from '../App';

type CartProps = {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
};

export function Cart({ items, onUpdateQuantity, onRemove, onCheckout, onContinueShopping }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 5000 ? 0 : 200;
  const tax = subtotal * 0.03; // 3% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-100 rounded-full mb-6">
            <ShoppingCart className="w-12 h-12 text-amber-600" />
          </div>
          <h1 className="text-4xl mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <button
            onClick={onContinueShopping}
            className="bg-amber-600 text-white px-8 py-3 rounded-full hover:bg-amber-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 py-6 border-b last:border-b-0"
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span className="text-4xl">💎</span>
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.weight}</p>
                  <p className="text-amber-600">₹{item.price.toLocaleString()}</p>
                  {item.discount > 0 && (
                    <p className="text-xs text-green-600">
                      {item.discount}% discount applied
                    </p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-4">
                  <button
                    onClick={() => onRemove(item.productId)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4 mx-auto" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4 mx-auto" />
                    </button>
                  </div>

                  <p className="text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onContinueShopping}
            className="mt-6 flex items-center gap-2 text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-2xl mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-sm text-amber-600">
                  Add ₹{(5000 - subtotal).toLocaleString()} more for FREE shipping!
                </p>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (3%)</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-xl">Total</span>
                  <span className="text-2xl text-amber-600">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-amber-600 text-white py-4 rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Coupon Code */}
            <div className="mt-6">
              <label className="block text-sm text-gray-600 mb-2">
                Have a coupon code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Apply
                </button>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-green-800">
                🔒 Secure Checkout
              </p>
              <p className="text-xs text-green-600 mt-1">
                Your payment information is safe with us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
