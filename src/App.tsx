import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
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
import { InitializeDemoData } from './components/InitializeDemoData';
import { About } from './components/pages/About';
import { Contact } from './components/pages/Contact';
import { Privacy, Terms, Returns, Shipping } from './components/pages/Policies';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <InitializeDemoData />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<ProductListing />} />
              <Route path="category/:category" element={<ProductListing />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
              
              {/* Static Pages */}
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy-policy" element={<Privacy />} />
              <Route path="terms-conditions" element={<Terms />} />
              <Route path="returns-policy" element={<Returns />} />
              <Route path="shipping-policy" element={<Shipping />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
