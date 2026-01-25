"use client";

import { Badge } from "@/components/ui/badge";
import { Link2, TrendingUp, HelpCircle, AlertTriangle } from "lucide-react";

type InsightType = "connection" | "trend" | "gap" | "anomaly";

interface InsightTypeBadgeProps {
  type: InsightType;
  showIcon?: boolean;
}

const typeConfig: Record<InsightType, { icon: typeof Link2; color: string; label: string }> = {
  connection: {
    icon: Link2,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    label: "Connection",
  },
  trend: {
    icon: TrendingUp,
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    label: "Trend",
  },
  gap: {
    icon: HelpCircle,
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    label: "Gap",
  },
  anomaly: {
    icon: AlertTriangle,
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    label: "Anomaly",
  },
};

export function InsightTypeBadge({ type, showIcon = true }: InsightTypeBadgeProps) {
  const config = typeConfig[type] || typeConfig.connection;
  const Icon = config.icon;

  return (
    <Badge className={config.color}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
