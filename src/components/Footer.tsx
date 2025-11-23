import React from 'react';
import { Crown, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

type FooterProps = {
  onNavigate: (page: string) => void;
};

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-amber-500" />
              <span className="text-xl text-white">Jewel Palace</span>
            </div>
            <p className="text-sm mb-4">
              Your trusted destination for premium jewellery. Crafted with love, designed for elegance.
            </p>
            <div className="flex gap-4">
              <button className="hover:text-amber-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="hover:text-amber-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="hover:text-amber-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-500 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-amber-500 transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button className="hover:text-amber-500 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button className="hover:text-amber-500 transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="hover:text-amber-500 transition-colors">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button className="hover:text-amber-500 transition-colors">
                  Returns & Exchange
                </button>
              </li>
              <li>
                <button className="hover:text-amber-500 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="hover:text-amber-500 transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Jewellery Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@jewelpalace.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2025 Jewel Palace. All rights reserved.</p>
            <p>Secured Payment Gateway | 100% Safe & Secure</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
