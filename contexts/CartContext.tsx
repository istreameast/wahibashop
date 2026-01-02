import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartItem } from "../types";

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variationId?: string | null) => void;

  updateQuantity: (
    productId: string,
    variationId: string | null | undefined,
    quantity: number
  ) => void;

  increaseQty: (productId: string, variationId?: string | null) => void;
  decreaseQty: (productId: string, variationId?: string | null) => void;

  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LS_KEY = "ls_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    const qtyToAdd = Math.max(1, item.quantity || 1);

    setCart((prev) => {
      const idx = prev.findIndex(
        (x) =>
          x.productId === item.productId &&
          (x.variationId || null) === (item.variationId || null)
      );

      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: (next[idx].quantity || 1) + qtyToAdd };
        return next;
      }
      return [...prev, { ...item, quantity: qtyToAdd }];
    });
  };

  const removeFromCart = (productId: string, variationId?: string | null) => {
    setCart((prev) =>
      prev.filter(
        (x) => !(x.productId === productId && (x.variationId || null) === (variationId || null))
      )
    );
  };

  const updateQuantity = (
    productId: string,
    variationId: string | null | undefined,
    quantity: number
  ) => {
    const q = Math.max(1, Math.floor(Number(quantity) || 1));

    setCart((prev) =>
      prev.map((x) => {
        if (x.productId === productId && (x.variationId || null) === (variationId || null)) {
          return { ...x, quantity: q };
        }
        return x;
      })
    );
  };

  const increaseQty = (productId: string, variationId?: string | null) => {
    setCart((prev) =>
      prev.map((x) => {
        if (x.productId === productId && (x.variationId || null) === (variationId || null)) {
          return { ...x, quantity: (x.quantity || 1) + 1 };
        }
        return x;
      })
    );
  };

  const decreaseQty = (productId: string, variationId?: string | null) => {
    setCart((prev) =>
      prev.map((x) => {
        if (x.productId === productId && (x.variationId || null) === (variationId || null)) {
          return { ...x, quantity: Math.max(1, (x.quantity || 1) - 1) };
        }
        return x;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.priceAtTime * (item.quantity || 1), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQty,
        decreaseQty,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
