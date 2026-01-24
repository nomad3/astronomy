"use client";

import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe2, Cloud, Star, Orbit } from "lucide-react";

interface CategoryFilterProps {
  selected: string | null;
  onChange: (category: string | null) => void;
}

const categories = [
  { id: null, label: "All", icon: Sparkles },
  { id: "exoplanets", label: "Exoplanets", icon: Globe2 },
  { id: "galaxies", label: "Galaxies", icon: Sparkles },
  { id: "nebulae", label: "Nebulae", icon: Cloud },
  { id: "stars", label: "Stars", icon: Star },
  { id: "solar_system", label: "Solar System", icon: Orbit },
];

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selected === category.id;

        return (
          <button
            key={category.id ?? "all"}
            onClick={() => onChange(category.id)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200
              ${isSelected
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <Icon className="h-3.5 w-3.5" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
