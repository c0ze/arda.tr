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
 * A live local time readout for Tokyo, where this site is made. Sits in the
 * status bar as `JST hh:mm:ss`. Updates once a second.
 */
export function TokyoClock({ className = "" }: TokyoClockProps) {
  // Empty until mount, so the build's prerender bakes no clock time into the HTML.
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(tokyoNow());
    const id = window.setInterval(() => setTime(tokyoNow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} title="Local time in Tokyo">
      JST {time}
    </span>
  );
}

export default TokyoClock;
