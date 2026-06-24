"use client";

import { useEffect, useRef } from "react";

/**
 * A muted, looping product clip that plays only while it's in view (and pauses
 * when scrolled away) — the Apple-store autoplay-on-scroll feel, without
 * hammering the browser with seven simultaneous videos.
 */
export default function StepVideo({
  src,
  poster,
  className = "",
  rounded = true,
}: {
  src: string;
  poster?: string;
  className?: string;
  rounded?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.35) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: [0, 0.35, 0.75] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      className={`${className} ${rounded ? "rounded-[20px]" : ""}`}
    />
  );
}
