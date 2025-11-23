import React, { useState } from 'react';
import { Search, Download, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import type { User } from '../../App';

type Payment = {
  id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  method: string;
  status: 'success' | 'failed' | 'pending';
  customerName: string;
  customerEmail: string;
  date: string;
};

type PaymentManagementProps = {
  user: User;
};

export function PaymentManagement({ user }: PaymentManagementProps) {
  const [payments] = useState<Payment[]>([
    {
      id: '1',
      orderId: 'ORD001',
      paymentId: 'pay_MpZ9K7gH3jK9Lm',
      amount: 45000,
      method: 'UPI',
      status: 'success',
      customerName: 'Priya Sharma',
      customerEmail: 'priya@email.com',
      date: '2025-11-20T10:30:00',
    },
    {
      id: '2',
      orderId: 'ORD002',
      paymentId: 'pay_NqA8L5fG2iH8Kl',
      amount: 32500,
      method: 'Credit Card',
      status: 'success',
      customerName: 'Rahul Patel',
      customerEmail: 'rahul@email.com',
      date: '2025-11-20T14:15:00',
    },
    {
      id: '3',
      orderId: 'ORD003',
      paymentId: 'pay_OpB7M6eF1hG7Jk',
      amount: 28000,
      method: 'Net Banking',
      status: 'failed',
      customerName: 'Anjali Singh',
      customerEmail: 'anjali@email.com',
      date: '2025-11-21T09:45:00',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalSuccessful = payments.filter(p => p.status === 'success').length;
  const totalFailed = payments.filter(p => p.status === 'failed').length;
  const totalAmount = payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div>
      <h2 className="text-3xl mb-6">Payment Management</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600">Total Revenue</h3>
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl">₹{totalAmount.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-2">From successful payments</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600">Successful</h3>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl">{totalSuccessful}</p>
          <p className="text-sm text-gray-600 mt-2">Completed payments</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600">Failed</h3>
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-3xl">{totalFailed}</p>
          <p className="text-sm text-gray-600 mt-2">Failed transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, payment ID, name, or email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          <button className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Payment ID</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Method</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Amount</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <span className="text-sm font-mono">{payment.paymentId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{payment.orderId}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p>{payment.customerName}</p>
                        <p className="text-sm text-gray-600">{payment.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(payment.date).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={payment.status === 'success' ? 'text-green-600' : 'text-gray-600'}>
                        ₹{payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Gateway Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Payment Gateway Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">Gateway Provider</p>
            <p>Razorpay (Demo Mode)</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Transaction Fee</p>
            <p>2% + ₹3 per transaction</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Settlement Time</p>
            <p>T+1 Business Days</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Supported Methods</p>
            <p>UPI, Cards, Net Banking, Wallets</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-300">
          <p className="text-xs text-blue-800">
            ⚠️ This is a prototype. For production, configure actual Razorpay API keys and enable live mode.
          </p>
        </div>
      </div>
    </div>
  );
}
