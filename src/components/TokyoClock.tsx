import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Tokyo",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Current Tokyo wall-clock time formatted as HH:MM:SS (24-hour). */
function tokyoNow() {
  return formatter.format(new Date());
}

interface TokyoClockProps {
  className?: string;
}

/**
 * A live local time readout for Tokyo, set as a catalogue metadata field —
 * where this catalogue is published from. Updates once a second.
 */
export function TokyoClock({ className = "" }: TokyoClockProps) {
  const [time, setTime] = useState(tokyoNow);

  useEffect(() => {
    const id = window.setInterval(() => setTime(tokyoNow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={`cat-label text-muted-foreground ${className}`} title="Local time in Tokyo">
      TOKYO <span className="text-foreground">{time}</span> JST
    </span>
  );
}

export default TokyoClock;
