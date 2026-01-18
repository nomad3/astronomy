"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Rocket,
  Globe,
  Orbit,
  CloudSun,
  Image,
  Telescope,
  Satellite,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Launches", href: "/launches", icon: Rocket },
  { name: "ISS Tracker", href: "/iss", icon: Satellite },
  { name: "Asteroids", href: "/asteroids", icon: Orbit },
  { name: "Space Weather", href: "/weather", icon: CloudSun },
  { name: "Mars", href: "/mars", icon: Globe },
  { name: "Gallery", href: "/gallery", icon: Image },
  { name: "Telescopes", href: "/telescopes", icon: Telescope },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Cosmos</h1>
            <p className="text-xs text-gray-500">Space Explorer</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-gray-400">Systems Operational</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Data from NASA & SpaceDevs
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
