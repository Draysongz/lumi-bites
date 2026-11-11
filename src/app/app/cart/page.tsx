"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/format";
import { lookupDishImage } from "@/lib/images";
import { SPICE_OPTIONS, SIDE_OPTIONS } from "@/lib/menu-options";

type CartItem = {
  id: string;
  quantity: number;
  unitKobo: number;
  spice: string | null;
  sides: string | null;
  note: string | null;
  menuItem: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
};

const PACKAGING_KOBO = 50_000; // ₦500 thermal packaging
const DISPATCH_KOBO = 150_000; // ₦1,500 rider fee

function spiceLabel(id: string | null) {
  if (!id) return null;
  return SPICE_OPTIONS.find((s) => s.id === id)?.name ?? id;
}

function sidesLabel(ids: string | null) {
  if (!ids) return null;
  const list = ids.split(",").map((i) => i.trim()).filter(Boolean);
  return list
    .map((id) => SIDE_OPTIONS.find((s) => s.id === id)?.name ?? id)
    .join(", ");
}

export default function CartCheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delivery form state.
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");

  const loadCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to load cart");
      const data = (await res.json()) as { items: CartItem[] };
      setItems(data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const itemsSubtotal = items.reduce((sum, i) => sum + i.unitKobo * i.quantity, 0);
  const fees = PACKAGING_KOBO + DISPATCH_KOBO;
  const total = itemsSubtotal + fees;

  async function updateQuantity(item: CartItem, quantity: number) {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItemId: item.id, quantity }),
    });
    if (res.ok) {
      const data = (await res.json()) as { items: CartItem[] };
      setItems(data.items);
    }
  }

  async function removeItem(item: CartItem) {
    await updateQuantity(item, 0);
  }

  async function confirmAndPay() {
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      // 1. Create the order (server recomputes totals from menu + sides).
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            menuItemId: i.menuItem.id,
            quantity: i.quantity,
            spice: i.spice ?? undefined,
            sides: i.sides ? i.sides.split(",") : undefined,
            note: i.note ?? undefined,
          })),
          recipientName,
          recipientPhone,
          address,
          landmark,
        }),
      });
      if (!orderRes.ok) {
        const e = (await orderRes.json()) as { error?: string };
        throw new Error(e.error || "Failed to place order");
      }
      const { order } = (await orderRes.json()) as { order: { id: string } };

      // 2. Mint payment instructions for this order.
      const payRes = await fetch(`/api/orders/${order.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!payRes.ok) {
        const e = (await payRes.json()) as { error?: string };
        throw new Error(e.error || "Failed to initialize payment");
      }
      const pay = (await payRes.json()) as {
        accountNumber?: string;
        bankName?: string;
        amountNaira?: number;
      };

      // 3. Clear the server cart.
      await fetch("/api/cart", { method: "DELETE" });

      // 4. Route to tracking with the dynamic-account instructions.
      router.push(
        `/app/orders?pay=${encodeURIComponent(JSON.stringify(pay))}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center text-light-outline">
        Loading your cart…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-light-on-surface">
            Order Checkout &amp; Online Payment
          </h1>
          <p className="text-body-md text-light-outline">
            Review your fresh bites, set delivery location, and complete payment securely.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-label-sm font-label font-bold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          Chef Lumi Kitchen Active Today
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <span className="material-symbols-outlined text-6xl text-light-outline-variant">
            shopping_bag
          </span>
          <p className="font-headline text-headline-sm text-light-on-surface">
            Your cart is empty
          </p>
          <button
            onClick={() => router.push("/app")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-red text-white font-label text-label-lg font-black hover:brightness-110"
          >
            Browse Today&apos;s Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT: items + delivery */}
          <div className="col-span-12 lg:col-span-7 space-y-8">
            {/* Items */}
            <div className="bg-light-surface p-6 rounded-3xl border border-light-outline-variant/60 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-light-outline-variant/50 pb-4">
                <h2 className="font-headline text-headline-sm text-light-on-surface font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-red text-2xl">restaurant</span>
                  <span>Your Selected Bites ({items.length} {items.length === 1 ? "Item" : "Items"})</span>
                </h2>
                <button
                  onClick={() => router.push("/app")}
                  className="text-label-sm font-label text-brand-red font-bold hover:underline"
                >
                  + Add More Dishes
                </button>
              </div>

              {items.map((item) => {
                const img = item.menuItem.imageUrl ?? lookupDishImage(item.menuItem.name) ?? undefined;
                const spice = spiceLabel(item.spice);
                const sides = sidesLabel(item.sides);
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center justify-between p-4 rounded-2xl bg-light-surface-container-low border border-light-outline-variant/50"
                  >
                    <div className="flex gap-4 items-center min-w-0">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img}
                          alt={item.menuItem.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-light-outline-variant/50"
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-light-surface-container shrink-0 flex items-center justify-center text-light-outline-variant">
                          <span className="material-symbols-outlined text-3xl">restaurant</span>
                        </div>
                      )}
                      <div className="space-y-1 min-w-0">
                        <h3 className="font-headline text-headline-sm text-light-on-surface font-bold truncate">
                          {item.menuItem.name}
                        </h3>
                        {(spice || sides) && (
                          <p className="text-body-sm text-light-outline truncate">
                            {spice && (
                              <>
                                Spice: <strong className="text-light-on-surface">{spice}</strong>
                              </>
                            )}
                            {spice && sides && " • "}
                            {sides && (
                              <>
                                Side: <strong className="text-light-on-surface">{sides}</strong>
                              </>
                            )}
                          </p>
                        )}
                        <span className="font-headline text-headline-sm text-brand-red font-bold block pt-1">
                          {formatNaira(item.unitKobo * item.quantity)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <button
                        aria-label="Remove item"
                        onClick={() => removeItem(item)}
                        className="text-light-outline hover:text-brand-red transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                      <div className="flex items-center border border-light-outline-variant rounded-xl bg-light-surface px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-light-outline hover:text-light-on-surface active:scale-95"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="w-7 text-center font-bold text-label-md">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-light-outline hover:text-light-on-surface active:scale-95"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery */}
            <div className="bg-light-surface p-6 rounded-3xl border border-light-outline-variant/60 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-light-outline-variant/50 pb-4">
                <h2 className="font-headline text-headline-sm text-light-on-surface font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-red text-2xl">local_shipping</span>
                  <span>Delivery Address &amp; Recipient Info</span>
                </h2>
                <span className="text-label-sm text-light-outline">Thermal dispatch within 35-45 mins</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md font-label text-light-on-surface mb-1 font-bold">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Chukwudi Okafor"
                    className="w-full px-4 py-2.5 rounded-xl border border-light-outline-variant bg-light-surface text-light-on-surface text-body-md focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-label-md font-label text-light-on-surface mb-1 font-bold">
                    Phone Number (For Rider Call)
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="0814 892 4430"
                    className="w-full px-4 py-2.5 rounded-xl border border-light-outline-variant bg-light-surface text-light-on-surface text-body-md focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-label-md font-label text-light-on-surface mb-1 font-bold">
                    Delivery Street Address (Lagos)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat 4B, 18 Admiralty Way, Lekki Phase 1"
                    className="w-full px-4 py-2.5 rounded-xl border border-light-outline-variant bg-light-surface text-light-on-surface text-body-md focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-label-md font-label text-light-on-surface mb-1 font-bold">
                    Gate / Landmark Directions
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite the blue gate near the pharmacy, call upon arrival"
                    className="w-full px-4 py-2.5 rounded-xl border border-light-outline-variant bg-light-surface text-light-on-surface text-body-md focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: payment + summary */}
          <div className="col-span-12 lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            {/* Payment method */}
            <div className="bg-light-surface p-6 rounded-3xl border border-light-outline-variant/60 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-light-outline-variant/50 pb-3">
                <h2 className="font-headline text-headline-sm text-light-on-surface font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-red text-2xl">payment</span>
                  <span>Pay Online</span>
                </h2>
                <span className="text-label-sm font-label text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-xs">lock</span> 100% Encrypted
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-brand-red bg-light-primary-container/20">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-brand-red text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-2xl">account_balance</span>
                  </div>
                  <div>
                    <span className="font-headline text-label-lg text-light-on-surface font-bold block">
                      Bank Transfer
                    </span>
                    <span className="text-body-sm text-light-outline">
                      Instant virtual account via Flutterwave
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-brand-red text-2xl">check_circle</span>
              </div>

              <div className="p-3 bg-light-surface-container rounded-xl flex items-center justify-between text-body-sm text-light-outline">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-emerald-600 text-base">verified_user</span>
                  Bank Grade 256-Bit SSL
                </span>
                <span className="font-bold text-light-on-surface">GTBank • Access • Zenith</span>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-light-surface p-6 rounded-3xl border border-light-outline-variant/60 shadow-sm space-y-4">
              <h2 className="font-headline text-headline-sm text-light-on-surface font-bold">
                Payment Summary
              </h2>

              <div className="space-y-3 text-body-sm">
                <div className="flex items-center justify-between text-light-outline">
                  <span>Items Subtotal ({items.length} {items.length === 1 ? "Dish" : "Dishes"})</span>
                  <span className="font-medium text-light-on-surface text-body-md">
                    {formatNaira(itemsSubtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-light-outline">
                  <span>Thermal Insulated Packaging</span>
                  <span className="font-medium text-light-on-surface text-body-md">
                    {formatNaira(PACKAGING_KOBO)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-light-outline">
                  <span>Dispatch Fee (Lekki Phase 1)</span>
                  <span className="font-medium text-light-on-surface text-body-md">
                    {formatNaira(DISPATCH_KOBO)}
                  </span>
                </div>

                <div className="border-t border-light-outline-variant/60 pt-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-headline text-headline-sm text-light-on-surface font-bold block">
                      Total Amount to Pay
                    </span>
                    <span className="text-body-sm text-light-outline">Inclusive of all local taxes</span>
                  </div>
                  <span className="font-display text-3xl font-black text-brand-red">
                    {formatNaira(total)}
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-body-sm text-error font-bold">{error}</p>
              )}

              <button
                onClick={confirmAndPay}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-brand-red text-white font-label text-label-lg font-black hover:brightness-110 active:scale-98 transition-state-change shadow-lg shadow-brand-red/30 text-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-2xl">lock</span>
                <span>
                  {submitting ? "Processing…" : `Confirm & Pay Online (${formatNaira(total)})`}
                </span>
              </button>

              <p className="text-center text-body-sm text-light-outline pt-1">
                Orders are freshly cooked upon payment. Track your meal live right after checkout.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
