import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, Search, Crown } from 'lucide-react';
import type { User as UserType } from '../App';

type HeaderProps = {
  user: UserType | null;
  cartCount: number;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

export function Header({ user, cartCount, onNavigate, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Rings', 'Earrings', 'Necklaces', 'Bangles', 'Bracelets', 'Pendants'];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-amber-600 text-white py-2 px-4 text-center">
        <p className="text-sm">Free Shipping on Orders Above ₹5000 | Exclusive Diwali Offers!</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Crown className="w-8 h-8 text-amber-600" />
            <span className="text-2xl text-amber-900">Jewel Palace</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onNavigate('products')}
                className="text-gray-700 hover:text-amber-600 transition-colors"
              >
                {category}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Search jewellery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-48"
              />
              <Search className="w-4 h-4 text-gray-500" />
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-700 hover:text-amber-600">
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {user.isAdmin ? (
                    <>
                      <button
                        onClick={() => onNavigate('admin')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </button>
                      <button
                        onClick={() => onNavigate('home')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        View Store
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onNavigate('dashboard')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => onNavigate('dashboard')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        My Orders
                      </button>
                    </>
                  )}
                  <hr className="my-2" />
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 text-gray-700 hover:text-amber-600"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">Login</span>
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative flex items-center gap-2 text-gray-700 hover:text-amber-600"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {/* Mobile Search */}
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Search jewellery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm flex-1"
                />
                <Search className="w-4 h-4 text-gray-500" />
              </div>

              {/* Mobile Categories */}
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onNavigate('products');
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-amber-600 transition-colors py-2"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
