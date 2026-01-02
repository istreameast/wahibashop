import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, Minus, Plus, ShoppingBag, ZoomIn } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products } = useStore();
  const { language, t, formatNumber } = useLanguage();
  const { addToCart } = useCart();

  const product = products.find(p => p.slug === slug);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    if (product?.variations.length && !selectedVariation) {
      setSelectedVariation(product.variations[0].id);
    }
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [product, selectedVariation]);

  if (!product) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const currentPrice = selectedVariation 
    ? product.variations.find(v => v.id === selectedVariation)?.price || product.price
    : product.price;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variationId: selectedVariation,
      quantity,
      priceAtTime: currentPrice,
      productName: product.name,
      variationName: product.variations.find(v => v.id === selectedVariation)?.name,
      image: product.images[0]
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-stone-500 hover:text-black mb-8 text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="mr-2 rtl:ml-2 rtl:mr-0" />
          {t('backToShop')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="space-y-4">
            <div 
              className="relative aspect-[3/4] bg-stone-50 overflow-hidden cursor-zoom-in group"
              onClick={() => setIsZoomOpen(true)}
            >
              <img 
                src={product.images[selectedImage]} 
                alt={product.name[language]} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-125"
              />
              <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={20} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square border-2 transition-colors ${selectedImage === idx ? 'border-primary-600' : 'border-transparent'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="font-serif text-4xl mb-2">{product.name[language]}</h1>
            <p className="text-xl text-primary-600 mb-6 font-medium">${formatNumber(currentPrice)}</p>
            
            <p className="text-stone-600 leading-relaxed mb-8">
              {product.shortDescription[language]}
            </p>

            {/* Variations */}
            {product.variations.length > 0 && (
              <div className="mb-8">
                <label className="block text-xs uppercase tracking-widest mb-3">{t('selectOption')}</label>
                <div className="flex flex-wrap gap-3">
                  {product.variations.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariation(v.id)}
                      className={`px-6 py-2 border text-sm transition-all ${selectedVariation === v.id ? 'border-black bg-black text-white' : 'border-stone-200 hover:border-black'}`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add */}
            <div className="flex gap-4 mb-10">
              <div className="flex items-center border border-stone-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-stone-50"><Minus size={16} /></button>
                <span className="w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-stone-50"><Plus size={16} /></button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-secondary-900 text-white flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors uppercase text-xs tracking-widest"
              >
                <ShoppingBag size={16} />
                {t('addToCart')}
              </button>
            </div>

            {/* Rich Description */}
            <div className="prose max-w-none prose-stone prose-img:rounded-none">
              <h3 className="font-serif text-xl border-b pb-4 mb-4">{t('description')}</h3>
              {product.descriptionBlocks[language].map(block => (
                <div key={block.id} className="mb-6">
                  {block.type === 'text' && <p className="leading-relaxed">{block.content}</p>}
                  {block.type === 'image' && <img src={block.content} alt="Detail" className="w-full" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <img 
            src={product.images[selectedImage]} 
            alt="Zoom" 
            className="max-h-full max-w-full object-contain cursor-default"
            onClick={(e) => e.stopPropagation()} 
          />
          <button className="absolute top-4 right-4 text-white p-2">
            <Plus className="rotate-45" size={40} />
          </button>
        </div>
      )}
    </div>
  );
}
