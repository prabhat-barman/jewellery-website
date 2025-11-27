
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';

const app = new Hono();

app.use('*', cors());
app.use('*', logger());

// In-memory store
const db = {
  products: [],
  orders: [],
  users: []
};

// Seed data
const seedData = [
  {
    id: 'prod_demo_1',
    name: 'Royal Gold Diamond Ring',
    category: 'Rings',
    price: 45000,
    discount: 15,
    weight: '5.2g',
    material: 'Gold',
    size: 'Adjustable',
    description: 'Exquisite 22K gold ring with precious diamonds. Perfect for special occasions.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000',
    rating: 4.8,
    stock: 12,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_demo_2',
    name: 'Elegant Pearl Necklace',
    category: 'Necklaces',
    price: 32000,
    discount: 20,
    weight: '8.5g',
    material: 'Gold',
    size: 'Standard',
    description: 'Beautiful gold necklace adorned with natural pearls. A timeless classic.',
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=1000',
    rating: 4.7,
    stock: 8,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_demo_3',
    name: 'Diamond Stud Earrings',
    category: 'Earrings',
    price: 28000,
    discount: 10,
    weight: '3.2g',
    material: 'Diamond',
    size: 'Small',
    description: 'Sparkling diamond earrings that add elegance to any outfit.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000',
    rating: 4.9,
    stock: 15,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_demo_4',
    name: 'Traditional Gold Bangles Set',
    category: 'Bangles',
    price: 55000,
    discount: 25,
    weight: '12.5g',
    material: 'Gold',
    size: '2.4',
    description: 'Set of 4 traditional 22K gold bangles with intricate designs.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1000',
    rating: 4.6,
    stock: 5,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Routes
app.get('/make-server-ff9d2bf9/products', (c) => {
  if (db.products.length === 0) {
      db.products = [...seedData];
  }
  return c.json({ products: db.products });
});

app.get('/make-server-ff9d2bf9/products/:id', (c) => {
  const id = c.req.param('id');
  const product = db.products.find(p => p.id === id);
  if (!product) return c.json({ error: 'Product not found' }, 404);
  return c.json({ product });
});

app.post('/make-server-ff9d2bf9/seed-demo-data', (c) => {
  db.products = [...seedData];
  return c.json({ message: 'Demo data seeded successfully', productsCreated: seedData.length });
});

// Mock Auth endpoints (minimal)
app.post('/auth/v1/token', async (c) => {
    // Mock login
    return c.json({
        access_token: "mock_access_token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "mock_refresh_token",
        user: {
            id: "mock_user_id",
            aud: "authenticated",
            role: "authenticated",
            email: "user@example.com",
            email_confirmed_at: new Date().toISOString(),
            user_metadata: { name: "Mock User" },
            app_metadata: { provider: "email" },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
    });
});

app.get('/auth/v1/user', (c) => {
    return c.json({
        id: "mock_user_id",
        aud: "authenticated",
        role: "authenticated",
        email: "user@example.com",
        user_metadata: { name: "Mock User" },
        app_metadata: { provider: "email" },
    });
});


Deno.serve({ port: 3005 }, app.fetch);
