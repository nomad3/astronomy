"use client";

import { useEffect, useState } from "react";

export function Header() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZoneName: "short",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="hidden lg:flex sticky top-0 z-30 h-16 items-center justify-between border-b border-white/10 bg-black/50 backdrop-blur-xl px-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Mission Control</h2>
        <p className="text-sm text-gray-500">Real-time space data monitoring</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-mono text-white">{time}</p>
          <p className="text-xs text-gray-500">Mission Time</p>
        </div>
      </div>
    </header>
  );
}
