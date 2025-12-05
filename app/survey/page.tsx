"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const questions = [
  {
    id: "tone",
    question: "What tone would you prefer?",
    options: [
      { value: "very_gentle", label: "Very gentle" },
      { value: "neutral", label: "Neutral" },
      { value: "straightforward", label: "Straightforward" },
    ],
  },
  {
    id: "focus",
    question: "What's your main stress area?",
    options: [
      { value: "school_uni", label: "School/uni" },
      { value: "work", label: "Work" },
      { value: "relationships", label: "Relationships" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "style",
    question: "What session style do you prefer?",
    options: [
      { value: "listening", label: "Just listening" },
      { value: "practical", label: "Practical suggestions" },
      { value: "mix", label: "Mix of both" },
    ],
  },
  {
    id: "pace",
    question: "How do you feel about silence in conversation?",
    options: [
      { value: "pauses_ok", label: "I like pauses" },
      { value: "quick_replies", label: "I prefer quick replies" },
    ],
  },
  {
    id: "address",
    question: "How should the counsellor address you?",
    options: [
      { value: "first_name", label: "Use my first name" },
      { value: "no_name", label: "No name" },
      { value: "nicknames_ok", label: "Nicknames OK" },
    ],
  },
];

export default function SurveyPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allQuestionsAnswered = questions.every((q) => answers[q.id]);

  const handleSubmit = async () => {
    if (!allQuestionsAnswered) return;

    setIsSubmitting(true);
    try {
      const mode = Math.random() < 0.5 ? "text" : "avatar";

      const response = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyAnswers: answers,
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start session");
      }

      const data = await response.json();
      router.push(`/session?sessionId=${data.sessionId}&mode=${data.mode}`);
    } catch (error) {
      console.error("Error starting session:", error);
      alert("Failed to start session. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Alert className="border-amber-500 bg-amber-50 text-amber-900 sticky top-0 z-50 rounded-none">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Research Prototype</AlertTitle>
        <AlertDescription>
          AI support tool, not a professional counsellor. Not for emergencies.
        </AlertDescription>
      </Alert>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Personalization Survey
          </h1>
          <p className="text-slate-600">
            Help us customize your experience by answering a few questions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Preferences</CardTitle>
            <CardDescription>
              Please answer all questions to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {questions.map((q, index) => (
              <div key={q.id} className="space-y-3">
                <Label className="text-base font-semibold text-slate-900">
                  {index + 1}. {q.question}
                </Label>
                <RadioGroup
                  value={answers[q.id] || ""}
                  onValueChange={(value) => handleAnswerChange(q.id, value)}
                >
                  {q.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${q.id}-${option.value}`} />
                      <Label
                        htmlFor={`${q.id}-${option.value}`}
                        className="font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered || isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800"
                size="lg"
              >
                {isSubmitting ? "Starting Session..." : "Continue to Session"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
