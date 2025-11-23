import React, { useState, useEffect } from 'react';
import { Package, MapPin, CreditCard, User as UserIcon, FileText, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { User } from '../App';

type Order = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: any[];
  tracking?: string;
};

type UserDashboardProps = {
  user: User;
  onViewOrder: (orderId: string) => void;
};

export function UserDashboard({ user, onViewOrder }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ff9d2bf9/orders/user`,
        {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'packed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'out for delivery':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
                <UserIcon className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="text-xl mb-1">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5" />
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                Profile
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-3xl mb-6">My Orders</h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl mb-2">No Orders Yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't placed any orders yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                              <span className="text-2xl">💎</span>
                            </div>
                            <div className="flex-1">
                              <p>{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p>₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="text-xl text-amber-600 ml-2">
                            ₹{order.total.toLocaleString()}
                          </span>
                        </div>
                        {order.tracking && (
                          <div className="text-sm text-gray-600">
                            Tracking: {order.tracking}
                          </div>
                        )}
                      </div>

                      {/* Status Timeline */}
                      <div className="mt-6 pt-6 border-t">
                        <div className="flex items-center justify-between relative">
                          {['Pending', 'Packed', 'Shipped', 'Delivered'].map((status, index) => {
                            const currentIndex = ['Pending', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].indexOf(order.status);
                            const statusIndex = ['Pending', 'Packed', 'Shipped', 'Delivered'].indexOf(status);
                            const isCompleted = statusIndex <= currentIndex;
                            const isCurrent = statusIndex === currentIndex;

                            return (
                              <div key={status} className="flex flex-col items-center z-10">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                    isCompleted
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-200 text-gray-600'
                                  } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                                >
                                  {isCompleted ? '✓' : index + 1}
                                </div>
                                <span className="text-xs text-gray-600">{status}</span>
                              </div>
                            );
                          })}
                          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-3xl mb-6">My Profile</h2>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="mb-4">Account Type</h3>
                    <div className="inline-flex px-4 py-2 bg-amber-100 text-amber-900 rounded-full">
                      {user.isAdmin ? 'Administrator' : 'Customer'}
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <button className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
