import React, { useState, useEffect } from 'react';
import { Search, Eye, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { projectId } from '../../utils/supabase/info';
import type { User } from '../../App';

type Order = {
  id: string;
  userId: string;
  createdAt: string;
  status: string;
  items: any[];
  address: any;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  tracking?: string;
  courierName?: string;
};

type OrderManagementProps = {
  user: User;
};

export function OrderManagement({ user }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');

  // Update tracking form
  const [tracking, setTracking] = useState('');
  const [courierName, setCourierName] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const statuses = ['Pending', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ff9d2bf9/admin/orders`,
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

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTracking(order.tracking || '');
    setCourierName(order.courierName || '');
    setShowModal(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ff9d2bf9/admin/orders/${selectedOrder.id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            status: newStatus,
            tracking,
            courierName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      setSuccessMessage('Order updated successfully');
      setShowModal(false);
      fetchOrders();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Failed to update order:', error);
      alert('Failed to update order');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ff9d2bf9/admin/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({ status: 'Cancelled' }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      setSuccessMessage('Order cancelled successfully');
      fetchOrders();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order');
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <h2 className="text-3xl mb-6">Order Management</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders by ID, name, or email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Statuses</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-2xl">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl text-yellow-600">{orders.filter(o => o.status === 'Pending').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-600 mb-1">Shipped</p>
          <p className="text-2xl text-purple-600">{orders.filter(o => o.status === 'Shipped').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-600 mb-1">Delivered</p>
          <p className="text-2xl text-green-600">{orders.filter(o => o.status === 'Delivered').length}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Items</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Total</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Payment</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p>{order.address?.fullName || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{order.address?.phone || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm">{order.items.length}</td>
                    <td className="px-6 py-4">₹{order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm">{order.paymentMethod === 'razorpay' ? 'Online' : 'COD'}</p>
                        <span className={`text-xs ${
                          order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {order.paymentStatus || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View/Edit Order"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl mb-6">Order Details - {selectedOrder.id}</h3>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p>{selectedOrder.address?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p>{selectedOrder.address?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p>{selectedOrder.address?.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p>{selectedOrder.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Address</p>
                    <p>
                      {selectedOrder.address?.address}, {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-2xl">💎</span>
                      </div>
                      <div className="flex-1">
                        <p>{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity} | Weight: {item.weight}</p>
                      </div>
                      <p>₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{selectedOrder.shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>₹{selectedOrder.tax.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span>Total</span>
                    <span className="text-xl text-amber-600">₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Update Order Form */}
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Order Status *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Courier Name</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g., BlueDart, Delhivery, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Tracking Number</label>
                  <input
                    type="text"
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2"
                  >
                    <Truck className="w-5 h-5" />
                    Update Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
