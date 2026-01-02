import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { addOrder } = useStore();
  const { t, formatNumber } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', address: '', phone: ''
  });
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    
    addOrder({
      id: orderId,
      date: new Date().toISOString(),
      status: 'pending',
      customer: formData,
      items: cart,
      total: cartTotal
    });

    clearCart();
    setOrderComplete(orderId);
  };

  if (orderComplete) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-cream-50 p-4 text-center">
        <div className="bg-white p-10 shadow-xl max-w-md w-full border-t-4 border-primary-600">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <Check size={32} />
          </div>
          <h2 className="font-serif text-2xl mb-2 text-black">{t('orderConfirmation')}</h2>
          <p className="text-stone-500 mb-6">{t('orderId')}: <span className="font-mono text-black font-bold">{orderComplete}</span></p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-secondary-900 text-white py-3 uppercase text-xs tracking-widest hover:bg-primary-600 transition-colors font-bold"
          >
            {t('backToShop')}
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  const inputClasses = "w-full border border-stone-300 bg-white text-stone-900 p-3 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none rounded-sm placeholder-stone-400";

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Form */}
        <div className="bg-white p-8 shadow-sm rounded-lg border border-stone-200">
          <h2 className="font-serif text-2xl mb-8 text-black">{t('customerInfo')}</h2>
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest block mb-2 font-bold text-stone-700">{t('firstName')}</label>
                <input required type="text" className={inputClasses} 
                  value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest block mb-2 font-bold text-stone-700">{t('lastName')}</label>
                <input required type="text" className={inputClasses}
                  value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest block mb-2 font-bold text-stone-700">{t('email')}</label>
              <input required type="email" className={inputClasses}
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest block mb-2 font-bold text-stone-700">{t('address')}</label>
              <input required type="text" className={inputClasses}
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest block mb-2 font-bold text-stone-700">{t('phone')}</label>
              <input required type="tel" className={inputClasses}
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="bg-white p-8 shadow-sm h-fit sticky top-24 rounded-lg border border-stone-200 text-stone-900">
          <h2 className="font-serif text-2xl mb-8 text-black">{t('total')}</h2>
          <div className="space-y-4 mb-8">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="relative border border-stone-200 rounded-md overflow-hidden">
                    <img src={item.image} className="w-12 h-12 object-cover" alt="" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-stone-200 text-stone-800 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">{item.quantity}</span>
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">{item.productName['fr']}</p>
                    {item.variationName && <p className="text-xs text-stone-500">{item.variationName}</p>}
                  </div>
                </div>
                <span className="font-medium text-stone-900">${formatNumber(item.priceAtTime * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-stone-100 pt-4 space-y-2 text-sm text-stone-700">
            <div className="flex justify-between">
              <span>{t('subtotal')}</span>
              <span>${formatNumber(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('shipping')}</span>
              <span>{t('free')}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4 border-t border-stone-100 mt-4 text-black">
              <span>{t('total')}</span>
              <span className="text-primary-600">${formatNumber(cartTotal)}</span>
            </div>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            className="w-full bg-secondary-900 text-white py-4 mt-8 uppercase text-xs font-bold tracking-widest hover:bg-primary-600 transition-colors shadow-lg"
          >
            {t('placeOrder')}
          </button>
        </div>
      </div>
    </div>
  );
}