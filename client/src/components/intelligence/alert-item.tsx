"use client";

import Link from "next/link";
import { type Alert } from "@/lib/api";
import { InsightTypeBadge } from "./insight-type-badge";
import { formatDate } from "@/lib/utils";
import { Bell, BellOff, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

interface AlertItemProps {
  alert: Alert;
  onMarkSeen?: () => void;
}

const priorityColors = {
  low: "border-gray-500/30",
  medium: "border-yellow-500/30 bg-yellow-500/5",
  high: "border-red-500/30 bg-red-500/5",
};

export function AlertItem({ alert, onMarkSeen }: AlertItemProps) {
  const handleMarkSeen = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.markAlertSeen(alert.id);
      onMarkSeen?.();
    } catch (error) {
      console.error("Failed to mark alert as seen:", error);
    }
  };

  return (
    <Link href={alert.insight_id ? `/intelligence/insights/${alert.insight_id}` : "#"}>
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer hover:bg-white/5 ${
          priorityColors[alert.priority]
        } ${alert.seen ? "opacity-60" : ""}`}
      >
        <div className={`p-2 rounded-full ${
          alert.priority === "high" ? "bg-red-500/20" :
          alert.priority === "medium" ? "bg-yellow-500/20" : "bg-gray-500/20"
        }`}>
          <Bell className={`h-4 w-4 ${
            alert.priority === "high" ? "text-red-400" :
            alert.priority === "medium" ? "text-yellow-400" : "text-gray-400"
          }`} />
        </div>

        <div className="flex-1 min-w-0">
          {alert.insight && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <InsightTypeBadge type={alert.insight.type} showIcon={false} />
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  alert.priority === "high" ? "bg-red-500/20 text-red-400" :
                  alert.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-gray-500/20 text-gray-400"
                }`}>
                  {alert.priority} priority
                </span>
              </div>
              <p className="text-sm font-medium text-white truncate">
                {alert.insight.title}
              </p>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {alert.insight.description}
              </p>
            </>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">{formatDate(alert.created_at)}</span>
            {!alert.seen && (
              <span className="text-xs text-blue-400">New</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!alert.seen && (
            <button
              onClick={handleMarkSeen}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Mark as seen"
            >
              <BellOff className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </div>
      </div>
    </Link>
  );
}
