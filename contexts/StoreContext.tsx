import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  writeBatch,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";
import {
  Product,
  Order,
  ContactMessage,
  ClientResult,
  HeroImage,
  Testimonial,
} from "../types";
import {
  SEED_PRODUCTS,
  DEFAULT_HERO_IMAGES,
  SEED_CLIENT_RESULTS,
  SEED_TESTIMONIALS,
} from "../constants";

interface StoreContextType {
  products: Product[];
  orders: Order[];
  messages: ContactMessage[];
  sliderImages: HeroImage[];
  clientResults: ClientResult[];
  testimonials: Testimonial[];

  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;

  addMessage: (msg: ContactMessage) => Promise<void>;

  addSliderImage: (img: HeroImage) => Promise<void>;
  removeSliderImage: (index: number) => Promise<void>;

  addClientResult: (result: ClientResult) => Promise<void>;
  removeClientResult: (id: string) => Promise<void>;

  addTestimonial: (testi: Testimonial) => Promise<void>;
  removeTestimonial: (id: string) => Promise<void>;

  resetStore: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [sliderImages, setSliderImages] = useState<HeroImage[]>([]);
  const [clientResults, setClientResults] = useState<ClientResult[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const seedCollection = async (collectionName: string, data: any[]) => {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty && data.length > 0) {
      const batch = writeBatch(db);
      data.forEach((item) => {
        const id = item.id || `${Date.now()}-${Math.random()}`;
        const docRef = doc(db, collectionName, id);
        batch.set(docRef, { ...item, id });
      });
      await batch.commit();
    }
  };

  useEffect(() => {
    const init = async () => {
      await seedCollection("products", SEED_PRODUCTS);
      await seedCollection("hero_images", DEFAULT_HERO_IMAGES);
      await seedCollection("client_results", SEED_CLIENT_RESULTS);
      await seedCollection("testimonials", SEED_TESTIMONIALS);
    };
    init();

    const unsubProducts = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map((d) => d.data() as Product));
    });

    const unsubOrders = onSnapshot(collection(db, "orders"), (snap) => {
      const ords = snap.docs.map((d) => d.data() as Order);
      setOrders(
        ords.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    });

    const unsubMessages = onSnapshot(collection(db, "messages"), (snap) => {
      const msgs = snap.docs.map((d) => d.data() as ContactMessage);
      setMessages(
        msgs.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    });

    const unsubHero = onSnapshot(collection(db, "hero_images"), (snap) => {
      setSliderImages(snap.docs.map((d) => d.data() as HeroImage));
    });

    const unsubClients = onSnapshot(collection(db, "client_results"), (snap) => {
      setClientResults(snap.docs.map((d) => d.data() as ClientResult));
    });

    const unsubTestimonials = onSnapshot(
      collection(db, "testimonials"),
      (snap) => {
        setTestimonials(snap.docs.map((d) => d.data() as Testimonial));
      }
    );

    return () => {
      unsubProducts();
      unsubOrders();
      unsubMessages();
      unsubHero();
      unsubClients();
      unsubTestimonials();
    };
  }, []);

  const addProduct = async (product: Product) => {
    await setDoc(doc(db, "products", product.id), product);
  };

  const updateProduct = async (product: Product) => {
    await setDoc(doc(db, "products", product.id), product);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
  };

  const addOrder = async (order: Order) => {
    await setDoc(doc(db, "orders", order.id), order);
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    await updateDoc(doc(db, "orders", id), { status });
  };

  const addMessage = async (msg: ContactMessage) => {
    await setDoc(doc(db, "messages", msg.id), msg);
  };

  const addSliderImage = async (img: HeroImage) => {
    const id = img.id || `${Date.now()}-${Math.random()}`;
    await setDoc(doc(db, "hero_images", id), { ...img, id });
  };

  // Admin uses index, so delete by index->id
  const removeSliderImage = async (index: number) => {
    const item = sliderImages[index];
    if (!item?.id) return;
    await deleteDoc(doc(db, "hero_images", item.id));
  };

  const addClientResult = async (result: ClientResult) => {
    await setDoc(doc(db, "client_results", result.id), result);
  };

  const removeClientResult = async (id: string) => {
    await deleteDoc(doc(db, "client_results", id));
  };

  const addTestimonial = async (testi: Testimonial) => {
    await setDoc(doc(db, "testimonials", testi.id), testi);
  };

  const removeTestimonial = async (id: string) => {
    await deleteDoc(doc(db, "testimonials", id));
  };

  const resetStore = async () => {
    if (
      !window.confirm(
        "WARNING: This will delete ALL data from Firestore. Are you sure?"
      )
    )
      return;

    const collections = [
      "products",
      "orders",
      "messages",
      "hero_images",
      "client_results",
      "testimonials",
    ];

    for (const colName of collections) {
      const snap = await getDocs(collection(db, colName));
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }

    window.location.reload();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        messages,
        sliderImages,
        clientResults,
        testimonials,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        addMessage,
        addSliderImage,
        removeSliderImage,
        addClientResult,
        removeClientResult,
        addTestimonial,
        removeTestimonial,
        resetStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
