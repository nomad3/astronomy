"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type SpaceWeatherAlert } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { CloudSun, Sun, Zap, Shield, Radio, Waves, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

const getAlertIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("flare") || t.includes("flr")) return Sun;
  if (t.includes("cme")) return Zap;
  if (t.includes("radiation") || t.includes("rbe")) return Radio;
  if (t.includes("geomagnetic") || t.includes("gst")) return Waves;
  return Shield;
};

const getAlertColor = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("flare") || t.includes("flr")) return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" };
  if (t.includes("cme")) return { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" };
  if (t.includes("radiation") || t.includes("rbe")) return { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" };
  if (t.includes("geomagnetic") || t.includes("gst")) return { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" };
  return { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30" };
};

export default function WeatherPage() {
  const [alerts, setAlerts] = useState<SpaceWeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSpaceWeather()
      .then(setAlerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const alertTypes = [...new Set(alerts.map(a => a.messageType))];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Space Weather</h1>
          <p className="text-gray-400">Solar activity and geomagnetic conditions</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-5 w-1/3 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <CloudSun className="h-7 w-7 text-purple-400" />
            Space Weather
          </h1>
          <p className="text-gray-400 mt-1">
            Solar activity and geomagnetic conditions from NASA DONKI
          </p>
        </div>
        {alerts.length === 0 && (
          <Badge variant="success" className="text-base px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            All Clear
          </Badge>
        )}
      </div>

      {/* Info Section - At the top */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="pt-6">
            <Sun className="h-6 w-6 text-red-400 mb-2" />
            <h4 className="font-medium text-white">Solar Flares</h4>
            <p className="text-sm text-gray-400 mt-1">
              Intense bursts of radiation from the Sun&apos;s surface
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="pt-6">
            <Zap className="h-6 w-6 text-amber-400 mb-2" />
            <h4 className="font-medium text-white">CMEs</h4>
            <p className="text-sm text-gray-400 mt-1">
              Coronal Mass Ejections - plasma clouds from the Sun
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="pt-6">
            <Radio className="h-6 w-6 text-purple-400 mb-2" />
            <h4 className="font-medium text-white">Radiation Belts</h4>
            <p className="text-sm text-gray-400 mt-1">
              Enhanced particle radiation in Earth&apos;s magnetosphere
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <Waves className="h-6 w-6 text-blue-400 mb-2" />
            <h4 className="font-medium text-white">Geomagnetic Storms</h4>
            <p className="text-sm text-gray-400 mt-1">
              Disturbances in Earth&apos;s magnetic field
            </p>
          </CardContent>
        </Card>
      </div>

      {alerts.length === 0 ? (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-6 rounded-full bg-emerald-500/10 mb-4">
              <Shield className="h-12 w-12 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-400">No Active Alerts</h2>
            <p className="text-gray-400 mt-2 max-w-md">
              Space weather conditions are currently calm. No significant solar activity
              or geomagnetic disturbances have been detected.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-400" />
                Current Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400">Total Alerts</p>
                  <p className="text-3xl font-bold text-white mt-1">{alerts.length}</p>
                </div>
                {alertTypes.slice(0, 3).map((type) => {
                  const count = alerts.filter(a => a.messageType === type).length;
                  const colors = getAlertColor(type);
                  const Icon = getAlertIcon(type);
                  return (
                    <div key={type} className={`p-4 rounded-lg ${colors.bg}`}>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Icon className={`h-4 w-4 ${colors.text}`} />
                        {type}
                      </div>
                      <p className={`text-3xl font-bold mt-1 ${colors.text}`}>{count}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Alert List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <AlertCard key={alert.messageID} alert={alert} />
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function AlertCard({ alert }: { alert: SpaceWeatherAlert }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = getAlertIcon(alert.messageType);
  const colors = getAlertColor(alert.messageType);

  // Parse the message body to extract key information
  const messageBody = alert.messageBody || "";
  const lines = messageBody.split("\n").filter(line => line.trim());

  // Get a summary (first few meaningful lines)
  const summaryLines = lines.slice(0, 3);
  const hasMore = lines.length > 3;

  // Extract any key-value pairs from the message
  const extractedData: { label: string; value: string }[] = [];
  lines.forEach(line => {
    // Look for patterns like "Label: Value" or "Label = Value"
    const match = line.match(/^([A-Za-z\s]+)[:=]\s*(.+)$/);
    if (match && match[1].length < 30) {
      extractedData.push({ label: match[1].trim(), value: match[2].trim() });
    }
  });

  return (
    <div className={`rounded-lg ${colors.bg} border ${colors.border} overflow-hidden`}>
      {/* Header - always visible */}
      <div
        className="p-4 cursor-pointer hover:bg-black/10 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-black/20 flex-shrink-0">
            <Icon className={`h-5 w-5 ${colors.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                  {alert.messageType}
                </Badge>
                <span className="text-sm text-gray-500">
                  {formatDateTime(alert.messageIssueTime)}
                </span>
              </div>
              <button className="p-1 hover:bg-white/10 rounded transition-colors">
                {expanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>

            {/* Summary preview */}
            {!expanded && summaryLines.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-300 line-clamp-2">
                  {summaryLines.join(" ").substring(0, 200)}
                  {summaryLines.join(" ").length > 200 && "..."}
                </p>
                {hasMore && (
                  <span className="text-xs text-gray-500 mt-1 inline-block">
                    Click to expand
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/10">
          {/* Key data points if available */}
          {extractedData.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 mb-4">
              {extractedData.slice(0, 6).map((item, idx) => (
                <div key={idx} className="p-2 rounded bg-black/20">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm text-white font-mono truncate">{item.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Full message body */}
          <div className="mt-4 p-4 rounded-lg bg-black/30">
            <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Full Report
            </h5>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
              {messageBody || "No detailed information available."}
            </pre>
          </div>

          {/* External link */}
          {alert.messageURL && (
            <div className="mt-4 flex items-center justify-between">
              <a
                href={alert.messageURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                View on NASA DONKI
                <ExternalLink className="h-4 w-4" />
              </a>
              <span className="text-xs text-gray-500">
                ID: {alert.messageID}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
