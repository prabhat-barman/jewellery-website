import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Star, ChevronDown } from 'lucide-react';
import { publicAnonKey, functionsBase } from '../utils/supabase/info';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  weight: string;
  material: string;
  size: string;
  image: string;
  rating: number;
  stock: number;
  enabled: boolean;
};

export function ProductListing() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['Rings', 'Earrings', 'Necklaces', 'Bangles', 'Bracelets', 'Pendants'];
  const materials = ['Gold', 'Silver', 'Diamond', 'Platinum', 'Artificial'];

  useEffect(() => {
    if (category) {
      // Capitalize first letter to match data if needed, or ensure case-insensitive comparison
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      setSelectedCategories([formattedCategory]);
    } else {
      // Reset category filter if not in URL
      setSelectedCategories([]);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, priceRange, selectedMaterials, selectedCategories, sortBy, searchQuery]);

  const fetchProducts = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by enabled status
    filtered = filtered.filter(p => p.enabled);

    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Filter by price
    filtered = filtered.filter(
      p => {
        const finalPrice = p.price - (p.price * p.discount / 100);
        return finalPrice >= priceRange.min && finalPrice <= priceRange.max;
      }
    );

    // Filter by material
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(p =>
        selectedMaterials.some(m => p.material.toLowerCase().includes(m.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = a.price - (a.price * a.discount / 100);
          const priceB = b.price - (b.price * b.discount / 100);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = a.price - (a.price * a.discount / 100);
          const priceB = b.price - (b.price * b.discount / 100);
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.reverse();
        break;
    }

    setFilteredProducts(filtered);
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const toggleCategory = (cat: string) => {
    // If we are on a specific category page, we might want to navigate to that category page
    // or just filter locally. For now, let's filter locally but update URL if needed? 
    // Actually, if user clicks a filter checkbox, it's a local filter.
    // If they are on /category/rings, and click "Necklaces", what happens?
    // Usually category pages only show that category.
    // If we are on /products, we can select multiple.

    if (category) {
      // If on a dedicated page, maybe we should redirect to /products? or just allow filtering
      // Let's allow filtering.
    }

    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  const calculateFinalPrice = (price: number, discount: number) => {
    return price - (price * discount / 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products')}
        </h1>
        <p className="text-gray-600">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
          <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>
              <button
                onClick={() => {
                  setPriceRange({ min: 0, max: 200000 });
                  setSelectedMaterials([]);
                  setSelectedCategories([]);
                }}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                Clear All
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="mb-3">Price Range</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Min: ₹{priceRange.min.toLocaleString()}</label>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Max: ₹{priceRange.max.toLocaleString()}</label>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Material */}
            <div className="mb-6">
              <h3 className="mb-3">Material</h3>
              <div className="space-y-2">
                {materials.map(material => (
                  <label key={material} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material)}
                      onChange={() => toggleMaterial(material)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{material}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <h3 className="mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 text-gray-700"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found matching your filters.</p>
              <button
                onClick={() => {
                  setPriceRange({ min: 0, max: 200000 });
                  setSelectedMaterials([]);
                  setSelectedCategories([]);
                }}
                className="mt-4 text-amber-600 hover:text-amber-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {filteredProducts.map(product => {
                const finalPrice = calculateFinalPrice(product.price, product.discount);

                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer ${viewMode === 'list' ? 'flex gap-4' : ''
                      }`}
                  >
                    <div className={`relative bg-gradient-to-br from-amber-100 to-amber-200 ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'
                      }`}>
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        {product.category === 'Rings' ? '💍' :
                          product.category === 'Earrings' ? '✨' :
                            product.category === 'Necklaces' ? '📿' :
                              product.category === 'Bangles' ? '⭕' :
                                product.category === 'Bracelets' ? '🔗' : '💎'}
                      </div>
                      {product.discount > 0 && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                          -{product.discount}%
                        </div>
                      )}
                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                          Only {product.stock} left
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-4 py-2 rounded-full">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <h3 className="mb-2 hover:text-amber-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{product.material} | {product.weight}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl text-amber-600">₹{finalPrice.toLocaleString()}</span>
                          {product.discount > 0 && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ₹{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
