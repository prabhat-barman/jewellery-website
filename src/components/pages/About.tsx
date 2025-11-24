import React from 'react';

export function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-amber-900">About Jewel Palace</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Welcome to Jewel Palace, where tradition meets elegance. Established in 1995, we have been 
          crafting exquisite jewellery pieces that celebrate the beauty of life's special moments.
        </p>
        <p className="mb-4">
          Our collection features a stunning array of gold, diamond, and platinum jewellery, 
          each piece meticulously designed and handcrafted by our expert artisans. We believe 
          that jewellery is not just an accessory, but a reflection of your unique personality and style.
        </p>
        <div className="grid md:grid-cols-3 gap-8 my-12">
          <div className="bg-amber-50 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2 text-amber-800">Certified Authenticity</h3>
            <p>All our diamonds and gold jewellery come with hallmark certification.</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2 text-amber-800">Handcrafted Perfection</h3>
            <p>Each piece is crafted with precision and care by master craftsmen.</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2 text-amber-800">Lifetime Warranty</h3>
            <p>We stand by the quality of our jewellery with a lifetime maintenance warranty.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
