import React, { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { ProductListing } from './components/ProductListing';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InitializeDemoData } from './components/InitializeDemoData';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  image: string;
  weight: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  accessToken: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: { user: authUser } } = await supabase.auth.getUser(session.access_token);
        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.name || authUser.email!,
            isAdmin: authUser.user_metadata?.isAdmin || false,
            accessToken: session.access_token,
          });
        }
      }
    };
    checkSession();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (userData.isAdmin) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('home');
  };

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.productId === item.productId);
      if (existingItem) {
        return prevCart.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevCart, item];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const viewProduct = (productId: string) => {
    setSelectedProduct(productId);
    setCurrentPage('product-detail');
  };

  const viewCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage('products');
  };

  const goToCheckout = () => {
    if (!user) {
      setCurrentPage('login');
    } else {
      setCurrentPage('checkout');
    }
  };

  const handleOrderComplete = (orderIdValue: string) => {
    setOrderId(orderIdValue);
    clearCart();
    setCurrentPage('order-confirmation');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onViewProduct={viewProduct}
            onViewCategory={viewCategory}
          />
        );
      case 'products':
        return (
          <ProductListing
            category={selectedCategory}
            onViewProduct={viewProduct}
          />
        );
      case 'product-detail':
        return (
          <ProductDetail
            productId={selectedProduct!}
            onAddToCart={addToCart}
            onBack={() => setCurrentPage('products')}
          />
        );
      case 'cart':
        return (
          <Cart
            items={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemove={removeFromCart}
            onCheckout={goToCheckout}
            onContinueShopping={() => setCurrentPage('home')}
          />
        );
      case 'checkout':
        return (
          <Checkout
            cart={cart}
            user={user!}
            onOrderComplete={handleOrderComplete}
            onBack={() => setCurrentPage('cart')}
          />
        );
      case 'login':
        return (
          <Login
            onLogin={handleLogin}
            onRegister={() => setCurrentPage('register')}
          />
        );
      case 'register':
        return (
          <Register
            onRegister={handleLogin}
            onLogin={() => setCurrentPage('login')}
          />
        );
      case 'dashboard':
        return (
          <UserDashboard
            user={user!}
            onViewOrder={(id) => console.log('View order', id)}
          />
        );
      case 'admin':
        return <AdminDashboard user={user!} />;
      case 'order-confirmation':
        return (
          <OrderConfirmation
            orderId={orderId!}
            onContinueShopping={() => setCurrentPage('home')}
          />
        );
      default:
        return <Home onViewProduct={viewProduct} onViewCategory={viewCategory} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <InitializeDemoData />
      <Header
        user={user}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}