import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Tokyo",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function tokyoNow() {
  return formatter.format(new Date());
}

interface TokyoClockProps {
  className?: string;
}

/**
 * A live local time readout for Tokyo — a small personal detail tying the page
 * to where Arda actually is. Updates once a second.
 */
export function TokyoClock({ className = "" }: TokyoClockProps) {
  const [time, setTime] = useState(tokyoNow);

  useEffect(() => {
    const id = window.setInterval(() => setTime(tokyoNow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-xs text-muted-foreground ${className}`}
      title="My local time in Tokyo"
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-glow-pulse rounded-full bg-glow-green" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-glow-green" />
      </span>
      <span className="tabular-nums tracking-tight">TOKYO {time}</span>
      <span className="text-muted-foreground/60">JST</span>
    </span>
  );
}

export default TokyoClock;
