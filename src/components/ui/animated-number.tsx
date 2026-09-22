"use client";

import { useEffect, useState } from "react";

export function AnimatedNumber({
  value,
  format,
  duration = 900,
}: {
  value: number;
  format: (value: number) => string;
  duration?: number;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const from = shown;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setShown(from + (value - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <span className="tabular-nums">{format(shown)}</span>;
}
