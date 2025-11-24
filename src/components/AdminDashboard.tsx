import React, { useState } from 'react';
import { ProductManagement } from './admin/ProductManagement';
import { OrderManagement } from './admin/OrderManagement';
import { DiscountManagement } from './admin/DiscountManagement';
import { PaymentManagement } from './admin/PaymentManagement';
import { Package, ShoppingCart, PercentIcon, CreditCard, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'discounts' | 'payments'>('overview');

  if (!user || !user.isAdmin) {
      return <div className="p-8 text-center">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl mb-2">Admin Dashboard</h1>
          <p>Welcome back, {user.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  Overview
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'products'
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  Products
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Orders
                </button>

                <button
                  onClick={() => setActiveTab('discounts')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'discounts'
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <PercentIcon className="w-5 h-5" />
                  Discounts
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'payments'
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Payments
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-4">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-3xl mb-6">Dashboard Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600">Total Sales</h3>
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-3xl">₹5,24,500</p>
                    <p className="text-sm text-green-600 mt-2">+12% from last month</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600">Total Orders</h3>
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-3xl">127</p>
                    <p className="text-sm text-blue-600 mt-2">+8% from last month</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600">Products</h3>
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-3xl">234</p>
                    <p className="text-sm text-purple-600 mt-2">15 added this week</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600">Pending Orders</h3>
                      <ShoppingCart className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-3xl">23</p>
                    <p className="text-sm text-orange-600 mt-2">Requires attention</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-2xl mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { type: 'order', text: 'New order #12345 received', time: '5 min ago' },
                      { type: 'product', text: 'Diamond Ring added to inventory', time: '1 hour ago' },
                      { type: 'payment', text: 'Payment received for order #12344', time: '2 hours ago' },
                      { type: 'order', text: 'Order #12343 shipped', time: '3 hours ago' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'order' ? 'bg-blue-100' :
                            activity.type === 'product' ? 'bg-purple-100' :
                            'bg-green-100'
                          }`}>
                            {activity.type === 'order' ? '📦' : 
                             activity.type === 'product' ? '💎' : '💳'}
                          </div>
                          <div>
                            <p>{activity.text}</p>
                            <p className="text-sm text-gray-600">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && <ProductManagement user={user} />}
            {activeTab === 'orders' && <OrderManagement user={user} />}
            {activeTab === 'discounts' && <DiscountManagement user={user} />}
            {activeTab === 'payments' && <PaymentManagement user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}
