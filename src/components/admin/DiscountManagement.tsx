import React, { useState } from 'react';
import { Plus, Edit2, Trash2, PercentIcon, CheckCircle } from 'lucide-react';
import type { User } from '../../App';

type Discount = {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrder: number;
  maxDiscount: number;
  expiryDate: string;
  enabled: boolean;
  usageLimit: number;
  usedCount: number;
};

type DiscountManagementProps = {
  user: User;
};

export function DiscountManagement({ user }: DiscountManagementProps) {
  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: '1',
      code: 'DIWALI30',
      type: 'percentage',
      value: 30,
      minOrder: 10000,
      maxDiscount: 5000,
      expiryDate: '2025-12-31',
      enabled: true,
      usageLimit: 100,
      usedCount: 23,
    },
    {
      id: '2',
      code: 'FLAT500',
      type: 'flat',
      value: 500,
      minOrder: 5000,
      maxDiscount: 500,
      expiryDate: '2025-11-30',
      enabled: true,
      usageLimit: 50,
      usedCount: 12,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Form fields
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'flat'>('percentage');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [enabled, setEnabled] = useState(true);

  const openModal = (discount?: Discount) => {
    if (discount) {
      setEditingDiscount(discount);
      setCode(discount.code);
      setType(discount.type);
      setValue(discount.value.toString());
      setMinOrder(discount.minOrder.toString());
      setMaxDiscount(discount.maxDiscount.toString());
      setExpiryDate(discount.expiryDate);
      setUsageLimit(discount.usageLimit.toString());
      setEnabled(discount.enabled);
    } else {
      setEditingDiscount(null);
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setCode('');
    setType('percentage');
    setValue('');
    setMinOrder('');
    setMaxDiscount('');
    setExpiryDate('');
    setUsageLimit('');
    setEnabled(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const discountData: Discount = {
      id: editingDiscount?.id || Date.now().toString(),
      code: code.toUpperCase(),
      type,
      value: parseFloat(value),
      minOrder: parseFloat(minOrder),
      maxDiscount: parseFloat(maxDiscount),
      expiryDate,
      enabled,
      usageLimit: parseInt(usageLimit),
      usedCount: editingDiscount?.usedCount || 0,
    };

    if (editingDiscount) {
      setDiscounts(prev => prev.map(d => d.id === editingDiscount.id ? discountData : d));
      setSuccessMessage('Discount updated successfully');
    } else {
      setDiscounts(prev => [...prev, discountData]);
      setSuccessMessage('Discount created successfully');
    }

    setShowModal(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this discount?')) return;
    setDiscounts(prev => prev.filter(d => d.id !== id));
    setSuccessMessage('Discount deleted successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleEnabled = (id: string) => {
    setDiscounts(prev => prev.map(d => 
      d.id === id ? { ...d, enabled: !d.enabled } : d
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl">Discount Management</h2>
        <button
          onClick={() => openModal()}
          className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Discount
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          💡 Create coupon codes to offer discounts to your customers. You can set percentage or flat discounts with minimum order requirements.
        </p>
      </div>

      {/* Discounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {discounts.map((discount) => (
          <div key={discount.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <PercentIcon className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl">{discount.code}</h3>
                  <p className="text-sm text-gray-600">
                    {discount.type === 'percentage' 
                      ? `${discount.value}% off`
                      : `₹${discount.value} off`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(discount)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(discount.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Min Order</span>
                <span>₹{discount.minOrder.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Discount</span>
                <span>₹{discount.maxDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires On</span>
                <span>{new Date(discount.expiryDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Usage</span>
                <span>{discount.usedCount} / {discount.usageLimit}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className={`px-3 py-1 rounded-full text-sm ${
                discount.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {discount.enabled ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => toggleEnabled(discount.id)}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                {discount.enabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl mb-6">
                {editingDiscount ? 'Edit Discount' : 'Create Discount'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Coupon Code *</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                    placeholder="e.g., SAVE50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Discount Type *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="percentage"
                        checked={type === 'percentage'}
                        onChange={(e) => setType(e.target.value as 'percentage')}
                      />
                      <span>Percentage (%)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="flat"
                        checked={type === 'flat'}
                        onChange={(e) => setType(e.target.value as 'flat')}
                      />
                      <span>Flat (₹)</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} *
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      required
                      min="0"
                      max={type === 'percentage' ? '100' : undefined}
                      step={type === 'percentage' ? '1' : '0.01'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Max Discount (₹) *</label>
                    <input
                      type="number"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Min Order (₹) *</label>
                    <input
                      type="number"
                      value={minOrder}
                      onChange={(e) => setMinOrder(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Usage Limit *</label>
                    <input
                      type="number"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Expiry Date *</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setEnabled(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Enable discount (active immediately)</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700"
                  >
                    {editingDiscount ? 'Update Discount' : 'Create Discount'}
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
