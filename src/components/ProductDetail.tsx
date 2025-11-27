import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, Truck, Shield, RotateCcw } from 'lucide-react';
import { publicAnonKey, functionsBase } from '../utils/supabase/info';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${functionsBase}/make-server-ff9d2bf9/products/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const finalPrice = product.price - (product.price * product.discount / 100);

    addToCart({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      discount: product.discount,
      quantity,
      image: product.image,
      weight: product.weight,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/products')}
            className="text-amber-600 hover:text-amber-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const finalPrice = product.price - (product.price * product.discount / 100);
  const images = [product.image, product.image, product.image]; // Mock multiple images

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl aspect-square flex items-center justify-center mb-4">
            <div className="text-9xl">
              {product.category === 'Rings' ? '💍' :
                product.category === 'Earrings' ? '✨' :
                  product.category === 'Necklaces' ? '📿' :
                    product.category === 'Bangles' ? '⭕' :
                      product.category === 'Bracelets' ? '🔗' : '💎'}
            </div>
            {product.discount > 0 && (
              <div className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-full">
                -{product.discount}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg aspect-square ${selectedImage === index ? 'ring-2 ring-amber-600' : ''
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                      }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">({product.rating} / 5)</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl text-amber-600">₹{finalPrice.toLocaleString()}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Save ₹{(product.price - finalPrice).toLocaleString()}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600">Inclusive of all taxes</p>
          </div>

          {/* Specifications */}
          <div className="bg-amber-50 p-6 rounded-xl mb-6">
            <h3 className="mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Material</p>
                <p>{product.material}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p>{product.weight}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Size</p>
                <p>{product.size}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p>{product.category}</p>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-xl w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-amber-600 text-white py-4 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button className="w-14 h-14 border-2 border-gray-300 rounded-xl hover:bg-gray-100 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </button>
            <button className="w-14 h-14 border-2 border-gray-300 rounded-xl hover:bg-gray-100 flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-5 h-5 text-green-600" />
              <span>Free shipping on orders above ₹5000</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>BIS Hallmarked & Certified</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span>30-day easy returns</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h3 className="mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description || `This exquisite ${product.name} is crafted with precision and care. Made from premium ${product.material}, it features elegant design that complements any occasion. Perfect for gifting or adding to your personal collection.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
