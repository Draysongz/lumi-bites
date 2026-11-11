/** Format a kobo amount as a Naira string, e.g. 850000 → "₦8,500". */
export function formatNaira(kobo: number): string {
  const naira = kobo / 100;
  return "₦" + naira.toLocaleString("en-NG", { maximumFractionDigits: 0 });
}
