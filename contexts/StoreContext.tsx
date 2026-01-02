import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  writeBatch,
  getDocs,
  FirestoreError,
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

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

// Firestore doc ids cannot be empty, and should not contain "/".
const normalizeId = (maybeId: unknown) => {
  const id = typeof maybeId === "string" ? maybeId.trim() : "";
  if (!id) return makeId();
  return id.replaceAll("/", "-");
};

const humanFirestoreError = (e: unknown) => {
  const err = e as FirestoreError;
  if (err?.code) return `${err.code}: ${err.message}`;
  return String(e);
};

// ✅ Firestore does not allow undefined anywhere in the payload
const deepRemoveUndefined = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(deepRemoveUndefined);
  }
  if (value && typeof value === "object") {
    const out: any = {};
    Object.keys(value).forEach((k) => {
      const v = value[k];
      if (v === undefined) return;
      out[k] = deepRemoveUndefined(v);
    });
    return out;
  }
  return value;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [sliderImages, setSliderImages] = useState<HeroImage[]>([]);
  const [clientResults, setClientResults] = useState<ClientResult[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Prevent seeding multiple times (React StrictMode runs effects twice in dev)
  const didSeed = useRef(false);

  const seedCollection = async (collectionName: string, data: any[]) => {
    try {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);

      if (snapshot.empty && data.length > 0) {
        const batch = writeBatch(db);
        data.forEach((item) => {
          const id = normalizeId(item?.id);
          const docRef = doc(db, collectionName, id);
          const cleaned = deepRemoveUndefined({ ...item, id });
          batch.set(docRef, cleaned);
        });
        await batch.commit();
      }
    } catch (e) {
      console.error(`seedCollection("${collectionName}") failed:`, e);
      // Don’t block the app if seeding fails (rules may block it)
    }
  };

  useEffect(() => {
    const init = async () => {
      if (didSeed.current) return;
      didSeed.current = true;

      await seedCollection("products", SEED_PRODUCTS);
      await seedCollection("hero_images", DEFAULT_HERO_IMAGES);
      await seedCollection("client_results", SEED_CLIENT_RESULTS);
      await seedCollection("testimonials", SEED_TESTIMONIALS);
    };

    init();

    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snap) => setProducts(snap.docs.map((d) => d.data() as Product)),
      (err) => console.error("products onSnapshot error:", err)
    );

    const unsubOrders = onSnapshot(
      collection(db, "orders"),
      (snap) => {
        const ords = snap.docs.map((d) => d.data() as Order);
        setOrders(
          ords.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      },
      (err) => console.error("orders onSnapshot error:", err)
    );

    const unsubMessages = onSnapshot(
      collection(db, "messages"),
      (snap) => {
        const msgs = snap.docs.map((d) => d.data() as ContactMessage);
        setMessages(
          msgs.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      },
      (err) => console.error("messages onSnapshot error:", err)
    );

    const unsubHero = onSnapshot(
      collection(db, "hero_images"),
      (snap) => setSliderImages(snap.docs.map((d) => d.data() as HeroImage)),
      (err) => console.error("hero_images onSnapshot error:", err)
    );

    const unsubClients = onSnapshot(
      collection(db, "client_results"),
      (snap) => setClientResults(snap.docs.map((d) => d.data() as ClientResult)),
      (err) => console.error("client_results onSnapshot error:", err)
    );

    const unsubTestimonials = onSnapshot(
      collection(db, "testimonials"),
      (snap) => setTestimonials(snap.docs.map((d) => d.data() as Testimonial)),
      (err) => console.error("testimonials onSnapshot error:", err)
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
    try {
      const id = normalizeId((product as any)?.id);
      const payload = deepRemoveUndefined({ ...product, id });
      await setDoc(doc(db, "products", id), payload);
    } catch (e) {
      console.error("addProduct failed:", e);
      alert(`addProduct failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const id = normalizeId((product as any)?.id);
      const payload = deepRemoveUndefined({ ...product, id });
      await setDoc(doc(db, "products", id), payload, { merge: true });
    } catch (e) {
      console.error("updateProduct failed:", e);
      alert(`updateProduct failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const safeId = normalizeId(id);
      await deleteDoc(doc(db, "products", safeId));
    } catch (e) {
      console.error("deleteProduct failed:", e);
      alert(`deleteProduct failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
  };

  const addOrder = async (order: Order) => {
    try {
      const id = normalizeId((order as any)?.id);
      const payload = deepRemoveUndefined({ ...order, id });
      await setDoc(doc(db, "orders", id), payload);
    } catch (e) {
      console.error("addOrder failed:", e);
      alert(`addOrder failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    try {
      const safeId = normalizeId(id);
      const payload = deepRemoveUndefined({ status });
      await updateDoc(doc(db, "orders", safeId), payload);
    } catch (e) {
      console.error("updateOrderStatus failed:", e);
      alert(`updateOrderStatus failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
  };

  const addMessage = async (msg: ContactMessage) => {
    try {
      const id = normalizeId((msg as any)?.id);
      const payload = deepRemoveUndefined({ ...msg, id });
      await setDoc(doc(db, "messages", id), payload);
    } catch (e) {
      console.error("addMessage failed:", e);
      alert(`addMessage failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
  };

  const addSliderImage = async (img: HeroImage) => {
    try {
      const id = normalizeId((img as any)?.id);
      const payload = deepRemoveUndefined({ ...img, id });
      await setDoc(doc(db, "hero_images", id), payload);
    } catch (e) {
      console.error("addSliderImage failed:", e);
      alert(`addSliderImage failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
  };

  const removeSliderImage = async (index: number) => {
    try {
      const item = sliderImages[index];
      if (!item?.id) return;
      await deleteDoc(doc(db, "hero_images", normalizeId(item.id)));
    } catch (e) {
      console.error("removeSliderImage failed:", e);
      alert(`removeSliderImage failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
  };

  const addClientResult = async (result: ClientResult) => {
    try {
      const id = normalizeId((result as any)?.id);
      const payload = deepRemoveUndefined({ ...result, id });
      await setDoc(doc(db, "client_results", id), payload);
    } catch (e) {
      console.error("addClientResult failed:", e);
      alert(`addClientResult failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
  };

  const removeClientResult = async (id: string) => {
    try {
      await deleteDoc(doc(db, "client_results", normalizeId(id)));
    } catch (e) {
      console.error("removeClientResult failed:", e);
      alert(`removeClientResult failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
  };

  const addTestimonial = async (testi: Testimonial) => {
    try {
      const id = normalizeId((testi as any)?.id);
      const payload = deepRemoveUndefined({ ...testi, id });
      await setDoc(doc(db, "testimonials", id), payload);
    } catch (e) {
      console.error("addTestimonial failed:", e);
      alert(`addTestimonial failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
  };

  const removeTestimonial = async (id: string) => {
    try {
      await deleteDoc(doc(db, "testimonials", normalizeId(id)));
    } catch (e) {
      console.error("removeTestimonial failed:", e);
      alert(`removeTestimonial failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
  };

  const resetStore = async () => {
    if (!window.confirm("WARNING: This will delete ALL data from Firestore. Are you sure?")) return;

    try {
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
    } catch (e) {
      console.error("resetStore failed:", e);
      alert(`resetStore failed: ${humanFirestoreError(e)}\n\nOpen Console (F12) for details.`);
      throw e;
    }
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
