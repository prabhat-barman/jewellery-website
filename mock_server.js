const http = require('http');
const { MongoClient } = require('mongodb');

const PORT = 3005;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB || 'jewelpalace';

let client, db, productsCol, ordersCol, usersCol;

const seedProducts = [
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

const mem = {
    products: seedProducts.map(p => ({ ...p })),
    orders: [],
    users: []
};

async function initMongo() {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    productsCol = db.collection('products');
    ordersCol = db.collection('orders');
    usersCol = db.collection('users');
    await productsCol.createIndex({ id: 1 }, { unique: true });
    await ordersCol.createIndex({ id: 1 }, { unique: true });
    await usersCol.createIndex({ id: 1 }, { unique: true });
    const count = await productsCol.countDocuments();
    if (count === 0) {
        await productsCol.insertMany(seedProducts.map(p => ({ ...p, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })));
    }
}

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    console.log(`${req.method} ${req.url}`);

    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        (async () => {

        // Parse body if present
        let data = {};
        try {
            if (body) data = JSON.parse(body);
        } catch (e) {
            console.error("Failed to parse body", e);
        }

        // --- PRODUCT ROUTES ---

        if (req.url === '/make-server-ff9d2bf9/products' && req.method === 'GET') {
            const products = productsCol ? await productsCol.find({}).toArray() : mem.products;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ products }));
            return;
        }

        if (req.url.startsWith('/make-server-ff9d2bf9/products/') && req.method === 'GET') {
            const id = req.url.split('/').pop();
            const product = productsCol ? await productsCol.findOne({ id }) : mem.products.find(p => p.id === id);
            if (product) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ product }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Product not found' }));
            }
            return;
        }

        // Create Product (Admin)
        if (req.url === '/make-server-ff9d2bf9/admin/products' && req.method === 'POST') {
            const newProduct = {
                id: `prod_${Date.now()}`,
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            if (productsCol) {
                await productsCol.insertOne(newProduct);
            } else {
                mem.products.push(newProduct);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ product: newProduct, message: 'Product created successfully' }));
            return;
        }

        // Update Product (Admin)
        if (req.url.startsWith('/make-server-ff9d2bf9/admin/products/') && req.method === 'PUT') {
            const id = req.url.split('/').pop();
            const updates = { ...data, updatedAt: new Date().toISOString() };
            if (productsCol) {
                await productsCol.updateOne({ id }, { $set: updates });
            } else {
                const idx = mem.products.findIndex(p => p.id === id);
                if (idx !== -1) mem.products[idx] = { ...mem.products[idx], ...updates };
            }
            const product = productsCol ? await productsCol.findOne({ id }) : mem.products.find(p => p.id === id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ product, message: 'Product updated successfully' }));
            return;
        }

        // Delete Product (Admin)
        if (req.url.startsWith('/make-server-ff9d2bf9/admin/products/') && req.method === 'DELETE') {
            const id = req.url.split('/').pop();
            if (productsCol) {
                await productsCol.deleteOne({ id });
            } else {
                mem.products = mem.products.filter(p => p.id !== id);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Product deleted successfully' }));
            return;
        }

        // --- ORDER ROUTES ---

        if (req.url === '/make-server-ff9d2bf9/orders/create' && req.method === 'POST') {
            const newOrder = {
                id: `ORD${Date.now()}`,
                ...data,
                status: 'Pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            if (ordersCol) {
                await ordersCol.insertOne(newOrder);
            } else {
                mem.orders.push(newOrder);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ orderId: newOrder.id, order: newOrder, message: 'Order created successfully' }));
            return;
        }

        // --- AUTH ROUTES ---

        // Register
        if (req.url === '/make-server-ff9d2bf9/auth/register' && req.method === 'POST') {
            const { email, password, name } = data;
            const newUser = {
                id: `user_${Date.now()}`,
                email,
                password, // In real app, hash this!
                user_metadata: { name, isAdmin: false },
                created_at: new Date().toISOString()
            };
            if (usersCol) {
                await usersCol.insertOne(newUser);
            } else {
                mem.users.push(newUser);
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                user: newUser,
                session: { access_token: "mock_access_token_" + newUser.id }
            }));
            return;
        }

        // Login (Mock)
        if (req.url === '/auth/v1/token' && req.method === 'POST') {
            // Check if user exists in our mock db (optional, or just allow any login for ease)
            // For "admin" testing, let's say if email contains "admin", they are admin.

            // We can't easily parse the body for email in the standard Supabase client call structure 
            // without parsing the specific grant_type=password body which is form-encoded usually.
            // But for this mock, let's just return a generic success, OR if we want to simulate admin...

            // Actually, the Supabase client sends JSON body for signInWithPassword? 
            // Let's assume generic success for now.
            // To test admin, we can rely on the user manually setting the user state or 
            // we can return a specific user if the request body hints at it.

            // Let's just return a user. If the email was "admin@example.com", we make them admin.
            let isAdmin = false;
            let name = "Mock User";
            let email = "user@example.com";

            if (data.email && data.email.includes('admin')) {
                isAdmin = true;
                name = "Admin User";
                email = data.email;
            } else if (data.email) {
                email = data.email;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                access_token: "mock_access_token",
                token_type: "bearer",
                expires_in: 3600,
                refresh_token: "mock_refresh_token",
                user: {
                    id: "mock_user_id",
                    aud: "authenticated",
                    role: "authenticated",
                    email: email,
                    email_confirmed_at: new Date().toISOString(),
                    user_metadata: { name: name, isAdmin: isAdmin },
                    app_metadata: { provider: "email" },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }
            }));
            return;
        }

        // Get User
        if (req.url === '/auth/v1/user' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                id: "mock_user_id",
                aud: "authenticated",
                role: "authenticated",
                email: "user@example.com",
                user_metadata: { name: "Mock User", isAdmin: false }, // Default to non-admin
                app_metadata: { provider: "email" },
            }));
            return;
        }

        if (req.url === '/make-server-ff9d2bf9/seed-demo-data' && req.method === 'POST') {
            const count = productsCol ? await productsCol.countDocuments() : mem.products.length;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Demo data seeded successfully', productsCreated: count }));
            return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
        })().catch(err => {
            console.error('Request handling error', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        });
    });
});

initMongo().then(() => {
    server.listen(PORT, () => {
        console.log(`Mock server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize MongoDB', err);
    server.listen(PORT, () => {
        console.log(`Mock server running on http://localhost:${PORT}`);
    });
});
