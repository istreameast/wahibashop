import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Product, Variation, DescriptionBlock, Order } from '../types';
import { Trash, Edit, Plus, Image as ImageIcon, Save, X, RefreshCw, Upload, FileText, Eye, Printer, Phone, MapPin, Mail, MessageSquare, Move, Crosshair, LogOut, Lock, Quote } from 'lucide-react';

const ADMIN_PASSWORD = 'admin'; // Hardcoded password for client-side protection

export default function Admin() {
  const { 
    products, orders, messages, sliderImages, clientResults, testimonials,
    addProduct, updateProduct, deleteProduct, updateOrderStatus, 
    addSliderImage, removeSliderImage, addClientResult, removeClientResult,
    addTestimonial, removeTestimonial,
    resetStore 
  } = useStore();
  const { formatNumber, t, isRTL } = useLanguage();
  
  // -- AUTH STATE --
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // -- DASHBOARD STATE --
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'messages' | 'settings' | 'reviews'>('orders');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newReview, setNewReview] = useState({ handle: '', tag: '', image: '' });
  const [newTestimonial, setNewTestimonial] = useState({ text: '', author: '', role: '', avatar: '' });
  const [positioningImage, setPositioningImage] = useState<{ url: string } | null>(null);
  const [cropPos, setCropPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Check authentication on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('isAdminAuthenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoadingAuth(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      setAuthError('');
    } else {
      setAuthError(t('wrongPassword'));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAdminAuthenticated');
    setPasswordInput('');
  };

  // --- Product Form State ---
  const initialProductState: Product = {
    id: '', slug: '', name: { fr: '', ar: '' },
    shortDescription: { fr: '', ar: '' },
    descriptionBlocks: { fr: [], ar: [] },
    price: 0, images: [], category: '', variations: [], isFeatured: false
  };
  const [formProduct, setFormProduct] = useState<Product>(initialProductState);

  // ... (Logic for Create/Edit, File Uploads, etc.) ...
  const handleEdit = (product: Product) => {
    setFormProduct(product);
    setEditingProduct(product);
    setIsCreating(false);
    setActiveTab('products');
  };

  const handleCreate = () => {
    setFormProduct({ ...initialProductState, id: Date.now().toString() });
    setEditingProduct(null);
    setIsCreating(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      addProduct({ ...formProduct, slug: formProduct.name.fr.toLowerCase().replace(/\s+/g, '-') });
      setIsCreating(false);
    } else {
      updateProduct(formProduct);
      setEditingProduct(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReview = () => {
    if (newReview.image && newReview.handle) {
      addClientResult({
        id: Date.now().toString(),
        image: newReview.image,
        handle: newReview.handle,
        tag: newReview.tag
      });
      setNewReview({ handle: '', tag: '', image: '' });
    }
  };

  const handleAddTestimonial = () => {
    if (newTestimonial.text && newTestimonial.author && newTestimonial.avatar) {
      addTestimonial({
        id: Date.now().toString(),
        text: newTestimonial.text,
        author: newTestimonial.author,
        role: newTestimonial.role || 'Verified Client',
        avatar: newTestimonial.avatar
      });
      setNewTestimonial({ text: '', author: '', role: '', avatar: '' });
    }
  }

  const handleSliderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, (base64) => {
      setPositioningImage({ url: base64 });
      setCropPos({ x: 50, y: 50 });
    });
  };

  const saveSliderImage = () => {
    if (positioningImage) {
      addSliderImage({
        id: Date.now().toString(),
        url: positioningImage.url,
        position: `${cropPos.x}% ${cropPos.y}%`
      });
      setPositioningImage(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateCropPos(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) updateCropPos(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateCropPos = (e: React.MouseEvent) => {
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      let x = ((e.clientX - rect.left) / rect.width) * 100;
      let y = ((e.clientY - rect.top) / rect.height) * 100;
      x = Math.max(0, Math.min(100, x));
      y = Math.max(0, Math.min(100, y));
      setCropPos({ x, y });
    }
  };

  const renderDescriptionEditor = (lang: 'fr' | 'ar') => {
    return (
      <div className="space-y-4">
        {formProduct.descriptionBlocks[lang].map((block, index) => (
          <div key={block.id} className="border p-4 rounded bg-stone-50 relative group">
             <button 
               type="button"
               onClick={() => {
                  const newBlocks = formProduct.descriptionBlocks[lang].filter(b => b.id !== block.id);
                  setFormProduct({
                    ...formProduct,
                    descriptionBlocks: { ...formProduct.descriptionBlocks, [lang]: newBlocks }
                  });
               }}
               className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm"
             >
               <Trash size={14} />
             </button>
             <div className="flex items-center gap-2 mb-2">
                {block.type === 'text' ? <FileText size={14} className="text-stone-400"/> : <ImageIcon size={14} className="text-stone-400"/>}
                <span className="text-xs uppercase font-bold text-stone-400">{block.type} Block</span>
             </div>
             {block.type === 'text' ? (
               <textarea 
                 value={block.content}
                 onChange={(e) => {
                   const newBlocks = [...formProduct.descriptionBlocks[lang]];
                   newBlocks[index] = { ...block, content: e.target.value };
                   setFormProduct({
                     ...formProduct,
                     descriptionBlocks: { ...formProduct.descriptionBlocks, [lang]: newBlocks }
                   });
                 }}
                 className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-primary-600 outline-none"
                 rows={3}
                 placeholder="Write description content here..."
                 dir={lang === 'ar' ? 'rtl' : 'ltr'}
               />
             ) : (
               <div className="space-y-2">
                 {block.content ? (
                   <img src={block.content} alt="Preview" className="h-32 object-contain bg-white border rounded" />
                 ) : (
                    <div className="h-20 bg-stone-100 flex items-center justify-center text-xs text-stone-400">No image selected</div>
                 )}
                 <label className="flex items-center gap-2 cursor-pointer bg-white border border-stone-300 p-2 rounded w-fit hover:border-primary-600 hover:text-primary-600 transition-colors">
                   <Upload size={14} />
                   <span className="text-xs font-bold">Upload Image</span>
                   <input 
                     type="file" 
                     accept="image/*" 
                     className="hidden"
                     onChange={(e) => handleFileUpload(e, (base64) => {
                        const newBlocks = [...formProduct.descriptionBlocks[lang]];
                        newBlocks[index] = { ...block, content: base64 };
                        setFormProduct({
                          ...formProduct,
                          descriptionBlocks: { ...formProduct.descriptionBlocks, [lang]: newBlocks }
                        });
                     })}
                   />
                 </label>
               </div>
             )}
          </div>
        ))}
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => {
              const newBlock: DescriptionBlock = { id: Date.now().toString() + Math.random(), type: 'text', content: '' };
              setFormProduct({ ...formProduct, descriptionBlocks: { ...formProduct.descriptionBlocks, [lang]: [...formProduct.descriptionBlocks[lang], newBlock] } });
            }}
            className="flex items-center gap-1 px-3 py-2 bg-stone-200 text-xs font-bold uppercase rounded hover:bg-stone-300 transition-colors text-black"
          >
            <Plus size={14} /> Text
          </button>
          <button 
            type="button"
            onClick={() => {
              const newBlock: DescriptionBlock = { id: Date.now().toString() + Math.random(), type: 'image', content: '' };
              setFormProduct({ ...formProduct, descriptionBlocks: { ...formProduct.descriptionBlocks, [lang]: [...formProduct.descriptionBlocks[lang], newBlock] } });
            }}
            className="flex items-center gap-1 px-3 py-2 bg-stone-200 text-xs font-bold uppercase rounded hover:bg-stone-300 transition-colors text-black"
          >
            <Plus size={14} /> Image
          </button>
        </div>
      </div>
    );
  };

  // --- RENDER LOGIN SCREEN IF NOT AUTHENTICATED ---
  if (!isAuthenticated && !isLoadingAuth) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full border border-stone-100 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-600 rounded-full mb-6">
            <Lock size={32} />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2 text-black">WAHIBASHOP</h1>
          <p className="text-stone-500 text-xs uppercase tracking-widest mb-8">{t('adminLogin')}</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
             <div className="relative">
               <input 
                 type="password" 
                 value={passwordInput}
                 onChange={(e) => setPasswordInput(e.target.value)}
                 className="w-full border border-stone-300 p-4 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none transition-all placeholder-stone-400 text-center text-lg tracking-widest"
                 placeholder="• • • • •"
                 autoFocus
               />
             </div>
             {authError && <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded">{authError}</p>}
             <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg transform active:scale-95">
               {t('enter')}
             </button>
          </form>
          <p className="mt-8 text-stone-300 text-[10px] uppercase">Secure Access Area</p>
        </div>
      </div>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-10 text-stone-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="font-serif text-3xl text-black">Admin Dashboard</h1>
          <div className="flex gap-3">
             <button onClick={handleLogout} className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-widest bg-white border border-stone-200 px-4 py-2 rounded hover:bg-stone-100 hover:text-black transition-colors">
               <LogOut size={14} /> {t('logout')}
             </button>
             <button onClick={resetStore} className="flex items-center gap-2 text-red-500 text-xs uppercase tracking-widest border border-red-200 px-4 py-2 rounded hover:bg-red-50 transition-colors">
               <RefreshCw size={14} /> Reset Data
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-stone-200 overflow-x-auto no-scrollbar">
          {['orders', 'products', 'messages', 'reviews', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setIsCreating(false); setEditingProduct(null); }}
              className={`pb-4 text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === tab ? 'border-b-2 border-primary-600 text-black font-bold' : 'text-stone-400 hover:text-stone-600'}`}
            >
              {t(tab as any)} ({tab === 'orders' ? orders.length : tab === 'products' ? products.length : tab === 'messages' ? messages.length : tab === 'reviews' ? clientResults.length : sliderImages.length})
            </button>
          ))}
        </div>

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div className="bg-white shadow-sm overflow-x-auto rounded-xl border border-stone-200 animate-fade-in-up">
            <table className="w-full text-left text-sm text-stone-900">
              <thead className="bg-stone-50 text-xs uppercase tracking-widest text-stone-700">
                <tr>
                  <th className="p-4 border-b border-stone-200">ID</th>
                  <th className="p-4 border-b border-stone-200">Customer</th>
                  <th className="p-4 border-b border-stone-200">Total</th>
                  <th className="p-4 border-b border-stone-200">Status</th>
                  <th className="p-4 border-b border-stone-200">Details</th>
                  <th className="p-4 border-b border-stone-200">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="p-12 text-center text-stone-400">No orders found.</td></tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-mono font-medium text-stone-900">{order.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-stone-900">{order.customer.firstName} {order.customer.lastName}</div>
                        <div className="text-xs text-stone-500">{order.customer.email}</div>
                      </td>
                      <td className="p-4 font-bold text-stone-900">${formatNumber(order.total)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                         <button 
                           onClick={() => setSelectedOrder(order)} 
                           className="flex items-center gap-1 text-primary-600 font-bold hover:underline"
                         >
                           <Eye size={16} /> View
                         </button>
                      </td>
                      <td className="p-4">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="border border-stone-300 bg-white p-1 text-xs rounded text-stone-900 focus:border-primary-600 outline-none cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- MESSAGES TAB --- */}
        {activeTab === 'messages' && (
          <div className="space-y-4 animate-fade-in-up">
            {messages.length === 0 ? (
              <div className="text-center text-stone-400 p-8">No messages</div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="bg-white p-6 shadow-sm border-l-4 border-primary-600 rounded-r-lg border border-t-stone-100 border-r-stone-100 border-b-stone-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-bold text-stone-900">{msg.subject}</h4>
                    <span className="text-xs text-stone-500">{new Date(msg.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-stone-700 mb-4 leading-relaxed">{msg.message}</p>
                  <div className="text-xs text-stone-500 bg-stone-50 p-2 rounded inline-block">
                    From: <span className="font-medium text-stone-900">{msg.name}</span> (<a href={`mailto:${msg.email}`} className="text-primary-600 hover:underline">{msg.email}</a>)
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- REVIEWS TAB --- */}
        {activeTab === 'reviews' && (
          <div className="space-y-12 animate-fade-in-up">
            
            {/* 1. TEXT TESTIMONIALS SECTION */}
            <div className="bg-white p-8 shadow-sm rounded-xl border border-stone-200">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-primary-50 rounded-full text-primary-600"><Quote size={20} /></div>
                 <h2 className="text-xl font-bold text-black">Text Testimonials</h2>
               </div>
               
               {/* Add Testimonial Form */}
               <div className="bg-stone-50 p-6 rounded-lg mb-8 border border-stone-200">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Add Quote</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="md:col-span-2">
                        <textarea 
                           placeholder="Quote text..." 
                           className="w-full border border-stone-300 p-3 rounded focus:ring-2 focus:ring-primary-600 outline-none text-sm"
                           rows={2}
                           value={newTestimonial.text}
                           onChange={e => setNewTestimonial({...newTestimonial, text: e.target.value})}
                        />
                     </div>
                     <div>
                        <input 
                          type="text" 
                          placeholder="Author Name" 
                          className="w-full border border-stone-300 p-2 rounded focus:ring-2 focus:ring-primary-600 outline-none text-sm"
                          value={newTestimonial.author}
                          onChange={e => setNewTestimonial({...newTestimonial, author: e.target.value})}
                        />
                     </div>
                     <div>
                        <input 
                          type="text" 
                          placeholder="Role (e.g. Verified Client)" 
                          className="w-full border border-stone-300 p-2 rounded focus:ring-2 focus:ring-primary-600 outline-none text-sm"
                          value={newTestimonial.role}
                          onChange={e => setNewTestimonial({...newTestimonial, role: e.target.value})}
                        />
                     </div>
                     <div className="md:col-span-2 flex items-center gap-4">
                        <div className="flex-1">
                          {newTestimonial.avatar ? (
                             <div className="flex items-center gap-2 bg-white p-2 border rounded">
                               <img src={newTestimonial.avatar} className="w-8 h-8 rounded-full object-cover" alt="Avatar"/>
                               <span className="text-xs text-green-600 font-bold">Image Loaded</span>
                               <button onClick={() => setNewTestimonial({...newTestimonial, avatar: ''})} className="ml-auto text-red-500"><X size={14}/></button>
                             </div>
                          ) : (
                            <label className="flex items-center gap-2 cursor-pointer bg-white border border-dashed border-stone-300 p-2 rounded w-full hover:border-primary-600 transition-colors">
                               <Upload size={14} className="text-stone-400" />
                               <span className="text-xs text-stone-500">Upload Avatar</span>
                               <input 
                                 type="file" 
                                 accept="image/*" 
                                 className="hidden" 
                                 onChange={(e) => handleFileUpload(e, (base64) => setNewTestimonial({...newTestimonial, avatar: base64}))}
                               />
                            </label>
                          )}
                        </div>
                        <button 
                           onClick={handleAddTestimonial}
                           disabled={!newTestimonial.text || !newTestimonial.author}
                           className="bg-black text-white px-6 py-2 rounded font-bold uppercase text-xs hover:bg-stone-800 disabled:opacity-50"
                        >
                           Add Quote
                        </button>
                     </div>
                  </div>
               </div>

               {/* List Text Testimonials */}
               <div className="space-y-3">
                 {testimonials.map((testi) => (
                   <div key={testi.id} className="flex items-center gap-4 p-4 bg-stone-50 rounded border border-stone-100">
                      <img src={testi.avatar} className="w-12 h-12 rounded-full object-cover border border-white shadow-sm" alt=""/>
                      <div className="flex-1">
                         <p className="text-sm font-medium italic text-stone-800">"{testi.text}"</p>
                         <p className="text-xs text-stone-500 mt-1 font-bold">{testi.author} <span className="font-normal opacity-50">• {testi.role}</span></p>
                      </div>
                      <button onClick={() => removeTestimonial(testi.id)} className="text-stone-400 hover:text-red-500 p-2"><Trash size={16}/></button>
                   </div>
                 ))}
               </div>
            </div>

            {/* 2. PHOTO REVIEWS SECTION */}
            <div className="bg-white p-8 shadow-sm rounded-xl border border-stone-200">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-primary-50 rounded-full text-primary-600"><ImageIcon size={20} /></div>
                 <h2 className="text-xl font-bold text-black">Photo Reviews (Grid)</h2>
               </div>
            
              {/* Add New Review Form */}
              <div className="bg-stone-50 p-6 rounded-lg mb-8 border border-stone-200">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">{t('addReview')}</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs uppercase font-bold mb-2 text-stone-700">{t('handle')}</label>
                    <input 
                      type="text" 
                      value={newReview.handle} 
                      onChange={e => setNewReview({...newReview, handle: e.target.value})}
                      placeholder="@client_name"
                      className="w-full border border-stone-300 p-2 rounded focus:ring-2 focus:ring-primary-600 outline-none"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs uppercase font-bold mb-2 text-stone-700">{t('tag')}</label>
                    <input 
                      type="text" 
                      value={newReview.tag} 
                      onChange={e => setNewReview({...newReview, tag: e.target.value})}
                      placeholder="#Transformation"
                      className="w-full border border-stone-300 p-2 rounded focus:ring-2 focus:ring-primary-600 outline-none"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs uppercase font-bold mb-2 text-stone-700">Image</label>
                    {newReview.image ? (
                       <div className="relative h-10 w-full">
                          <img src={newReview.image} className="h-full object-contain" alt="Preview"/>
                          <button onClick={() => setNewReview({...newReview, image: ''})} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"><X size={10}/></button>
                       </div>
                    ) : (
                      <label className="border border-dashed border-stone-300 p-2 rounded w-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors h-[42px]">
                         <Upload size={16} className="text-stone-400" />
                         <input 
                           type="file" 
                           accept="image/*" 
                           className="hidden" 
                           onChange={(e) => handleFileUpload(e, (base64) => setNewReview({...newReview, image: base64}))}
                         />
                      </label>
                    )}
                  </div>
                  <button 
                    onClick={handleAddReview}
                    disabled={!newReview.image || !newReview.handle}
                    className="bg-primary-600 text-white px-6 py-2.5 rounded font-bold uppercase text-xs hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* List Reviews */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {clientResults.map((result) => (
                  <div key={result.id} className="relative group bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                    <div className="aspect-[9/16] relative">
                      <img src={result.image} alt={result.handle} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 text-white">
                        <p className="font-bold text-sm">{result.handle}</p>
                        <p className="text-xs opacity-80">{result.tag}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeClientResult(result.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
                {clientResults.length === 0 && (
                  <div className="col-span-full text-center text-stone-400 py-10">
                    No reviews added yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- SETTINGS (SLIDER) TAB --- */}
        {activeTab === 'settings' && (
           <div className="bg-white p-8 shadow-sm rounded-xl border border-stone-200 animate-fade-in-up">
             <h2 className="text-xl font-bold mb-6 text-black">Home Slider Images</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
               {sliderImages.map((img, idx) => (
                 <div key={img.id || idx} className="relative group aspect-video bg-stone-100 rounded overflow-hidden border border-stone-200 shadow-sm">
                    <img 
                      src={img.url} 
                      alt={`Slide ${idx}`} 
                      className="w-full h-full object-cover"
                      style={{ objectPosition: img.position || '50% 50%' }}
                    />
                    <button 
                      onClick={() => removeSliderImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash size={16} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                       Slide {idx + 1}
                    </div>
                 </div>
               ))}
               <label className="border-2 border-dashed border-stone-300 flex flex-col items-center justify-center p-8 cursor-pointer hover:border-primary-600 hover:text-primary-600 transition-colors rounded-lg bg-stone-50 hover:bg-white h-full min-h-[150px]">
                  <Upload size={32} className="mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">Upload Image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleSliderUpload}
                  />
               </label>
             </div>
             <p className="text-xs text-stone-500 bg-blue-50 p-3 rounded border border-blue-100 inline-block">
               ℹ️ Tips: Large images may fill up LocalStorage quota (approx 5MB). Use optimized images (WebP/JPG).
             </p>
           </div>
        )}

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div className="animate-fade-in-up">
            {!isCreating && !editingProduct ? (
              <div>
                <button onClick={handleCreate} className="mb-6 bg-secondary-900 text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-primary-600 font-bold rounded shadow-lg transform active:scale-95 transition-all">
                  + Add Product
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(p => (
                    <div key={p.id} className="bg-white p-4 shadow-sm flex gap-4 border border-stone-200 hover:border-primary-200 transition-all rounded-lg hover:shadow-md">
                      <div className="w-20 h-24 bg-stone-100 flex-shrink-0 rounded overflow-hidden">
                        {p.images[0] ? (
                          <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400"><ImageIcon size={20}/></div>
                        )}
                      </div>
                      <div className="flex-1">
                         <h3 className="font-serif font-bold line-clamp-2 text-stone-900">{p.name.fr || 'Untitled'}</h3>
                         <p className="text-sm text-stone-500">${p.price}</p>
                         <div className="flex gap-2 mt-4">
                           <button onClick={() => handleEdit(p)} className="p-1 text-stone-500 hover:text-primary-600 transition-colors"><Edit size={16} /></button>
                           <button onClick={() => deleteProduct(p.id)} className="p-1 text-stone-500 hover:text-red-600 transition-colors"><Trash size={16} /></button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProduct} className="bg-white p-8 shadow-sm max-w-4xl border border-stone-200 rounded-lg animate-fade-in-up">
                 <div className="flex justify-between items-center mb-8 border-b pb-4">
                   <h2 className="text-xl font-bold font-serif text-black">{isCreating ? 'Create Product' : 'Edit Product'}</h2>
                   <button type="button" onClick={() => { setIsCreating(false); setEditingProduct(null); }} className="hover:bg-stone-100 p-2 rounded-full text-stone-500 hover:text-black"><X /></button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                   {/* Left Column: Basic Info */}
                   <div className="space-y-6">
                     <div>
                       <label className="block text-xs uppercase font-bold mb-2 text-stone-700">Name (FR)</label>
                       <input className="w-full border border-stone-300 p-2 rounded focus:ring-2 focus:ring-primary-600 outline-none" 
                         value={formProduct.name.fr} onChange={e => setFormProduct({...formProduct, name: {...formProduct.name, fr: e.target.value}})} />
                     </div>
                     <div>
                       <label className="block text-xs uppercase font-bold mb-2 text-stone-700">Name (AR)</label>
                       <input className="w-full border border-stone-300 p-2 rounded focus:ring-2 focus:ring-primary-600 outline-none text-right" dir="rtl"
                         value={formProduct.name.ar} onChange={e => setFormProduct({...formProduct, name: {...formProduct.name, ar: e.target.value}})} />
                     </div>
                     
                     <div>
                       <label className="block text-xs uppercase font-bold mb-2 text-stone-700">Short Description (FR)</label>
                       <textarea className="w-full border border-stone-300 p-2 rounded focus:ring-2 focus:ring-primary-600 outline-none" rows={2}
                         value={formProduct.shortDescription.fr} onChange={e => setFormProduct({...formProduct, shortDescription: {...formProduct.shortDescription, fr: e.target.value}})} />
                     </div>
                     <div>
                       <label className="block text-xs uppercase font-bold mb-2 text-stone-700">Short Description (AR)</label>
                       <textarea className="w-full border border-stone-300 p-2 rounded focus:ring-2 focus:ring-primary-600 outline-none text-right" dir="rtl" rows={2}
                         value={formProduct.shortDescription.ar} onChange={e => setFormProduct({...formProduct, shortDescription: {...formProduct.shortDescription, ar: e.target.value}})} />
                     </div>

                     <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs uppercase font-bold mb-2 text-stone-700">Category</label>
                          <input className="w-full border border-stone-300 p-2 rounded focus:ring-2 focus:ring-primary-600 outline-none" 
                            value={formProduct.category} onChange={e => setFormProduct({...formProduct, category: e.target.value})} />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs uppercase font-bold mb-2 text-stone-700">Base Price ($)</label>
                          <input type="number" className="w-full border border-stone-300 p-2 rounded focus:ring-2 focus:ring-primary-600 outline-none" 
                            value={formProduct.price} onChange={e => setFormProduct({...formProduct, price: Number(e.target.value)})} />
                        </div>
                     </div>
                   </div>
                   
                   {/* Right Column: Images & Features */}
                   <div className="space-y-6">
                      <div>
                        <label className="block text-xs uppercase font-bold mb-2 text-stone-700">Gallery Images</label>
                        <div className="flex flex-wrap gap-2">
                          {formProduct.images.map((img, i) => (
                            <div key={i} className="relative w-20 h-20 bg-stone-100 group border rounded overflow-hidden">
                              <img src={img} className="w-full h-full object-cover" alt="" />
                              <button type="button" onClick={() => setFormProduct({...formProduct, images: formProduct.images.filter((_, idx) => idx !== i)})} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                              {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center">Cover</span>}
                            </div>
                          ))}
                          <label className="w-20 h-20 border-2 border-dashed flex flex-col items-center justify-center text-stone-400 hover:text-primary-600 hover:border-primary-600 cursor-pointer rounded transition-colors bg-stone-50">
                            <Plus size={20} />
                            <span className="text-[10px] mt-1 font-bold">ADD</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, (base64) => setFormProduct({ ...formProduct, images: [...formProduct.images, base64] }))}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-stone-50 rounded border border-stone-200">
                        <input 
                          type="checkbox" 
                          id="isFeatured"
                          className="w-5 h-5 accent-primary-600 cursor-pointer"
                          checked={formProduct.isFeatured} 
                          onChange={e => setFormProduct({...formProduct, isFeatured: e.target.checked})} 
                        />
                        <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer text-stone-900">Feature on Homepage</label>
                      </div>
                      
                      {/* Variations Section */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-xs uppercase font-bold text-stone-700">Variations</label>
                            <button type="button" onClick={() => setFormProduct({...formProduct, variations: [...formProduct.variations, {id: Date.now().toString(), name: 'New', price: formProduct.price, stock: 10}]})} className="text-primary-600 text-xs uppercase font-bold flex items-center gap-1 hover:bg-primary-50 px-2 py-1 rounded">+ Add Var</button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {formProduct.variations.map((v, idx) => (
                            <div key={v.id} className="flex gap-2 items-center bg-stone-50 p-2 rounded border border-stone-200">
                              <input value={v.name} onChange={e => {
                                const newVars = [...formProduct.variations]; newVars[idx].name = e.target.value;
                                setFormProduct({...formProduct, variations: newVars});
                              }} className="border p-2 w-1/3 rounded text-sm outline-none focus:border-primary-600" placeholder="Name (e.g. 50ml)" />
                              <input type="number" value={v.price} onChange={e => {
                                const newVars = [...formProduct.variations]; newVars[idx].price = Number(e.target.value);
                                setFormProduct({...formProduct, variations: newVars});
                              }} className="border p-2 w-1/4 rounded text-sm outline-none focus:border-primary-600" placeholder="Price" />
                              <input type="number" value={v.stock} onChange={e => {
                                const newVars = [...formProduct.variations]; newVars[idx].stock = Number(e.target.value);
                                setFormProduct({...formProduct, variations: newVars});
                              }} className="border p-2 w-1/4 rounded text-sm outline-none focus:border-primary-600" placeholder="Stock" />
                              <button type="button" onClick={() => setFormProduct({...formProduct, variations: formProduct.variations.filter((_, i) => i !== idx)})} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash size={16}/></button>
                            </div>
                          ))}
                        </div>
                      </div>
                   </div>
                 </div>
                 
                 {/* Description Blocks Editor */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-t pt-8">
                   <div>
                     <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-lg text-black">Rich Description (French)</h3>
                     </div>
                     {renderDescriptionEditor('fr')}
                   </div>
                   <div>
                     <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-lg text-black">Rich Description (Arabic)</h3>
                     </div>
                     {renderDescriptionEditor('ar')}
                   </div>
                 </div>

                 <button type="submit" className="w-full bg-secondary-900 text-white py-4 uppercase tracking-widest font-bold hover:bg-primary-600 transition-colors rounded shadow-lg">Save Product</button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* --- ORDER DETAILS MODAL (PRINTABLE) --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative printable-content text-stone-900">
             {/* Close Button (Hidden on print) */}
             <button 
               onClick={() => setSelectedOrder(null)} 
               className="absolute top-4 right-4 bg-stone-100 p-2 rounded-full hover:bg-stone-200 no-print text-stone-600 hover:text-black"
             >
               <X size={20} />
             </button>

             <div className="p-8">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b border-stone-100 pb-8 mb-8">
                  <div>
                    <h2 className="font-serif text-3xl font-bold mb-2 text-black">WAHIBASHOP</h2>
                    <p className="text-stone-400 text-sm">Invoice / Reçu de commande</p>
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-lg text-black">#{selectedOrder.id}</p>
                     <p className="text-stone-500 text-sm">{new Date(selectedOrder.date).toLocaleString()}</p>
                     <span className={`inline-block mt-2 px-3 py-1 rounded text-xs uppercase font-bold ${
                        selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                     }`}>
                        {selectedOrder.status}
                     </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Customer Info</h3>
                    <p className="font-bold text-lg mb-1 text-black">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                    <p className="flex items-center gap-2 text-stone-600 text-sm mb-1"><Mail size={14}/> {selectedOrder.customer.email}</p>
                    <p className="flex items-center gap-2 text-stone-600 text-sm"><Phone size={14}/> {selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Shipping Address</h3>
                    <div className="flex items-start gap-2 text-stone-800">
                       <MapPin size={16} className="mt-1 flex-shrink-0 text-primary-600"/>
                       <p className="leading-relaxed">{selectedOrder.customer.address}</p>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Order Items</h3>
                   <table className="w-full text-sm">
                     <thead className="bg-stone-50 border-y border-stone-100 text-stone-700">
                        <tr>
                           <th className="py-3 px-2 text-left">Product</th>
                           <th className="py-3 px-2 text-center">Qty</th>
                           <th className="py-3 px-2 text-right">Price</th>
                           <th className="py-3 px-2 text-right">Total</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-stone-100 text-stone-900">
                       {selectedOrder.items.map((item, idx) => (
                         <tr key={idx}>
                           <td className="py-4 px-2">
                             <p className="font-bold">{item.productName.fr}</p>
                             {item.variationName && <span className="text-xs text-stone-500 bg-stone-50 px-2 py-0.5 rounded">{item.variationName}</span>}
                           </td>
                           <td className="py-4 px-2 text-center font-mono">{item.quantity}</td>
                           <td className="py-4 px-2 text-right text-stone-500">${formatNumber(item.priceAtTime)}</td>
                           <td className="py-4 px-2 text-right font-bold">${formatNumber(item.priceAtTime * item.quantity)}</td>
                         </tr>
                       ))}
                     </tbody>
                     <tfoot className="border-t-2 border-stone-100 text-black">
                       <tr>
                         <td colSpan={3} className="pt-4 text-right font-bold text-lg">Total</td>
                         <td className="pt-4 px-2 text-right font-bold text-lg text-primary-600">${formatNumber(selectedOrder.total)}</td>
                       </tr>
                     </tfoot>
                   </table>
                </div>

                {/* Print Button Footer */}
                <div className="border-t border-stone-100 pt-6 flex justify-end gap-4 no-print">
                   <button 
                     onClick={() => window.print()}
                     className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors"
                   >
                     <Printer size={16} /> Print Invoice
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- IMAGE POSITIONING MODAL --- */}
      {positioningImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-stone-50">
              <h3 className="font-bold text-lg text-black flex items-center gap-2">
                <Move size={20} />
                {t('adjustImage')}
              </h3>
              <button 
                onClick={() => setPositioningImage(null)} 
                className="p-2 hover:bg-stone-200 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-hidden flex flex-col items-center justify-center bg-stone-900 relative">
               <p className="text-white/70 text-sm mb-4 flex items-center gap-2">
                 <Move size={16} /> {t('dragToAdjust')}
               </p>
               
               {/* Aspect Ratio Container (e.g., 16:9 for generic landscape) */}
               <div 
                 ref={imageContainerRef}
                 className="relative w-full aspect-video bg-black rounded shadow-2xl cursor-crosshair overflow-hidden border border-stone-700"
                 onMouseDown={handleMouseDown}
                 onMouseMove={handleMouseMove}
                 onMouseUp={handleMouseUp}
                 onMouseLeave={handleMouseUp}
               >
                 <img 
                   src={positioningImage.url} 
                   alt="Preview" 
                   className="w-full h-full object-cover pointer-events-none select-none transition-all duration-75"
                   style={{ objectPosition: `${cropPos.x}% ${cropPos.y}%` }}
                 />
                 
                 {/* Visual Guide: Rule of Thirds */}
                 <div className="absolute inset-0 pointer-events-none border-2 border-white/20 grid grid-cols-3 grid-rows-3">
                   {[...Array(9)].map((_, i) => <div key={i} className="border border-white/10"></div>)}
                 </div>

                 {/* Visual Guide: Center Crosshair */}
                 <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                       <div className="w-16 h-16 border-2 border-white/80 rounded-full shadow-lg"></div>
                       <div className="absolute w-20 h-[1px] bg-white/80"></div>
                       <div className="absolute w-[1px] h-20 bg-white/80"></div>
                       <div className="absolute w-2 h-2 bg-primary-600 rounded-full shadow"></div>
                    </div>
                 </div>
                 
                 {/* Coordinates Display */}
                 <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-mono pointer-events-none">
                   CENTER: {Math.round(cropPos.x)}% {Math.round(cropPos.y)}%
                 </div>
               </div>
               
               <div className="flex justify-end gap-4 w-full mt-6">
                 <button 
                   onClick={() => setPositioningImage(null)}
                   className="px-6 py-3 text-stone-500 hover:text-stone-300 font-bold uppercase text-xs tracking-widest"
                 >
                   {t('cancel')}
                 </button>
                 <button 
                   onClick={saveSliderImage}
                   className="bg-white text-black px-8 py-3 rounded font-bold uppercase text-xs tracking-widest hover:bg-primary-600 hover:text-white transition-colors"
                 >
                   {t('save')}
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}