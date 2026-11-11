// Lumi's Bites operates in Lagos (Africa/Lagos = fixed UTC+1, no DST).
// "Today" and menu dates are treated as civil dates in Lagos time,
// not UTC, so a menu for "11 November" is correct regardless of server TZ.

const LAGOS_OFFSET_MS = 60 * 60 * 1000; // +1 hour

/** Parse a YYYY-MM-DD string into the start of that civil day in Lagos (as UTC). */
export function lagosDayStart(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  // Midnight in Lagos = 23:00 UTC the previous day.
  return new Date(Date.UTC(y, m - 1, d) - LAGOS_OFFSET_MS);
}

/** Start (UTC) of "today" in Lagos. */
/** Start (UTC) of "today" in Lagos. */
export function lagosTodayStart(): Date {
  const lagosNow = nowInLagos();
  lagosNow.setUTCHours(0, 0, 0, 0);
  return new Date(lagosNow.getTime() - LAGOS_OFFSET_MS);
}
/** End (exclusive) of "today" in Lagos. */
export function lagosTodayEnd(): Date {
  return new Date(lagosTodayStart().getTime() + 24 * 60 * 60 * 1000);
}

/** A Date representing the current instant, but with the Lagos wall-clock fields. */
function nowInLagos(): Date {
  return new Date(Date.now() + LAGOS_OFFSET_MS);
}

/** Validate + normalize a YYYY-MM-DD input to a lagosDayStart Date, or throw. */
export function toDayStart(dateStr: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) throw new Error("Invalid date");
  const d = lagosDayStart(dateStr);
  if (isNaN(d.getTime())) throw new Error("Invalid date");
  return d;
}
