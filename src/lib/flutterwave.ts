const BASE = "https://api.flutterwave.com/v3";

function secretKey(): string {
  const key = process.env.FLW_SECRET_KEY;
  if (!key) throw new Error("FLW_SECRET_KEY is not set");
  return key;
}

async function request<T>(
  path: string,
  method: "GET" | "POST" | "PUT" = "GET",
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await res.json()) as { status: string; message: string } & Record<
    string,
    unknown
  >;

  if (!res.ok || data.status === "error") {
    throw new Error(data.message || `Flutterwave request failed (${res.status})`);
  }

  return data as T;
}

export type FlwCustomer = {
  id: number;
  name: string;
  email: string;
};

export type FlwDynamicAccount = {
  account_number: string;
  bank_name: string;
  order_ref: string;
  flw_ref: string;
};

/** Create a Flutterwave customer (the entity a dynamic account is tied to). */
export async function createCustomer(input: {
  email: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ id: number }> {
  return request<{ data: { id: number } }>("/customers", "POST", {
    email: input.email,
    name: [input.firstName, input.lastName].filter(Boolean).join(" ") || input.email,
    phone_number: undefined,
  }).then((r) => r.data);
}

/**
 * Create a DYNAMIC (per-transaction, expiring) virtual account.
 * Ties to a `tx_ref` so the paying-transfer's webhook can match it back.
 */
export async function createDynamicAccount(input: {
  email: string;
  txRef: string;
  amountNaira: number;
}): Promise<FlwDynamicAccount> {
  return request<{ data: FlwDynamicAccount }>("/virtual-account-numbers", "POST", {
    email: input.email,
    is_permanent: false,
    tx_ref: input.txRef,
    amount: input.amountNaira,
    // NOTE: if Flutterwave rejects with a BVN/NIN requirement on this legacy
    // endpoint, switch to PWBT (POST /v3/pwbt) with account_type:"dynamic"+expiry.
  }).then((r) => r.data);
}

/** Initialize a card/USSD/bank-transfer checkout — Flutterwave takes naira, not kobo. */
export async function initializeTransaction(input: {
  email: string;
  amountKobo: number;
  reference: string;
  redirect_url?: string;
}) {
  return request<{ data: { link: string } }>("/payments", "POST", {
    tx_ref: input.reference,
    amount: Math.round(input.amountKobo / 100), // kobo → naira
    currency: "NGN",
    redirect_url: input.redirect_url || "http://localhost:3000/app",
    customer: { email: input.email },
    customizations: { title: "Lumi's Bites" },
  }).then((r) => r.data);
}

/**
 * Verify a Flutterwave webhook: compare the `verif-hash` header to FLW_SECRET_HASH.
 */
export function verifyWebhookSignature(_payload: string, signature: string): boolean {
  const hash = process.env.FLW_SECRET_HASH;
  if (!hash || !signature) return false;
  const a = Buffer.from(hash);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  try {
    return require("crypto").timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
