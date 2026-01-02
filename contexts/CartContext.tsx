import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  writeBatch, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../firebase';
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
  removeSliderImage: (index: number) => void; // index is actually mapped to ID in firestore logic
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

  // Seed Data function: checks if a collection is empty, if so, populates it
  const seedCollection = async (collectionName: string, data: any[]) => {
    try {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty && data.length > 0) {
        const batch = writeBatch(db);
        data.forEach((item) => {
          // Use item.id as doc id if available, otherwise generate one?
          // Our seed data has 'id'.
          const docRef = doc(db, collectionName, item.id);
          batch.set(docRef, item);
        });
        await batch.commit();
        console.log(`Seeded ${collectionName}`);
      }
    } catch (e) {
      console.error(`Error seeding ${collectionName}:`, e);
    }
  };

  // Initialize and Subscribe to Firestore Collections
  useEffect(() => {
    // 1. Seed Data if necessary
    const initData = async () => {
      await seedCollection('products', SEED_PRODUCTS);
      await seedCollection('hero_images', DEFAULT_HERO_IMAGES);
      await seedCollection('client_results', SEED_CLIENT_RESULTS);
      await seedCollection('testimonials', SEED_TESTIMONIALS);
    };

    initData();

    // 2. Setup Real-time Listeners
    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      setProducts(snap.docs.map(d => d.data() as Product));
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      const ords = snap.docs.map(d => d.data() as Order);
      // Sort orders by date desc locally (or use query orderBy)
      setOrders(ords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });

    const unsubMessages = onSnapshot(collection(db, 'messages'), (snap) => {
      const msgs = snap.docs.map(d => d.data() as ContactMessage);
      setMessages(msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });

    const unsubHero = onSnapshot(collection(db, 'hero_images'), (snap) => {
      setSliderImages(snap.docs.map(d => d.data() as HeroImage));
    });

    const unsubClients = onSnapshot(collection(db, 'client_results'), (snap) => {
      setClientResults(snap.docs.map(d => d.data() as ClientResult));
    });

    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snap) => {
      setTestimonials(snap.docs.map(d => d.data() as Testimonial));
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubMessages();
      unsubHero();
      unsubClients();
      unsubTestimonials();
    };
  }, []);

  // --- ACTIONS ---

  const addProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (e) {
      console.error("Error adding product:", e);
    }
  };
  
  const updateProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product); // setDoc with merge:false overwrites, which is what we want for full update
    } catch (e) {
      console.error("Error updating product:", e);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.error("Error deleting product:", e);
    }
  };

  const addOrder = async (order: Order) => {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
    } catch (e) {
      console.error("Error adding order:", e);
    }
  };
  
  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
    } catch (e) {
      console.error("Error updating order status:", e);
    }
  };

  const addMessage = async (msg: ContactMessage) => {
    try {
      await setDoc(doc(db, 'messages', msg.id), msg);
    } catch (e) {
      console.error("Error adding message:", e);
    }
  };

  const addSliderImage = async (img: HeroImage) => {
    try {
      await setDoc(doc(db, 'hero_images', img.id), img);
    } catch (e) {
      console.error("Error adding slider image:", e);
    }
  };
  
  // Note: sliderImages is an array in state, but a collection in Firestore. 
  // 'index' works if we track ID. In Admin.tsx, we might need to adjust logic slightly if it passes index.
  // Ideally Admin.tsx should pass the ID. 
  // Looking at Admin.tsx: it iterates sliderImages.map((img, idx) => removeSliderImage(idx))
  // We need to fix this slightly to handle ID-based deletion in Firestore.
  const removeSliderImage = async (index: number) => {
    // Fallback: use index to find ID from current state
    if (sliderImages[index]) {
      try {
        await deleteDoc(doc(db, 'hero_images', sliderImages[index].id));
      } catch (e) {
        console.error("Error removing slider image:", e);
      }
    }
  };

  const addClientResult = async (result: ClientResult) => {
    try {
      await setDoc(doc(db, 'client_results', result.id), result);
    } catch (e) {
      console.error("Error adding client result:", e);
    }
  };

  const removeClientResult = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'client_results', id));
    } catch (e) {
      console.error("Error removing client result:", e);
    }
  };

  const addTestimonial = async (testi: Testimonial) => {
    try {
      await setDoc(doc(db, 'testimonials', testi.id), testi);
    } catch (e) {
      console.error("Error adding testimonial:", e);
    }
  };

  const removeTestimonial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (e) {
      console.error("Error removing testimonial:", e);
    }
  };

  const resetStore = async () => {
    if (window.confirm("WARNING: This will delete ALL data from the database and reset to defaults. Are you sure?")) {
      const collections = ['products', 'orders', 'messages', 'hero_images', 'client_results', 'testimonials'];
      for (const colName of collections) {
        const snap = await getDocs(collection(db, colName));
        const batch = writeBatch(db);
        snap.docs.forEach(d => batch.delete(d.ref));
        await batch.commit();
      }
      // Re-seed happens on page reload or by calling seed manually, simply reload to trigger useEffect
      window.location.reload();
    }
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
