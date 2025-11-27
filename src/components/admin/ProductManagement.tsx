import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { publicAnonKey, functionsBase } from '../../utils/supabase/info';
import type { User } from '../../App';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  weight: string;
  material: string;
  size: string;
  description: string;
  image: string;
  rating: number;
  stock: number;
  enabled: boolean;
};

type ProductManagementProps = {
  user: User;
};

export function ProductManagement({ user }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Rings');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [weight, setWeight] = useState('');
  const [material, setMaterial] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [enabled, setEnabled] = useState(true);

  const categories = ['Rings', 'Earrings', 'Necklaces', 'Bangles', 'Bracelets', 'Pendants'];
  const materials = ['Gold', 'Silver', 'Diamond', 'Platinum', 'Artificial'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${functionsBase}/make-server-ff9d2bf9/products`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setErrorMessage('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price.toString());
      setDiscount(product.discount.toString());
      setWeight(product.weight);
      setMaterial(product.material);
      setSize(product.size);
      setDescription(product.description);
      setStock(product.stock.toString());
      setEnabled(product.enabled);
    } else {
      setEditingProduct(null);
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setName('');
    setCategory('Rings');
    setPrice('');
    setDiscount('0');
    setWeight('');
    setMaterial('');
    setSize('');
    setDescription('');
    setStock('');
    setEnabled(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const productData = {
      name,
      category,
      price: parseFloat(price),
      discount: parseFloat(discount),
      weight,
      material,
      size,
      description,
      stock: parseInt(stock),
      enabled,
      rating: 4.5, // Default rating
      image: '', // Would be uploaded separately in a real app
    };

    try {
      const url = editingProduct
        ? `${functionsBase}/make-server-ff9d2bf9/admin/products/${editingProduct.id}`
        : `${functionsBase}/make-server-ff9d2bf9/admin/products`;

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      setSuccessMessage(editingProduct ? 'Product updated successfully' : 'Product created successfully');
      setShowModal(false);
      fetchProducts();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to save product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(
        `${functionsBase}/make-server-ff9d2bf9/admin/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setSuccessMessage('Product deleted successfully');
      fetchProducts();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to delete product');
    }
  };

  const toggleEnabled = async (product: Product) => {
    try {
      const response = await fetch(
        `${functionsBase}/make-server-ff9d2bf9/admin/products/${product.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({ ...product, enabled: !product.enabled }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      fetchProducts();
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update product');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl">Product Management</h2>
        <button
          onClick={() => openModal()}
          className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Product</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Category</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Price</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Discount</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Stock</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p>{product.name}</p>
                        <p className="text-sm text-gray-600">{product.material} | {product.weight}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">₹{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {product.discount > 0 ? (
                        <span className="text-green-600">{product.discount}%</span>
                      ) : (
                        <span className="text-gray-400">No discount</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={product.stock <= 5 ? 'text-red-600' : 'text-green-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleEnabled(product)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                          product.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.enabled ? (
                          <>
                            <Eye className="w-4 h-4" />
                            Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Material *</label>
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select material</option>
                      {materials.map(mat => (
                        <option key={mat} value={mat}>{mat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Discount (%)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Weight</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g., 5.2g"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Size</label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="e.g., Adjustable"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Stock Quantity *</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm text-gray-700 mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Enable product (visible to customers)</span>
                    </label>
                  </div>
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
                    {editingProduct ? 'Update Product' : 'Create Product'}
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
