/** Money formatter — whole-dollar, matching the prototype (`$1,234`). */
export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export const FREE_FREIGHT_THRESHOLD = 750;
export const FLAT_FREIGHT = 85;

/** Freight is free at/over the threshold, flat below it, zero on an empty cart. */
export const freightFor = (subtotal: number) =>
  subtotal > 0 && subtotal < FREE_FREIGHT_THRESHOLD ? FLAT_FREIGHT : 0;
