"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ConversationStep = "INTRO" | "CHECK_IN" | "EXPLORE" | "COPING" | "WRAP_UP" | "END";

interface VideoPanelProps {
  mode: "text" | "avatar";
  step: ConversationStep;
  isListening?: boolean;
  showVideo?: boolean;
}

const videoMap: Record<ConversationStep, string> = {
  INTRO: "/videos/a.mp4",
  CHECK_IN: "/videos/b.mp4",
  EXPLORE: "/videos/c.mp4",
  COPING: "/videos/e.mp4",
  WRAP_UP: "/videos/f.mp4",
  END: "/videos/f.mp4",
};

export default function VideoPanel({ mode, step, isListening = false, showVideo }: VideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  const currentVideo = videoMap[step];
  const displayStep = step;
  const shouldShowVideo = showVideo !== undefined ? showVideo : mode === "avatar";

  useEffect(() => {
    if (shouldShowVideo && videoRef.current) {
      setHasError(false);
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay prevented:", err);
      });
    }
  }, [currentVideo, shouldShowVideo]);

  const handleVideoError = () => {
    console.error(`Failed to load video: ${currentVideo}`);
    setHasError(true);
  };

  if (!shouldShowVideo) {
    return (
      <Card className="h-full flex items-center justify-center bg-slate-50">
        <CardContent className="text-center py-12">
          <Video className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Text-only Condition
          </h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            This session is in text-only mode. You’ll receive text-based responses
            without visual avatar feedback.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-100 px-4 py-2 border-b flex items-center justify-between">
        <Badge variant="outline" className="text-xs font-mono">
          Step: {displayStep}
        </Badge>
        {isListening && (
          <span className="text-xs text-slate-600 animate-pulse">
            Listening...
          </span>
        )}
      </div>

      <Card className="flex-1 overflow-hidden rounded-none border-0">
        <CardContent className="p-0 h-full relative">
          {hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <div className="text-center p-8">
                <Video className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600">
                  Video unavailable
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {currentVideo}
                </p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              key={currentVideo}
              onError={handleVideoError}
            >
              <source src={currentVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
