// Best-effort in-memory fixed-window rate limiter (per server process). It
// blunts abuse on public write endpoints. NOTE: with ≥2 Fly machines the
// effective limit is per-machine; swap this store for Upstash Redis (Phase 4)
// if you need strict global limits.
type Hit = { count: number; reset: number };
const buckets = new Map<string, Hit>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  b.count++;
  if (b.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.max(1, Math.ceil((b.reset - now) / 1000)) };
  }
  return { ok: true, remaining: limit - b.count, retryAfter: 0 };
}

/** Best-effort client IP from proxy headers (Cloudflare → Fly → app). */
export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

// Opportunistic cleanup so the map can't grow unbounded.
if (typeof setInterval === "function") {
  setInterval(() => {
    const now = Date.now();
    buckets.forEach((v, k) => { if (now > v.reset) buckets.delete(k); });
  }, 60_000).unref?.();
}
