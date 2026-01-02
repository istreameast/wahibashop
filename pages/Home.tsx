import React, { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { useLanguage } from '../contexts/LanguageContext';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Star, Plus, Minus, Heart, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { products, addMessage, sliderImages, clientResults, testimonials } = useStore();
  const { language, t, tCategory } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');

  // Testimonials Rotation
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  // Derived Data
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);
  const featuredProducts = products.filter(p => p.isFeatured);

  useEffect(() => {
    if (sliderImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages]);

  // Rotate Testimonials
  useEffect(() => {
    if (testimonials.length < 2) return;
    const interval = setInterval(() => {
      setActiveTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const activeTestimonial = testimonials.length > 0 ? testimonials[activeTestimonialIndex] : null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMessage({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...contactForm,
      read: false
    });
    setFormStatus('success');
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setFormStatus('idle'), 3000);
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden bg-black">
        {sliderImages.length > 0 ? (
          sliderImages.map((img, idx) => (
            <div 
              key={img.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={img.url} 
                alt="Hero" 
                className="w-full h-full object-cover opacity-60"
                style={{ objectPosition: img.position || '50% 50%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-600/30 to-black/30" />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-stone-900 flex items-center justify-center text-white/50">
             No images
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl animate-fade-in-up">
            <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-[10px] md:text-xs uppercase font-bold tracking-widest mb-6 inline-block">
               {t('new')}
            </span>
            <h1 className="font-sans font-black text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight leading-none drop-shadow-xl uppercase">
              {t('heroTitle')}
            </h1>
            <p className="text-lg md:text-2xl font-light mb-10 text-white/90 max-w-2xl mx-auto drop-shadow-md">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('boutique')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary-600 border border-primary-600 text-white hover:bg-white hover:text-primary-600 px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-primary-900/50"
              >
                {t('discover')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section (Coups de coeur) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-sans font-black text-3xl md:text-5xl text-black uppercase mb-4">{t('featured')}</h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Renaissance Story (Marketing Block) */}
      <section id="renaissance" className="py-24 bg-primary-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
             <img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1780&auto=format&fit=crop" className="w-full h-full object-cover" alt="Story" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
             <div className="absolute bottom-10 left-10 text-white">
                <p className="font-bold text-2xl mb-2">Ribeiro's Liss</p>
                <p className="text-sm opacity-80">Professional Quality</p>
             </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="text-primary-600 text-xs font-bold uppercase tracking-widest mb-4 block flex items-center gap-2">
               <Heart size={14} fill="currentColor" /> {t('renaissance')}
            </span>
            <h2 className="font-sans font-black text-4xl md:text-5xl mb-6 leading-tight uppercase">
              La nouvelle ère du <span className="text-primary-600">Soin Capillaire</span>
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-6 font-light">
              Découvrez notre gamme exclusive conçue pour transformer votre chevelure. 
              Des ingrédients nobles, une technologie avancée et des résultats visibles immédiatement.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Formule enrichie à la kératine pure', 
                'Sans formaldéhyde', 
                'Brillance miroir garantie',
                'Adapté à tous types de cheveux'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-medium text-black">
                  <CheckCircle size={20} className="text-primary-600" /> {item}
                </li>
              ))}
            </ul>
            <button className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-primary-600 transition-colors">
              En savoir plus
            </button>
          </div>
        </div>
      </section>

      {/* Boutique Catalog */}
      <section id="boutique" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
               <h2 className="font-sans font-black text-3xl md:text-5xl uppercase">{t('boutique')}</h2>
            </div>
            <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${activeCategory === cat ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-stone-200 text-stone-500 hover:border-black hover:text-black'}`}
                >
                  {tCategory(cat)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Video / Social Proof Mock (CLIENT RESULTS) */}
      <section className="py-24 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <h2 className="font-sans font-black text-3xl md:text-4xl uppercase mb-4 italic">
             Ribeiro's Liss: Résultats impeccables
           </h2>
           <p className="text-stone-400 mb-12">Découvrez pourquoi 10,000+ femmes nous font confiance.</p>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
             {clientResults.map((result) => (
               <div key={result.id} className="aspect-[9/16] bg-stone-800 rounded-2xl relative overflow-hidden group cursor-pointer">
                 <img src={result.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" alt="Result" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                    </div>
                 </div>
                 <div className="absolute bottom-4 left-4 text-left">
                   <p className="font-bold text-sm">{result.handle}</p>
                   <p className="text-xs text-primary-400">{result.tag}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Testimonials */}
      {activeTestimonial && (
        <section className="py-20 bg-primary-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 animate-fade-in-up">
            <div className="flex justify-center mb-8 text-white">
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
            </div>
            <h3 className="font-serif text-3xl md:text-5xl italic font-bold mb-8 leading-tight">
              "{activeTestimonial.text}"
            </h3>
            <div className="flex items-center justify-center gap-4">
               <div className="w-12 h-12 bg-white rounded-full overflow-hidden border-2 border-white">
                 <img src={activeTestimonial.avatar} className="w-full h-full object-cover" alt={activeTestimonial.author} />
               </div>
               <div className="text-left">
                  <p className="text-sm font-bold uppercase tracking-widest">{activeTestimonial.author}</p>
                  <p className="text-xs opacity-80">{activeTestimonial.role}</p>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Accordion */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-3xl mx-auto px-4">
           <h2 className="font-sans font-black text-3xl text-center mb-12 uppercase">{t('faq')}</h2>
           <div className="space-y-4">
             {['Combien de temps dure le lissage ?', 'Est-ce compatible avec les cheveux colorés ?', 'Quels sont les délais de livraison ?'].map((q, i) => (
               <details key={i} className="group bg-white rounded-2xl p-6 cursor-pointer border border-stone-100 open:ring-2 open:ring-primary-100 open:border-primary-200 shadow-sm transition-all">
                 <summary className="flex justify-between items-center font-bold text-lg list-none">
                   <span>{q}</span>
                   <span className="bg-stone-100 p-2 rounded-full transition-transform group-open:rotate-180 group-open:bg-primary-600 group-open:text-white"><Plus size={16} /></span>
                 </summary>
                 <p className="text-stone-500 mt-4 text-base leading-relaxed pl-2 border-l-2 border-primary-200">
                   Nos produits garantissent un résultat durable de 3 à 6 mois selon l'entretien. 
                   Oui, ils sont 100% compatibles et ravivent même la couleur.
                   Livraison Express 24/48h partout en Europe.
                 </p>
               </details>
             ))}
           </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 bg-primary-50 rounded-3xl p-8 md:p-16">
          <div className="text-center mb-10">
             <h2 className="font-sans font-black text-3xl md:text-4xl mb-4 uppercase">{t('contact')}</h2>
             <p className="text-stone-500">Une question ? Notre équipe vous répond en 24h.</p>
          </div>
          
          {formStatus === 'success' ? (
            <div className="bg-green-100 text-green-800 p-8 rounded-xl text-center border border-green-200">
              <CheckCircle className="mx-auto mb-4" size={48} />
              <h3 className="font-bold text-xl mb-2">{t('contactSuccess')}</h3>
              <p>Nous vous répondrons très vite.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-6 max-w-xl mx-auto">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1">{t('firstName')}</label>
                  <input 
                    type="text" required 
                    value={contactForm.name}
                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full border-none bg-white p-4 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 outline-none" 
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1">{t('email')}</label>
                  <input 
                    type="email" required 
                    value={contactForm.email}
                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full border-none bg-white p-4 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 outline-none" 
                    placeholder="email@exemple.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1">{t('subject')}</label>
                <input 
                  type="text" required
                  value={contactForm.subject}
                  onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                  className="w-full border-none bg-white p-4 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 outline-none" 
                  placeholder="Sujet de votre demande"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1">{t('message')}</label>
                <textarea 
                  rows={4} required
                  value={contactForm.message}
                  onChange={e => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full border-none bg-white p-4 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 outline-none resize-none" 
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>
              <button type="submit" className="w-full bg-black text-white py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-primary-600 transition-colors shadow-xl">
                {t('submit')}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}