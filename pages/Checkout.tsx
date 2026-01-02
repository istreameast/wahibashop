import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useStore } from "../contexts/StoreContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";

export default function Checkout() {
  const { cart, cartTotal, clearCart, removeFromCart, updateQuantity } = useCart();
  const { addOrder } = useStore();
  const { t, formatNumber, language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
  });

  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ If cart becomes empty, redirect safely (not during render)
  useEffect(() => {
    if (!orderComplete && cart.length === 0) {
      navigate("/");
    }
  }, [cart.length, navigate, orderComplete]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!cart || cart.length === 0) {
      alert(language === "ar" ? "السلة فارغة" : "Votre panier est vide.");
      navigate("/");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;

      await addOrder({
        id: orderId,
        date: new Date().toISOString(),
        status: "pending",
        customer: formData,
        items: cart,
        total: cartTotal,
      });

      clearCart();
      setOrderComplete(orderId);
    } catch (err) {
      console.error(err);
      alert(
        (language === "ar"
          ? "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى."
          : "Erreur lors de l’envoi de la commande. Réessayez.") +
          "\n\n(F12 Console for details)"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-cream-50 p-4 text-center">
        <div className="bg-white p-10 shadow-xl max-w-md w-full border-t-4 border-primary-600">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <Check size={32} />
          </div>
          <h2 className="font-serif text-2xl mb-2 text-black">
            {t("orderConfirmation")}
          </h2>
          <p className="text-stone-500 mb-6">
            {t("orderId")}:{" "}
            <span className="font-mono text-black font-bold">{orderComplete}</span>
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-secondary-900 text-white py-3 uppercase text-xs tracking-widest hover:bg-primary-600 transition-colors font-bold"
          >
            {t("backToShop")}
          </button>
        </div>
      </div>
    );
  }

  const inputClasses =
    "w-full border border-stone-300 bg-white text-stone-900 p-3 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none rounded-sm placeholder-stone-400";

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <div className="bg-white p-8 shadow-sm rounded-lg border border-stone-200">
          <h2 className="font-serif text-2xl mb-8 text-black">{t("customerInfo")}</h2>

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest block mb-2 font-bold text-stone-700">
                  {t("firstName")}
                </label>
                <input
                  required
                  type="text"
                  className={inputClasses}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest block mb-2 font-bold text-stone-700">
                  {t("lastName")}
                </label>
                <input
                  required
                  type="text"
                  className={inputClasses}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest block mb-2 font-bold text-stone-700">
                {t("email")}
              </label>
              <input
                required
                type="email"
                className={inputClasses}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest block mb-2 font-bold text-stone-700">
                {t("address")}
              </label>
              <input
                required
                type="text"
                className={inputClasses}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest block mb-2 font-bold text-stone-700">
                {t("phone")}
              </label>
              <input
                required
                type="tel"
                className={inputClasses}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="bg-white p-8 shadow-sm h-fit sticky top-24 rounded-lg border border-stone-200 text-stone-900">
          <h2 className="font-serif text-2xl mb-8 text-black">{t("total")}</h2>

          {/* ✅ FIXED cart list layout */}
          <div className="space-y-0 mb-8">
            {cart.map((item, i) => {
              const qty = item.quantity || 1;
              const title =
                item.productName?.[language] || item.productName?.["fr"] || "Produit";

              return (
                <div
                  key={`${item.productId}-${item.variationId || "noVar"}-${i}`}
                  className="py-4 border-b border-stone-100"
                >
                  <div className="flex items-start gap-3">
                    {/* Image */}
                    <div className="relative border border-stone-200 rounded-md overflow-hidden w-12 h-12 shrink-0">
                      <img
                        src={item.image}
                        className="w-12 h-12 object-cover"
                        alt={title}
                      />
                    </div>

                    {/* Middle */}
                    <div className="flex-1 min-w-0">
                      {/* Title row + remove */}
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-stone-900 truncate">
                            {title}
                          </p>
                          {item.variationName && (
                            <p className="text-xs text-stone-500 truncate">
                              {item.variationName}
                            </p>
                          )}
                        </div>

                        {/* Remove button stays INSIDE */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, item.variationId)}
                          className="shrink-0 w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-primary-600"
                          aria-label="Remove item"
                          title={language === "ar" ? "حذف" : "Supprimer"}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Qty + price row */}
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 bg-stone-100 rounded-full px-2 py-1 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.variationId, qty - 1)
                            }
                            className="w-7 h-7 rounded-full bg-white hover:bg-stone-200 transition-colors flex items-center justify-center font-bold"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>

                          <span className="text-xs font-bold w-6 text-center">
                            {qty}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.variationId, qty + 1)
                            }
                            className="w-7 h-7 rounded-full bg-white hover:bg-stone-200 transition-colors flex items-center justify-center font-bold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price never overflows */}
                        <span className="font-medium text-stone-900 whitespace-nowrap shrink-0">
                          ${formatNumber(item.priceAtTime * qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-stone-100 pt-4 space-y-2 text-sm text-stone-700">
            <div className="flex justify-between">
              <span>{t("subtotal")}</span>
              <span className="whitespace-nowrap">${formatNumber(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("shipping")}</span>
              <span>{t("free")}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4 border-t border-stone-100 mt-4 text-black">
              <span>{t("total")}</span>
              <span className="text-primary-600 whitespace-nowrap">
                ${formatNumber(cartTotal)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting || cart.length === 0}
            className={`w-full py-4 mt-8 uppercase text-xs font-bold tracking-widest transition-colors shadow-lg ${
              isSubmitting || cart.length === 0
                ? "bg-stone-300 text-stone-600 cursor-not-allowed"
                : "bg-secondary-900 text-white hover:bg-primary-600"
            }`}
          >
            {isSubmitting ? (language === "ar" ? "جاري الإرسال..." : "Envoi...") : t("placeOrder")}
          </button>
        </div>
      </div>
    </div>
  );
}
