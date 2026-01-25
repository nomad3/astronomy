"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatInterface } from "@/components/intelligence";
import { MessageSquare, ChevronLeft } from "lucide-react";

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");

  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      <ChatInterface
        initialSuggestions={
          initialQuery
            ? [initialQuery]
            : undefined
        }
      />
    </Card>
  );
}

function ChatSkeleton() {
  return (
    <Card className="flex-1 flex flex-col overflow-hidden p-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
      <div className="border-t border-gray-800 pt-4">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </Card>
  );
}

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-4">
      {/* Header */}
      <div>
        <Link
          href="/intelligence"
          className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Intelligence
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="h-7 w-7 text-purple-400" />
          AI Chat Assistant
        </h1>
        <p className="text-gray-400 mt-1">
          Ask questions about recent space science discoveries and AI-detected patterns
        </p>
      </div>

      {/* Chat Interface */}
      <Suspense fallback={<ChatSkeleton />}>
        <ChatContent />
      </Suspense>
    </div>
  );
}
