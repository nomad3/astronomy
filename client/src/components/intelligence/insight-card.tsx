"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Insight } from "@/lib/api";
import { InsightTypeBadge } from "./insight-type-badge";
import { formatDate } from "@/lib/utils";
import { Calendar, TrendingUp, ChevronRight } from "lucide-react";

interface InsightCardProps {
  insight: Insight;
  variant?: "default" | "compact" | "featured";
}

const categoryColors: Record<string, string> = {
  exoplanets: "bg-green-500/20 text-green-400 border-green-500/30",
  galaxies: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  nebulae: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  stars: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  solar_system: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cosmology: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  space_weather: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

function ConfidenceBar({ score }: { score: number }) {
  const percentage = Math.round(score * 100);
  const color = score >= 0.8 ? "bg-green-500" : score >= 0.6 ? "bg-yellow-500" : "bg-orange-500";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-10 text-right">{percentage}%</span>
    </div>
  );
}

export function InsightCard({ insight, variant = "default" }: InsightCardProps) {
  if (variant === "compact") {
    return (
      <Link href={`/intelligence/insights/${insight.id}`}>
        <div className="flex gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <InsightTypeBadge type={insight.type} showIcon={false} />
              <Badge className={categoryColors[insight.category] || categoryColors.other}>
                {insight.category}
              </Badge>
            </div>
            <p className="text-sm font-medium text-white truncate">{insight.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">{formatDate(insight.generated_at)}</span>
              <span className="text-xs text-gray-600">|</span>
              <span className="text-xs text-gray-400">{Math.round(insight.confidence_score * 100)}% confidence</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/intelligence/insights/${insight.id}`}>
        <Card className="p-6 hover:bg-white/5 transition-colors cursor-pointer group border-2 border-blue-500/30 bg-blue-500/5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <InsightTypeBadge type={insight.type} />
                <Badge className={categoryColors[insight.category] || categoryColors.other}>
                  {insight.category}
                </Badge>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {insight.title}
              </h3>

              <p className="text-gray-400 mb-4 line-clamp-3">{insight.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {formatDate(insight.generated_at)}
                </div>
                <div className="w-32">
                  <ConfidenceBar score={insight.confidence_score} />
                </div>
              </div>
            </div>

            <TrendingUp className="h-12 w-12 text-blue-400/30 flex-shrink-0" />
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/intelligence/insights/${insight.id}`}>
      <Card className="p-4 hover:bg-white/5 transition-colors cursor-pointer group h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <InsightTypeBadge type={insight.type} />
          <Badge className={categoryColors[insight.category] || categoryColors.other}>
            {insight.category}
          </Badge>
        </div>

        <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
          {insight.title}
        </h3>

        <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">{insight.description}</p>

        <div className="mt-auto">
          <div className="mb-2">
            <ConfidenceBar score={insight.confidence_score} />
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            {formatDate(insight.generated_at)}
          </div>
        </div>
      </Card>
    </Link>
  );
}
