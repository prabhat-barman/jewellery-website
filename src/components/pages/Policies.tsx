import React from 'react';

export function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-amber-900">Privacy Policy</h1>
      <div className="space-y-6 text-gray-700">
        <p>Last updated: November 24, 2025</p>
        
        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, make a purchase, sign up for our newsletter, or communicate with us. This may include your name, email address, phone number, shipping address, and payment information.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">2. How We Use Your Information</h2>
          <p>We use the information we collect to process your orders, communicate with you, prevent fraud, and improve our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">3. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing and against accidental loss, destruction, or damage.</p>
        </section>
      </div>
    </div>
  );
}

export function Terms() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-amber-900">Terms and Conditions</h1>
      <div className="space-y-6 text-gray-700">
        <p>Welcome to Jewel Palace. By accessing this website, you agree to these terms and conditions.</p>
        
        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">1. Use of the Site</h2>
          <p>You may use our site for lawful purposes only. You must not use our site in any way that breaches any applicable local, national, or international law or regulation.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">2. Product Information</h2>
          <p>We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">3. Pricing</h2>
          <p>All prices are subject to change without notice. We reserve the right to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
        </section>
      </div>
    </div>
  );
}

export function Returns() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-amber-900">Returns & Exchange Policy</h1>
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">30-Day Return Policy</h2>
          <p>We offer a 30-day return policy for all our products. If you are not completely satisfied with your purchase, you may return it within 30 days of receipt for a full refund or exchange.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Condition of Returned Items</h2>
          <p>To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging with all certificates and tags intact.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Process</h2>
          <p>To initiate a return, please contact our customer support team. We will provide you with a return shipping label and instructions on how and where to send your package.</p>
        </section>
      </div>
    </div>
  );
}

export function Shipping() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-amber-900">Shipping Policy</h1>
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Domestic Shipping</h2>
          <p>We provide free insured shipping on all orders above ₹5000 within India. For orders below ₹5000, a nominal shipping fee of ₹150 applies.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Delivery Timelines</h2>
          <p>Standard delivery takes 3-5 business days for metro cities and 5-7 business days for other locations. Made-to-order items may take 10-15 business days.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Insurance</h2>
          <p>All our shipments are fully insured until they reach your doorstep. We require a signature upon delivery for security purposes.</p>
        </section>
      </div>
    </div>
  );
}
