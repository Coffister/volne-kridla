import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/content";

export interface CartItem {
  product: Product;
  variants: Record<string, string>; // e.g. { color: "Red", size: "L" }
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variants?: Record<string, string>, quantity?: number) => void;
  removeItem: (productId: string, variantKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantKey?: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "volne-kridla-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore localStorage errors
    }
  }, [items]);

  const variantKey = (variants: Record<string, string>) => JSON.stringify(variants);

  const addItem = (
    product: Product,
    variants: Record<string, string> = {},
    quantity: number = 1,
  ) => {
    setItems((prev) => {
      const key = variantKey(variants);
      const existing = prev.find((item) => item.product.id === product.id && variantKey(item.variants) === key);

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && variantKey(item.variants) === key
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...prev, { product, variants, quantity }];
    });
  };

  const removeItem = (productId: string, variantKey?: string) => {
    setItems((prev) =>
      prev.filter((item) => {
        if (item.product.id !== productId) return true;
        if (variantKey === undefined) return false;
        return variantKey !== JSON.stringify(item.variants);
      }),
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantKey?: string) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId) return item;
          if (variantKey !== undefined && variantKey !== JSON.stringify(item.variants)) return item;
          return quantity <= 0 ? null : { ...item, quantity };
        })
        .filter(Boolean) as CartItem[],
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
