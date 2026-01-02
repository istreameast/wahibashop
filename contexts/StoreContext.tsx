import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, ContactMessage, ClientResult, HeroImage, Testimonial } from '../types';
import { SEED_PRODUCTS, DEFAULT_HERO_IMAGES, SEED_CLIENT_RESULTS, SEED_TESTIMONIALS } from '../constants';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  messages: ContactMessage[];
  sliderImages: HeroImage[];
  clientResults: ClientResult[];
  testimonials: Testimonial[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addMessage: (msg: ContactMessage) => void;
  addSliderImage: (img: HeroImage) => void;
  removeSliderImage: (index: number) => void;
  addClientResult: (result: ClientResult) => void;
  removeClientResult: (id: string) => void;
  addTestimonial: (testi: Testimonial) => void;
  removeTestimonial: (id: string) => void;
  resetStore: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [sliderImages, setSliderImages] = useState<HeroImage[]>([]);
  const [clientResults, setClientResults] = useState<ClientResult[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('ls_products');
      const storedOrders = localStorage.getItem('ls_orders');
      const storedMessages = localStorage.getItem('ls_messages');
      const storedSlider = localStorage.getItem('ls_slider_images');
      const storedClientResults = localStorage.getItem('ls_client_results');
      const storedTestimonials = localStorage.getItem('ls_testimonials');

      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(SEED_PRODUCTS);
      }

      if (storedOrders) setOrders(JSON.parse(storedOrders));
      if (storedMessages) setMessages(JSON.parse(storedMessages));
      
      if (storedSlider) {
        const parsedSlider = JSON.parse(storedSlider);
        // Backward compatibility check
        if (parsedSlider.length > 0 && typeof parsedSlider[0] === 'string') {
          // Convert string array to HeroImage objects
          const converted = parsedSlider.map((url: string, index: number) => ({
            id: `legacy-${index}`,
            url,
            position: '50% 50%'
          }));
          setSliderImages(converted);
        } else {
          setSliderImages(parsedSlider);
        }
      } else {
        setSliderImages(DEFAULT_HERO_IMAGES);
      }

      if (storedClientResults) {
        setClientResults(JSON.parse(storedClientResults));
      } else {
        setClientResults(SEED_CLIENT_RESULTS);
      }

      if (storedTestimonials) {
        setTestimonials(JSON.parse(storedTestimonials));
      } else {
        setTestimonials(SEED_TESTIMONIALS);
      }

    } catch (e) {
      console.error('Failed to parse storage', e);
      setProducts(SEED_PRODUCTS);
      setSliderImages(DEFAULT_HERO_IMAGES);
      setClientResults(SEED_CLIENT_RESULTS);
      setTestimonials(SEED_TESTIMONIALS);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('ls_products', JSON.stringify(products));
  }, [products, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('ls_orders', JSON.stringify(orders));
  }, [orders, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('ls_messages', JSON.stringify(messages));
  }, [messages, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('ls_slider_images', JSON.stringify(sliderImages));
  }, [sliderImages, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('ls_client_results', JSON.stringify(clientResults));
  }, [clientResults, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('ls_testimonials', JSON.stringify(testimonials));
  }, [testimonials, isInitialized]);

  const addProduct = (product: Product) => setProducts([...products, product]);
  
  const updateProduct = (updated: Product) => {
    setProducts(products.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addOrder = (order: Order) => setOrders([order, ...orders]);
  
  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const addMessage = (msg: ContactMessage) => setMessages([msg, ...messages]);

  const addSliderImage = (img: HeroImage) => setSliderImages([...sliderImages, img]);
  
  const removeSliderImage = (index: number) => {
    setSliderImages(sliderImages.filter((_, i) => i !== index));
  };

  const addClientResult = (res: ClientResult) => setClientResults([...clientResults, res]);
  const removeClientResult = (id: string) => setClientResults(clientResults.filter(r => r.id !== id));

  const addTestimonial = (testi: Testimonial) => setTestimonials([...testimonials, testi]);
  const removeTestimonial = (id: string) => setTestimonials(testimonials.filter(t => t.id !== id));

  const resetStore = () => {
    localStorage.clear();
    setProducts(SEED_PRODUCTS);
    setSliderImages(DEFAULT_HERO_IMAGES);
    setClientResults(SEED_CLIENT_RESULTS);
    setTestimonials(SEED_TESTIMONIALS);
    setOrders([]);
    setMessages([]);
    window.location.reload();
  };

  return (
    <StoreContext.Provider value={{ 
      products, orders, messages, sliderImages, clientResults, testimonials,
      addProduct, updateProduct, deleteProduct, 
      addOrder, updateOrderStatus, addMessage,
      addSliderImage, removeSliderImage,
      addClientResult, removeClientResult,
      addTestimonial, removeTestimonial,
      resetStore
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};