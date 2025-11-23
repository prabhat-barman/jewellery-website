import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Sparkles, Shield, Truck } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type HomeProps = {
  onViewProduct: (productId: string) => void;
  onViewCategory: (category: string) => void;
};

export function Home({ onViewProduct, onViewCategory }: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      title: 'Exclusive Diwali Collection',
      subtitle: 'Up to 30% Off on Gold & Diamond Jewellery',
      bgColor: 'from-amber-500 to-amber-700',
    },
    {
      title: 'New Arrival - Bridal Collection',
      subtitle: 'Crafted to Perfection for Your Special Day',
      bgColor: 'from-rose-500 to-rose-700',
    },
    {
      title: 'Premium Silver Collection',
      subtitle: 'Elegant Designs at Unbeatable Prices',
      bgColor: 'from-gray-400 to-gray-600',
    },
  ];

  const categories = [
    { name: 'Rings', icon: '💍', count: '250+ Designs' },
    { name: 'Earrings', icon: '✨', count: '180+ Designs' },
    { name: 'Necklaces', icon: '📿', count: '150+ Designs' },
    { name: 'Bangles', icon: '⭕', count: '200+ Designs' },
    { name: 'Bracelets', icon: '🔗', count: '120+ Designs' },
    { name: 'Pendants', icon: '💎', count: '90+ Designs' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'BIS Hallmarked',
      description: 'Certified purity guaranteed',
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders above ₹5000',
    },
    {
      icon: Sparkles,
      title: 'Premium Quality',
      description: 'Handcrafted with care',
    },
    {
      icon: Star,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <div className="relative h-[500px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-r ${banner.bgColor} flex items-center justify-center`}>
              <div className="text-center text-white px-4">
                <h1 className="text-5xl md:text-6xl mb-4">{banner.title}</h1>
                <p className="text-xl md:text-2xl mb-8">{banner.subtitle}</p>
                <button
                  onClick={() => onViewCategory('all')}
                  className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <feature.icon className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Shop by Category</h2>
            <p className="text-gray-600">Discover our exquisite collection of fine jewellery</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => onViewCategory(category.name)}
                className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-xl hover:shadow-lg transition-shadow group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Featured Collection</h2>
          <p className="text-gray-600">Handpicked designs just for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group cursor-pointer"
              onClick={() => onViewProduct(`featured-${item}`)}
            >
              <div className="relative aspect-square bg-gradient-to-br from-amber-100 to-amber-200">
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  {item === 1 ? '💍' : item === 2 ? '📿' : item === 3 ? '✨' : '💎'}
                </div>
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  -20%
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-2 group-hover:text-amber-600 transition-colors">
                  Premium {item === 1 ? 'Gold Ring' : item === 2 ? 'Necklace' : item === 3 ? 'Earrings' : 'Pendant'}
                </h3>
                <p className="text-sm text-gray-600 mb-3">22K Gold | 5.2g</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl text-amber-600">₹{(25000 + item * 5000).toLocaleString()}</span>
                    <span className="text-sm text-gray-400 line-through ml-2">
                      ₹{(30000 + item * 5000).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onViewCategory('all')}
            className="bg-amber-600 text-white px-8 py-3 rounded-full hover:bg-amber-700 transition-colors"
          >
            View All Products
          </button>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">Trusted by thousands of happy customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                rating: 5,
                text: 'Absolutely stunning jewellery! The quality is exceptional and the designs are so elegant. Highly recommended!',
              },
              {
                name: 'Rahul Patel',
                rating: 5,
                text: 'Bought a necklace for my wife and she loved it! Great service and fast delivery. Will definitely shop again.',
              },
              {
                name: 'Anjali Singh',
                rating: 5,
                text: 'The bridal collection is breathtaking. I found my perfect wedding jewellery here. Thank you Jewel Palace!',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.text}</p>
                <p className="text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
