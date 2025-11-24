import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase clients
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

// Register new user
app.post('/make-server-ff9d2bf9/auth/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, isAdmin: false },
      email_confirm: true, // Auto-confirm email since email server hasn't been configured
    });

    if (error) {
      console.log('User registration error:', error.message);
      return c.json({ error: error.message }, 400);
    }

    // Sign in the user to get session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.log('Auto sign-in error after registration:', signInError.message);
      return c.json({ error: signInError.message }, 400);
    }

    return c.json({
      user: data.user,
      session: signInData.session,
    });
  } catch (error: any) {
    console.log('Registration error:', error.message);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// ============================================================================
// PRODUCT ROUTES (Public)
// ============================================================================

// Get all products
app.get('/make-server-ff9d2bf9/products', async (c:any) => {
  try {
    const products = await kv.getByPrefix('product:');
    return c.json({ products });
  } catch (error: any) {
    console.log('Failed to fetch products:', error.message);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Get single product
app.get('/make-server-ff9d2bf9/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const product = await kv.get(`product:${id}`);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({ product });
  } catch (error: any) {
    console.log('Failed to fetch product:', error.message);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

// ============================================================================
// ADMIN PRODUCT ROUTES (Protected)
// ============================================================================

// Create product
app.post('/make-server-ff9d2bf9/admin/products', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (!user.user_metadata?.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    const productData = await c.req.json();
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const product = {
      id: productId,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`product:${productId}`, product);

    console.log('Product created:', productId);
    return c.json({ product, message: 'Product created successfully' });
  } catch (error: any) {
    console.log('Failed to create product:', error.message);
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

// Update product
app.put('/make-server-ff9d2bf9/admin/products/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (!user.user_metadata?.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    const productId = c.req.param('id');
    const updates = await c.req.json();
    
    const existingProduct = await kv.get(`product:${productId}`);
    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const updatedProduct = {
      ...existingProduct,
      ...updates,
      id: productId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`product:${productId}`, updatedProduct);

    console.log('Product updated:', productId);
    return c.json({ product: updatedProduct, message: 'Product updated successfully' });
  } catch (error: any) {
    console.log('Failed to update product:', error.message);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

// Delete product
app.delete('/make-server-ff9d2bf9/admin/products/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (!user.user_metadata?.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    const productId = c.req.param('id');
    await kv.del(`product:${productId}`);

    console.log('Product deleted:', productId);
    return c.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.log('Failed to delete product:', error.message);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// ============================================================================
// ORDER ROUTES
// ============================================================================

// Create order (Protected - User must be authenticated)
app.post('/make-server-ff9d2bf9/orders/create', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized - Please login to place order' }, 401);
    }

    const orderData = await c.req.json();
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    const order = {
      id: orderId,
      userId: user.id,
      ...orderData,
      status: 'Pending',
      paymentStatus: orderData.paymentMethod === 'razorpay' ? 'Paid' : 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, order);
    
    // TODO: In production, send email notification to admin here
    console.log('New order created:', orderId, 'Customer:', orderData.address?.fullName);
    
    return c.json({ orderId, order, message: 'Order created successfully' });
  } catch (error: any) {
    console.log('Failed to create order:', error.message);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Get user orders (Protected)
app.get('/make-server-ff9d2bf9/orders/user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allOrders = await kv.getByPrefix('order:');
    const userOrders = allOrders.filter(order => order.userId === user.id);
    
    // Sort by creation date, newest first
    userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ orders: userOrders });
  } catch (error: any) {
    console.log('Failed to fetch user orders:', error.message);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// ============================================================================
// ADMIN ORDER ROUTES (Protected)
// ============================================================================

// Get all orders (Admin only)
app.get('/make-server-ff9d2bf9/admin/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (!user.user_metadata?.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    const orders = await kv.getByPrefix('order:');
    
    // Sort by creation date, newest first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ orders });
  } catch (error: any) {
    console.log('Failed to fetch orders:', error.message);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Update order status (Admin only)
app.put('/make-server-ff9d2bf9/admin/orders/:id/status', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (!user.user_metadata?.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    const orderId = c.req.param('id');
    const { status, tracking, courierName } = await c.req.json();
    
    const existingOrder = await kv.get(`order:${orderId}`);
    if (!existingOrder) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const updatedOrder = {
      ...existingOrder,
      status,
      tracking: tracking || existingOrder.tracking,
      courierName: courierName || existingOrder.courierName,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, updatedOrder);

    // TODO: In production, send email notification to customer here
    console.log('Order status updated:', orderId, 'New status:', status);

    return c.json({ order: updatedOrder, message: 'Order updated successfully' });
  } catch (error: any) {
    console.log('Failed to update order:', error.message);
    return c.json({ error: 'Failed to update order' }, 500);
  }
});

// ============================================================================
// SEED DATA (For demo purposes)
// ============================================================================

app.post('/make-server-ff9d2bf9/seed-demo-data', async (c) => {
  try {
    // Create demo products
    const demoProducts = [
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
        image: '',
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
        image: '',
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
        image: '',
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
        image: '',
        rating: 4.6,
        stock: 5,
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const product of demoProducts) {
      await kv.set(`product:${product.id}`, product);
    }

    // Create demo admin user
    const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@jewelpalace.com',
      password: 'admin123',
      user_metadata: { name: 'Admin User', isAdmin: true },
      email_confirm: true,
    });

    if (adminError && !adminError.message.includes('already registered')) {
      console.log('Admin user creation error:', adminError.message);
    }

    // Create demo regular user
    const { data: regularUser, error: userError } = await supabase.auth.admin.createUser({
      email: 'user@jewelpalace.com',
      password: 'user123',
      user_metadata: { name: 'Demo User', isAdmin: false },
      email_confirm: true,
    });

    if (userError && !userError.message.includes('already registered')) {
      console.log('Regular user creation error:', userError.message);
    }

    console.log('Demo data seeded successfully');
    return c.json({ 
      message: 'Demo data seeded successfully',
      productsCreated: demoProducts.length,
      adminEmail: 'admin@jewelpalace.com',
      userEmail: 'user@jewelpalace.com',
    });
  } catch (error: any) {
    console.log('Failed to seed demo data:', error.message);
    return c.json({ error: 'Failed to seed demo data' }, 500);
  }
});

// Health check
app.get('/make-server-ff9d2bf9/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
