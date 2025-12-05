"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert as AlertTriangle, Download, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ChatPanel, { Message } from "@/components/ChatPanel";
import VideoPanel from "@/components/VideoPanel";
import InputBar from "@/components/InputBar";

type ConversationStep = "INTRO" | "CHECK_IN" | "EXPLORE" | "COPING" | "WRAP_UP" | "END";

const SHOW_RESEARCH_BUTTON = process.env.NEXT_PUBLIC_SHOW_RESEARCH_BUTTON === "true";

export default function SessionPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const mode = searchParams.get("mode") as "text" | "avatar";

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>("INTRO");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(mode === "avatar");

  useEffect(() => {
    if (!sessionId || !mode) {
      window.location.href = "/";
      return;
    }

    const initSession = async () => {
      try {
        const response = await fetch(`/api/session/messages?sessionId=${sessionId}`);
        if (!response.ok) {
          throw new Error("Failed to load session");
        }
        const data = await response.json();
        setMessages(data.messages);
        if (data.step) {
          setCurrentStep(data.step);
        }
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();
  }, [sessionId, mode]);

  const handleSendMessage = async (text: string) => {
    if (!sessionId || !text.trim() || isLoading) return;

    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toISOString(),
      step: currentStep,
    };

    setMessages((prev) => [...prev, tempUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/session/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          text: text.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: data.replyText,
        timestamp: new Date().toISOString(),
        step: data.step,
      };

      setMessages((prev) => [...prev.slice(0, -1), tempUserMessage, agentMessage]);
      setCurrentStep(data.step);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.slice(0, -1));
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadLog = async () => {
    if (!sessionId || isDownloading) return;

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/session/log?sessionId=${sessionId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch log");
      }

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `session-${sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading log:", error);
      alert("Failed to download log. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <Alert className="border-amber-500 bg-amber-50 text-amber-900 rounded-none flex-shrink-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <div>
              <AlertTitle>Research Prototype</AlertTitle>
              <AlertDescription>
                AI support tool, not a professional counsellor. Not for emergencies.
              </AlertDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Label htmlFor="video-mode" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              {videoEnabled ? (
                <>
                  <Video className="h-4 w-4" />
                  Video
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Text
                </>
              )}
            </Label>
            <Switch
              id="video-mode"
              checked={videoEnabled}
              onCheckedChange={setVideoEnabled}
            />
          </div>
        </div>
      </Alert>

      <div className="flex-1 flex flex-col overflow-hidden">
        {videoEnabled ? (
          <div className="flex-1 overflow-hidden">
            <VideoPanel mode={mode} step={currentStep} isListening={isLoading} showVideo={videoEnabled} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-white min-h-0">
            <div className="flex-1 overflow-hidden">
              <ChatPanel messages={messages} />
            </div>
          </div>
        )}
        <InputBar onSend={handleSendMessage} disabled={isLoading || currentStep === "END"} />
      </div>

      {isLoading && (
        <div className="fixed bottom-4 left-4 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg">
          Counsellor is thinking...
        </div>
      )}

      {SHOW_RESEARCH_BUTTON && (
        <Button
          onClick={handleDownloadLog}
          disabled={isDownloading}
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 bg-white shadow-lg"
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Downloading..." : "Download log (researcher)"}
        </Button>
      )}
    </div>
  );
}
