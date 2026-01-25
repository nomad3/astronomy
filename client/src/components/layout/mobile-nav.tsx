"use client";

import { useState } from "react";
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
  Brain,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "AI Intelligence", href: "/intelligence", icon: Brain },
  { name: "Launches", href: "/launches", icon: Rocket },
  { name: "ISS Tracker", href: "/iss", icon: Satellite },
  { name: "Asteroids", href: "/asteroids", icon: Orbit },
  { name: "Space Weather", href: "/weather", icon: CloudSun },
  { name: "Mars", href: "/mars", icon: Globe },
  { name: "Gallery", href: "/gallery", icon: Image },
  { name: "Telescopes", href: "/telescopes", icon: Telescope },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-xl px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Rocket className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Cosmos</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <nav
        className={cn(
          "lg:hidden fixed top-14 right-0 z-50 h-[calc(100vh-3.5rem)] w-64 bg-black/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-1 p-3 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
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
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-4">
            <div className="rounded-lg bg-white/5 p-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-gray-400">Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
