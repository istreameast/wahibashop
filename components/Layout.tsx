import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  Facebook,
  Instagram,
  Search,
  MessageCircle,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { language, setLanguage, t, isRTL, formatNumber } = useLanguage();
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    cartTotal,
    increaseQty,
    decreaseQty,
  } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const showWhatsApp =
    location.pathname === "/" || location.pathname.startsWith("/product/");

  const cartCount = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans ${
        isRTL ? "font-arabic" : ""
      } bg-white text-secondary-900`}
    >
      {/* Top Announcement Bar */}
      <div className="bg-primary-600 text-white text-center py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest px-4">
        {t("topBar")}
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 w-full z-50 bg-white border-b border-stone-100 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center md:justify-start w-full md:w-auto absolute md:relative left-0 right-0 pointer-events-none md:pointer-events-auto">
              <Link
                to="/"
                className="font-serif text-2xl md:text-3xl tracking-wide font-black text-black pointer-events-auto flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-black text-primary-600 rounded-full flex items-center justify-center font-serif italic text-sm">
                  W
                </div>
                WAHIBASHOP
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <Link
                to="/"
                className="hover:text-primary-600 transition-colors uppercase text-xs font-bold tracking-widest"
              >
                {t("home")}
              </Link>
              <Link
                to="/#boutique"
                className="hover:text-primary-600 transition-colors uppercase text-xs font-bold tracking-widest"
              >
                {t("boutique")}
              </Link>
              <Link
                to="/#renaissance"
                className="hover:text-primary-600 transition-colors uppercase text-xs font-bold tracking-widest"
              >
                {t("renaissance")}
              </Link>
              <Link
                to="/#contact"
                className="hover:text-primary-600 transition-colors uppercase text-xs font-bold tracking-widest"
              >
                {t("contact")}
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                type="button"
                className="p-2 hover:text-primary-600 hidden sm:block"
              >
                <Search size={20} />
              </button>

              <button
                type="button"
                onClick={() => setLanguage(language === "fr" ? "ar" : "fr")}
                className="p-2 hover:text-primary-600 transition-colors font-serif font-bold"
              >
                {language === "fr" ? "AR" : "FR"}
              </button>

              <Link
                to="/admin"
                className="p-2 hover:text-primary-600 hidden sm:block"
              >
                <User size={20} />
              </Link>

              {/* PANNIER ICON -> GO TO CHECKOUT */}
              <Link
                to="/checkout"
                onClick={(e) => {
                  if (!cart || cart.length === 0) {
                    e.preventDefault();
                    alert(language === "ar" ? "السلة فارغة" : "Votre panier est vide.");
                    return;
                  }
                  setIsCartOpen(false);
                }}
                className="p-2 hover:text-primary-600 relative group"
                aria-label="Panier"
                title={language === "ar" ? "السلة" : "Panier"}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary-600 text-white text-[10px] flex items-center justify-center rounded-full border border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 absolute w-full h-screen z-50">
            <div className="px-4 pt-10 pb-8 space-y-8 flex flex-col items-center justify-start h-full">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl uppercase font-bold tracking-widest hover:text-primary-600"
              >
                {t("home")}
              </Link>
              <Link
                to="/#boutique"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl uppercase font-bold tracking-widest hover:text-primary-600"
              >
                {t("boutique")}
              </Link>
              <Link
                to="/#renaissance"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl uppercase font-bold tracking-widest hover:text-primary-600"
              >
                {t("renaissance")}
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl uppercase font-bold tracking-widest hover:text-primary-600"
              >
                {t("admin")}
              </Link>

              <Link
                to="/checkout"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (!cart || cart.length === 0) {
                    e.preventDefault();
                    alert(language === "ar" ? "السلة فارغة" : "Votre panier est vide.");
                  }
                }}
                className="text-xl uppercase font-bold tracking-widest hover:text-primary-600"
              >
                {t("checkout")}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div
            className={`fixed inset-y-0 ${
              isRTL ? "left-0" : "right-0"
            } z-[70] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-primary-50">
                <h2 className="text-lg font-bold uppercase tracking-widest">
                  {t("cart")}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center text-stone-500 mt-20">
                    <ShoppingBag size={48} className="mx-auto mb-4 text-stone-300" />
                    <p>{t("outOfStock")} / Empty</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={`${item.productId}-${idx}`}
                      className="flex gap-4 border-b border-stone-50 pb-4"
                    >
                      <div className="w-20 h-20 flex-shrink-0 bg-stone-100 rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.productName[language]}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-sm text-black">
                            {item.productName[language]}
                          </h3>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId, item.variationId)}
                            className="text-stone-400 hover:text-primary-600"
                            aria-label="Remove item"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {item.variationName && (
                          <p className="text-xs text-stone-500 mt-1">{item.variationName}</p>
                        )}

                        <div className="flex justify-between items-end mt-3">
                          {/* ✅ Qty controls */}
                          <div className="flex items-center gap-2 bg-stone-100 rounded-full px-2 py-1">
                            <button
                              type="button"
                              onClick={() => decreaseQty(item.productId, item.variationId)}
                              className="w-7 h-7 rounded-full bg-white hover:bg-stone-200 transition-colors flex items-center justify-center font-bold"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>

                            <span className="text-xs font-bold w-6 text-center">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQty(item.productId, item.variationId)}
                              className="w-7 h-7 rounded-full bg-white hover:bg-stone-200 transition-colors flex items-center justify-center font-bold"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-bold text-sm text-primary-600">
                            ${formatNumber(item.priceAtTime * (item.quantity || 1))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-stone-100 bg-stone-50">
                  <div className="flex justify-between mb-4 text-sm font-bold">
                    <span>{t("subtotal")}</span>
                    <span>${formatNumber(cartTotal)}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full bg-primary-600 text-white text-center py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-primary-200"
                  >
                    {t("checkout")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Floating WhatsApp Button */}
      {showWhatsApp && (
        <a
          href="https://wa.me/212676548798"
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed bottom-5 z-[60] flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:bg-[#20b858] transition-all duration-300 animate-fade-in-up ${
            isRTL ? "left-5" : "right-5"
          }`}
        >
          <MessageCircle size={18} fill="currentColor" className="text-white" />
          <span className="font-bold text-[11px] uppercase tracking-widest">
            {t("orderWhatsApp")}
          </span>
        </a>
      )}

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-black text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-serif text-2xl font-bold mb-6 flex items-center justify-center md:justify-start gap-2">
                <span className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs italic">
                  W
                </span>
                WAHIBASHOP
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                {t("heroSubtitle")}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-primary-600">
                {t("contact")}
              </h4>
              <ul className="space-y-4 text-sm text-stone-400">
                <li>contact@wahibashop.com</li>
                <li>+33 1 23 45 67 89</li>
                <li>Paris, France</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-primary-600">
                Suivez-nous
              </h4>
              <div className="flex space-x-4 justify-center md:justify-start rtl:space-x-reverse">
                <a
                  href="#"
                  className="bg-white/10 p-2 rounded-full hover:bg-primary-600 transition-colors"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="bg-white/10 p-2 rounded-full hover:bg-primary-600 transition-colors"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-16 pt-8 text-center text-xs text-stone-500">
            <p>{t("copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
