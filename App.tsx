import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './contexts/StoreContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';

// Scroll Handler: Handles both "Scroll to Top" on route change 
// AND "Scroll to Section" if a hash (#) is present.
function ScrollHandler() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    // If there is a hash (e.g. #boutique), scroll to that element
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // setTimeout ensures the DOM is fully rendered if we just navigated from another page
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      // If no hash, just scroll to top (standard page navigation)
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <LanguageProvider>
          <Router>
            <ScrollHandler />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Layout>
          </Router>
        </LanguageProvider>
      </CartProvider>
    </StoreProvider>
  );
}