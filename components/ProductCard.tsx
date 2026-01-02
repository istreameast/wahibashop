import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t, tCategory, formatNumber } = useLanguage();
  const navigate = useNavigate();

  const handleQuickClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.slug}`);
  };

  return (
    <div 
      className="group cursor-pointer flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-primary-50">
        <img 
          src={product.images[0]} 
          alt={product.name[language]} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
           <button 
             onClick={handleQuickClick}
             className="bg-primary-600 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg"
           >
             {t('addToCart')}
           </button>
        </div>
        {product.isFeatured && (
           <span className="absolute top-3 left-3 bg-primary-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
             {t('new')}
           </span>
        )}
      </div>
      <div className="p-4 text-center flex-1 flex flex-col justify-between">
        <div>
           <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">{tCategory(product.category)}</p>
           <h3 className="font-sans font-bold text-base text-black mb-2 leading-tight">{product.name[language]}</h3>
        </div>
        <p className="font-bold text-primary-600 mt-2 text-lg">${formatNumber(product.price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;