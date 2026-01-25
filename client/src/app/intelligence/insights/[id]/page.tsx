"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Insight, type SpaceNews } from "@/lib/api";
import { InsightTypeBadge } from "@/components/intelligence";
import { formatDate } from "@/lib/utils";
import {
  ChevronLeft,
  Lightbulb,
  Calendar,
  ExternalLink,
  FileText,
  BookOpen,
} from "lucide-react";

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

function ConfidenceDisplay({ score }: { score: number }) {
  const percentage = Math.round(score * 100);
  const color = score >= 0.8 ? "text-green-400" : score >= 0.6 ? "text-yellow-400" : "text-orange-400";
  const bgColor = score >= 0.8 ? "bg-green-500" : score >= 0.6 ? "bg-yellow-500" : "bg-orange-500";

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Confidence Score</span>
          <span className={`text-lg font-bold ${color}`}>{percentage}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${bgColor} rounded-full transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function InsightDetailPage() {
  const params = useParams();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      if (!params.id) return;

      setLoading(true);
      try {
        const data = await api.getInsightDetail(params.id as string);
        setInsight(data);
      } catch (err) {
        console.error("Failed to fetch insight:", err);
        setError("Failed to load insight details");
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (error || !insight) {
    return (
      <div className="space-y-6">
        <Link
          href="/intelligence/insights"
          className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Insights
        </Link>
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Lightbulb className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-xl font-semibold text-white mb-2">Insight not found</h2>
            <p className="text-gray-400">{error || "The requested insight could not be found."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link
        href="/intelligence/insights"
        className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Insights
      </Link>

      {/* Main insight card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <InsightTypeBadge type={insight.type} />
            <Badge className={categoryColors[insight.category] || categoryColors.other}>
              {insight.category}
            </Badge>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(insight.generated_at)}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">{insight.title}</h1>

          <p className="text-gray-300 text-lg mb-6">{insight.description}</p>

          <ConfidenceDisplay score={insight.confidence_score} />
        </CardContent>
      </Card>

      {/* Evidence section */}
      {insight.evidence && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-400" />
              AI Analysis & Evidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap">{insight.evidence}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related news */}
      {insight.related_news && insight.related_news.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              Related News Sources ({insight.related_news.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insight.related_news.map((news: SpaceNews) => (
                <div
                  key={news.id}
                  className="flex gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {news.source}
                      </Badge>
                      <Badge className={categoryColors[news.category] || categoryColors.other}>
                        {news.category}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-white truncate">{news.title}</h4>
                    {news.summary && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{news.summary}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{formatDate(news.published_at)}</span>
                      {news.url && (
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:underline"
                        >
                          View source
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ask about this insight */}
      <Card className="border-purple-500/30 bg-purple-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Have questions about this insight?
              </h3>
              <p className="text-sm text-gray-400">
                Chat with our AI assistant to learn more about this pattern and its implications.
              </p>
            </div>
            <Link
              href={`/intelligence/chat?q=${encodeURIComponent(`Tell me more about: ${insight.title}`)}`}
              className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
            >
              Ask AI
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
