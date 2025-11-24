import React from 'react';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-4xl mb-4">Order Placed Successfully!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for shopping with Jewel Palace
        </p>

        {/* Order ID */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-600 mb-2">Your Order ID</p>
          <p className="text-2xl text-amber-900">{orderId}</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-6 h-6 text-blue-600" />
              <h3>Order Confirmation</h3>
            </div>
            <p className="text-sm text-gray-600">
              We've sent you an order confirmation email with all the details.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-6 h-6 text-purple-600" />
              <h3>Track Your Order</h3>
            </div>
            <p className="text-sm text-gray-600">
              You can track your order status from your dashboard.
            </p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 text-left">
          <h2 className="text-2xl mb-4">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="mb-1">Order Confirmation</h3>
                <p className="text-sm text-gray-600">
                  You'll receive a confirmation email shortly with your order details.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="mb-1">Processing</h3>
                <p className="text-sm text-gray-600">
                  Our team will carefully pack your jewellery with love and care.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="mb-1">Shipping</h3>
                <p className="text-sm text-gray-600">
                  You'll receive tracking details once your order is shipped.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="mb-1">Delivery</h3>
                <p className="text-sm text-gray-600">
                  Your beautiful jewellery will be delivered to your doorstep!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/products')}
            className="bg-amber-600 text-white px-8 py-4 rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Support */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
          <p className="text-sm">
            Contact us at{' '}
            <a href="mailto:support@jewelpalace.com" className="text-amber-600 hover:text-amber-700">
              support@jewelpalace.com
            </a>
            {' '}or call{' '}
            <a href="tel:+919876543210" className="text-amber-600 hover:text-amber-700">
              +91 98765 43210
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
