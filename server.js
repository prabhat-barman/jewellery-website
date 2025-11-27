const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const PORT = Number(process.env.PORT || 3006);
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const seedProducts = [
  { id: 'prod_demo_1', name: 'Royal Gold Diamond Ring', category: 'Rings', price: 45000, discount: 15, weight: '5.2g', material: 'Gold', size: 'Adjustable', description: 'Exquisite 22K gold ring with precious diamonds. Perfect for special occasions.', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000', rating: 4.8, stock: 12, enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'prod_demo_2', name: 'Elegant Pearl Necklace', category: 'Necklaces', price: 32000, discount: 20, weight: '8.5g', material: 'Gold', size: 'Standard', description: 'Beautiful gold necklace adorned with natural pearls. A timeless classic.', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=1000', rating: 4.7, stock: 8, enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'prod_demo_3', name: 'Diamond Stud Earrings', category: 'Earrings', price: 28000, discount: 10, weight: '3.2g', material: 'Diamond', size: 'Small', description: 'Sparkling diamond earrings that add elegance to any outfit.', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000', rating: 4.9, stock: 15, enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'prod_demo_4', name: 'Traditional Gold Bangles Set', category: 'Bangles', price: 55000, discount: 25, weight: '12.5g', material: 'Gold', size: '2.4', description: 'Set of 4 traditional 22K gold bangles with intricate designs.', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1000', rating: 4.6, stock: 5, enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(seedProducts, null, 2));
  if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}
function readJson(file) { try { return JSON.parse(fs.readFileSync(file, 'utf-8')); } catch { return []; } }
function writeJson(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }

const useDb = !!process.env.DATABASE_URL;
const pool = useDb ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;

async function initDb() {
  if (!useDb) return;
  await pool.query(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    category TEXT,
    price INTEGER,
    discount INTEGER,
    weight TEXT,
    material TEXT,
    size TEXT,
    description TEXT,
    image TEXT,
    rating REAL,
    stock INTEGER,
    enabled BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    items JSONB,
    address JSONB,
    subtotal INTEGER,
    shipping INTEGER,
    tax INTEGER,
    total INTEGER,
    payment_method TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    is_admin BOOLEAN,
    created_at TIMESTAMPTZ
  )`);
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM products');
  if (rows[0].count === 0) {
    for (const p of seedProducts) {
      await pool.query(
        'INSERT INTO products (id,name,category,price,discount,weight,material,size,description,image,rating,stock,enabled,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)',
        [p.id,p.name,p.category,p.price,p.discount,p.weight,p.material,p.size,p.description,p.image,p.rating,p.stock,p.enabled,p.createdAt,p.updatedAt]
      );
    }
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/make-server-ff9d2bf9/products', async (req, res) => {
  if (useDb) {
    const { rows } = await pool.query('SELECT id,name,category,price,discount,weight,material,size,description,image,rating,stock,enabled,created_at AS "createdAt",updated_at AS "updatedAt" FROM products ORDER BY created_at DESC');
    return res.json({ products: rows });
  }
  return res.json({ products: readJson(PRODUCTS_FILE) });
});

app.get('/make-server-ff9d2bf9/products/:id', async (req, res) => {
  const id = req.params.id;
  if (useDb) {
    const { rows } = await pool.query('SELECT id,name,category,price,discount,weight,material,size,description,image,rating,stock,enabled,created_at AS "createdAt",updated_at AS "updatedAt" FROM products WHERE id=$1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    return res.json({ product: rows[0] });
  }
  const product = readJson(PRODUCTS_FILE).find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json({ product });
});

app.post('/make-server-ff9d2bf9/admin/products', async (req, res) => {
  const now = new Date().toISOString();
  const product = { id: `prod_${Date.now()}`, ...req.body, createdAt: now, updatedAt: now };
  if (useDb) {
    await pool.query(
      'INSERT INTO products (id,name,category,price,discount,weight,material,size,description,image,rating,stock,enabled,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)',
      [product.id,product.name,product.category,product.price,product.discount,product.weight,product.material,product.size,product.description,product.image,product.rating,product.stock,product.enabled,product.createdAt,product.updatedAt]
    );
    return res.json({ product, message: 'Product created successfully' });
  }
  const products = readJson(PRODUCTS_FILE);
  products.push(product);
  writeJson(PRODUCTS_FILE, products);
  return res.json({ product, message: 'Product created successfully' });
});

app.put('/make-server-ff9d2bf9/admin/products/:id', async (req, res) => {
  const id = req.params.id;
  const updates = { ...req.body, updatedAt: new Date().toISOString() };
  if (useDb) {
    await pool.query('UPDATE products SET name=$1,category=$2,price=$3,discount=$4,weight=$5,material=$6,size=$7,description=$8,image=$9,rating=$10,stock=$11,enabled=$12,updated_at=$13 WHERE id=$14', [updates.name,updates.category,updates.price,updates.discount,updates.weight,updates.material,updates.size,updates.description,updates.image,updates.rating,updates.stock,updates.enabled,updates.updatedAt,id]);
    const { rows } = await pool.query('SELECT id,name,category,price,discount,weight,material,size,description,image,rating,stock,enabled,created_at AS "createdAt",updated_at AS "updatedAt" FROM products WHERE id=$1', [id]);
    return res.json({ product: rows[0], message: 'Product updated successfully' });
  }
  const products = readJson(PRODUCTS_FILE);
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...updates };
    writeJson(PRODUCTS_FILE, products);
  }
  return res.json({ product: products.find(p => p.id === id) || null, message: 'Product updated successfully' });
});

app.delete('/make-server-ff9d2bf9/admin/products/:id', async (req, res) => {
  const id = req.params.id;
  if (useDb) {
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    return res.json({ message: 'Product deleted successfully' });
  }
  const products = readJson(PRODUCTS_FILE).filter(p => p.id !== id);
  writeJson(PRODUCTS_FILE, products);
  return res.json({ message: 'Product deleted successfully' });
});

app.post('/make-server-ff9d2bf9/orders/create', async (req, res) => {
  const now = new Date().toISOString();
  const order = { id: `ORD${Date.now()}`, ...req.body, status: 'Pending', createdAt: now, updatedAt: now };
  if (useDb) {
    await pool.query('INSERT INTO orders (id,items,address,subtotal,shipping,tax,total,payment_method,status,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [order.id, JSON.stringify(order.items || []), JSON.stringify(order.address || {}), order.subtotal, order.shipping, order.tax, order.total, order.paymentMethod, order.status, order.createdAt, order.updatedAt]);
    return res.json({ orderId: order.id, order, message: 'Order created successfully' });
  }
  const orders = readJson(ORDERS_FILE);
  orders.push(order);
  writeJson(ORDERS_FILE, orders);
  return res.json({ orderId: order.id, order, message: 'Order created successfully' });
});

app.post('/make-server-ff9d2bf9/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  const isAdmin = (email && typeof email === 'string' && email.toLowerCase().includes('admin')) || false;
  const user = { id: `user_${Date.now()}`, email, password, name, isAdmin, created_at: new Date().toISOString() };
  if (useDb) {
    await pool.query('INSERT INTO users (id,email,password,name,is_admin,created_at) VALUES ($1,$2,$3,$4,$5,$6)', [user.id, user.email, user.password, user.name, user.isAdmin, user.created_at]);
  } else {
    const users = readJson(USERS_FILE);
    users.push(user);
    writeJson(USERS_FILE, users);
  }
  return res.json({ user: { id: user.id, email: user.email, password: user.password, user_metadata: { name: user.name, isAdmin: user.isAdmin }, created_at: user.created_at }, session: { access_token: 'mock_access_token_' + user.id } });
});

app.post('/auth/v1/token', async (req, res) => {
  const { email, password } = req.body;
  let userRow = null;
  if (useDb) {
    const { rows } = await pool.query('SELECT id,email,password,name,is_admin,created_at FROM users WHERE email=$1', [email]);
    if (rows.length) userRow = rows[0];
  } else {
    const users = readJson(USERS_FILE);
    userRow = users.find(u => u.email === email);
  }
  const isAdmin = userRow ? !!(userRow.is_admin || userRow.isAdmin) : false;
  const name = userRow ? (userRow.name || 'Mock User') : 'Mock User';
  return res.json({ access_token: 'mock_access_token', token_type: 'bearer', expires_in: 3600, refresh_token: 'mock_refresh_token', user: { id: userRow ? userRow.id : 'mock_user_id', aud: 'authenticated', role: 'authenticated', email, email_confirmed_at: new Date().toISOString(), user_metadata: { name, isAdmin }, app_metadata: { provider: 'email' }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } });
});

app.get('/auth/v1/user', async (req, res) => {
  return res.json({ id: 'mock_user_id', aud: 'authenticated', role: 'authenticated', email: 'user@example.com', user_metadata: { name: 'Mock User', isAdmin: false }, app_metadata: { provider: 'email' } });
});

app.post('/make-server-ff9d2bf9/seed-demo-data', async (req, res) => {
  if (useDb) {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM products');
    return res.json({ message: 'Demo data seeded successfully', productsCreated: rows[0].count });
  }
  const count = readJson(PRODUCTS_FILE).length;
  return res.json({ message: 'Demo data seeded successfully', productsCreated: count });
});

async function start() {
  ensureDataDir();
  if (useDb) await initDb();
  app.listen(PORT, () => { process.stdout.write(`Express server running on http://localhost:${PORT}\n`); });
}

start();
