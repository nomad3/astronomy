"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type ChatMessage, type ChatResponse } from "@/lib/api";
import { Send, Bot, User, ExternalLink, Sparkles, RotateCcw } from "lucide-react";

interface Message extends ChatMessage {
  sources?: ChatResponse["sources"];
  isLoading?: boolean;
}

interface ChatInterfaceProps {
  initialSuggestions?: string[];
}

export function ChatInterface({ initialSuggestions = [] }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSuggestions.length === 0) {
      api.getChatSuggestions()
        .then(setSuggestions)
        .catch(console.error);
    }
  }, [initialSuggestions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const query = text || input.trim();
    if (!query || isLoading) return;

    const userMessage: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "", isLoading: true }]);
    setInput("");
    setIsLoading(true);

    try {
      const history: ChatMessage[] = messages.map(({ role, content }) => ({ role, content }));
      const response = await api.sendChatMessage(query, history);

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: response.response,
          sources: response.sources,
          isLoading: false,
        };
        return newMessages;
      });
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          isLoading: false,
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="p-4 rounded-full bg-purple-500/20 mb-4">
              <Sparkles className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Space Science AI Assistant
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Ask me about recent discoveries, space science patterns, or anything related to NASA news and telescope observations.
            </p>

            {suggestions.length > 0 && (
              <div className="w-full max-w-lg">
                <p className="text-sm text-gray-500 mb-3">Suggested questions:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.slice(0, 4).map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(suggestion)}
                      className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          messages.map((message, i) => (
            <div
              key={i}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
            >
              {message.role === "assistant" && (
                <div className="p-2 rounded-full bg-purple-500/20 h-fit flex-shrink-0">
                  <Bot className="h-4 w-4 text-purple-400" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-blue-500/20 text-white"
                    : "bg-white/5"
                }`}
              >
                {message.isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ) : (
                  <>
                    <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>

                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-700">
                        <p className="text-xs text-gray-500 mb-2">Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source) => (
                            <a
                              key={source.id}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-blue-400 transition-colors"
                            >
                              {source.title.slice(0, 40)}
                              {source.title.length > 40 && "..."}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {message.role === "user" && (
                <div className="p-2 rounded-full bg-blue-500/20 h-fit flex-shrink-0">
                  <User className="h-4 w-4 text-blue-400" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              title="New conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}

          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about space science..."
              className="w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none text-white placeholder-gray-500"
              rows={1}
              disabled={isLoading}
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
