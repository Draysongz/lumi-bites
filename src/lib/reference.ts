import crypto from "crypto";

/** Generate a collision-resistant Paystack transaction reference. */
export function generateReference(prefix = "LUMI"): string {
  const rand = crypto.randomBytes(6).toString("hex").toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}
