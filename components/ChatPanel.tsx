"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";

export interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  step: string;
}

interface ChatPanelProps {
  messages: Message[];
}

export default function ChatPanel({ messages }: ChatPanelProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            <p>Start the conversation by typing a message below.</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback
                className={
                  message.sender === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-700"
                }
              >
                {message.sender === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div
              className={`flex-1 space-y-1 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <div className="flex items-baseline gap-2 justify-between">
                <span
                  className={`text-sm font-semibold ${
                    message.sender === "user" ? "order-2" : "order-1"
                  }`}
                >
                  {message.sender === "user" ? "You" : "Counsellor"}
                </span>
                <span
                  className={`text-xs text-slate-500 ${
                    message.sender === "user" ? "order-1" : "order-2"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
