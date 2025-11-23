import React, { useState } from 'react';
import { CreditCard, MapPin, User as UserIcon, Phone, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { CartItem, User } from '../App';

type CheckoutProps = {
  cart: CartItem[];
  user: User;
  onOrderComplete: (orderId: string) => void;
  onBack: () => void;
};

export function Checkout({ cart, user, onOrderComplete, onBack }: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'address' | 'payment'>('address');

  // Address Form
  const [fullName, setFullName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 5000 ? 0 : 200;
  const tax = subtotal * 0.03;
  const total = subtotal + shipping + tax;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phone || !address || !city || !state || !pincode) {
      setError('Please fill in all address fields');
      return;
    }

    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const orderData = {
        userId: user.id,
        items: cart,
        address: {
          fullName,
          email,
          phone,
          address,
          city,
          state,
          pincode,
        },
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod,
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ff9d2bf9/orders/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      if (paymentMethod === 'razorpay') {
        // In a real implementation, this would integrate with Razorpay
        // For demo purposes, we'll simulate payment
        console.log('Initiating Razorpay payment for order:', data.orderId);
        
        // Simulate payment success
        setTimeout(() => {
          onOrderComplete(data.orderId);
        }, 1000);
      } else {
        // Cash on Delivery
        onOrderComplete(data.orderId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Cart
      </button>

      <h1 className="text-4xl mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === 'address' ? 'text-amber-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'address' ? 'bg-amber-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {step === 'payment' ? '✓' : '1'}
              </div>
              <span>Address</span>
            </div>
            <div className="flex-1 h-px bg-gray-300" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'payment' ? 'bg-amber-600 text-white' : 'bg-gray-300 text-white'
              }`}>
                2
              </div>
              <span>Payment</span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Address Form */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl mb-6">Delivery Address</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={3}
                      placeholder="House No., Street, Landmark"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                    pattern="[0-9]{6}"
                    placeholder="400001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-amber-600 text-white py-4 rounded-xl hover:bg-amber-700 transition-colors"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {/* Payment Method */}
          {step === 'payment' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl mb-6">Payment Method</h2>

              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'razorpay')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <span>Online Payment (Razorpay)</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Pay securely using UPI, Cards, Net Banking, or Wallets
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">UPI</span>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Cards</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Net Banking</span>
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span>💵</span>
                      <span>Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Pay when you receive the product
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('address')}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 bg-amber-600 text-white py-4 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Place Order - ₹${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-2xl mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">💎</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-1">{item.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-xl">Total</span>
                <span className="text-2xl text-amber-600">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
