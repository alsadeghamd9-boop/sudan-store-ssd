"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
export type CartItem = { id: number; name: string; slug: string; price: number; imageUrl: string | null; stock: number; quantity: number };
type StoreContextType = { items: CartItem[]; add: (product: Omit<CartItem, "quantity">) => void; setQuantity: (id: number, qty: number) => void; remove: (id: number) => void; clear: () => void; count: number };
const StoreContext = createContext<StoreContextType | null>(null);
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { try { const saved = localStorage.getItem("sudan-store-cart"); if (saved) setItems(JSON.parse(saved)); } catch { localStorage.removeItem("sudan-store-cart"); } setLoaded(true); }, []);
  useEffect(() => { if (loaded) localStorage.setItem("sudan-store-cart", JSON.stringify(items)); }, [items, loaded]);
  const value = useMemo<StoreContextType>(() => ({
    items,
    add: (p) => setItems((current) => { const found = current.find((x) => x.id === p.id); return found ? current.map((x) => x.id === p.id ? { ...x, quantity: Math.min(x.quantity + 1, x.stock) } : x) : [...current, { ...p, quantity: 1 }]; }),
    setQuantity: (id, qty) => setItems((current) => current.map((x) => x.id === id ? { ...x, quantity: Math.min(Math.max(1, qty), x.stock) } : x)),
    remove: (id) => setItems((current) => current.filter((x) => x.id !== id)), clear: () => setItems([]), count: items.reduce((sum, x) => sum + x.quantity, 0)
  }), [items]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore() { const value = useContext(StoreContext); if (!value) throw new Error("useStore must be used inside StoreProvider"); return value; }
