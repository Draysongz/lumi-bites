"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  id: string;
  quantity: number;
  unitKobo: number;
  spice: string | null;
  sides: string | null;
  note: string | null;
  dish: { id: string; name: string; imageUrl: string | null };
};

type CartContextValue = {
  items: CartLine[];
  count: number;
  totalKobo: number;
  loading: boolean;
  refresh: () => Promise<void>;
  add: (input: {
    dishId: string;
    quantity?: number;
    spice?: string;
    sides?: string[];
    note?: string;
  }) => Promise<void>;
  setQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = (await res.json()) as { items: CartLine[] };
        setItems(data.items);
      }
    } catch {
      // ignore transient failures; keep last-known state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (input: {
      dishId: string;
      quantity?: number;
      spice?: string;
      sides?: string[];
      note?: string;
    }) => {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      await refresh();
    },
    [refresh],
  );

  const setQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      if (res.ok) {
        const data = (await res.json()) as { items: CartLine[] };
        setItems(data.items);
      }
    },
    [],
  );

  const clear = useCallback(async () => {
    await fetch("/api/cart", { method: "DELETE" });
    setItems([]);
  }, []);

  const { count, totalKobo } = useMemo(() => {
    let count = 0;
    let totalKobo = 0;
    for (const it of items) {
      count += it.quantity;
      totalKobo += it.unitKobo * it.quantity;
    }
    return { count, totalKobo };
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({ items, count, totalKobo, loading, refresh, add, setQuantity, clear }),
    [items, count, totalKobo, loading, refresh, add, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
