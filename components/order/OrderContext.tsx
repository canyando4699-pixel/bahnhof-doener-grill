'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export interface OrderItem {
  id: string;
  title: string;
  description?: string;
  price?: string;
  prices?: { klein: string; groß: string };
  qty: number;
}

interface OrderContextValue {
  items: OrderItem[];
  count: number;
  add: (item: Omit<OrderItem, 'qty'>) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => number;
}

const OrderContext = createContext<OrderContextValue | null>(null);

const STORAGE_KEY = 'bestellliste';

/* „7,50 €" → 7.5 — für die Summenberechnung */
export function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const loadedRef = useRef(false);

  /* Erst nach Mount aus localStorage laden → kein Hydration-Mismatch */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    loadedRef.current = true;
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: OrderContextValue['add'] = (item) =>
    setItems((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...item, qty: 1 }];
    });

  const dec = (id: string) =>
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    );

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  const has = (id: string) => items.find((i) => i.id === id)?.qty ?? 0;

  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <OrderContext.Provider value={{ items, count, add, dec, remove, clear, has }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder muss innerhalb von <OrderProvider> verwendet werden');
  return ctx;
}
