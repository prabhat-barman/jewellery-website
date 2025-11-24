import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Contact() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-amber-900">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-lg mb-8">
            We'd love to hear from you. Whether you have a question about our collections, 
            need assistance with an order, or just want to say hello, our team is here to help.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Visit Our Store</h3>
                <p className="text-gray-600">123 Jewellery Street, Bandra West</p>
                <p className="text-gray-600">Mumbai, Maharashtra 400050</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Phone className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Call Us</h3>
                <p className="text-gray-600">+91 98765 43210</p>
                <p className="text-sm text-gray-500">Mon - Sat: 10:00 AM - 8:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Email Us</h3>
                <p className="text-gray-600">support@jewelpalace.com</p>
                <p className="text-gray-600">sales@jewelpalace.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea className="w-full border border-gray-300 rounded-md p-2 h-32 focus:ring-amber-500 focus:border-amber-500" placeholder="Write your message here..."></textarea>
            </div>
            <button className="w-full bg-amber-600 text-white py-3 rounded-md hover:bg-amber-700 transition-colors font-semibold">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
