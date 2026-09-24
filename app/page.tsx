"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Alert className="border-amber-500 bg-amber-50 text-amber-900 sticky top-0 z-50 rounded-none">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Research Prototype</AlertTitle>
        <AlertDescription>
          AI support tool, not a professional counsellor. Not for emergencies.
        </AlertDescription>
      </Alert>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            AI Support Tool Prototype
          </h1>
          <p className="text-lg text-slate-600">
            A prototype for structured supportive conversations
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About This Prototype</CardTitle>
            <CardDescription>
              Please read the limitations before trying the prototype
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">What is this?</h3>
              <p>
                This prototype explores a short, structured support conversation using a rule-based
                agent. It is designed for software evaluation, not mental health treatment.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Important Limitations</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>This is NOT a replacement for professional mental health care</li>
                <li>The AI cannot diagnose conditions or provide medical advice</li>
                <li>Do not use this tool for emergencies or crisis situations</li>
                <li>Messages may be stored in the configured Supabase project</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">What to expect</h3>
              <p>
                You’ll first answer a few questions to personalize your experience. Then you’ll
                have a brief conversation with the AI support tool. The entire session takes
                about 10-15 minutes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Your Privacy</h3>
              <p>
                Messages are stored in the configured Supabase project. When testing, do not enter
                names, contact details, health records, or other sensitive personal information.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">If You’re in Crisis</h3>
              <p className="text-red-800">
                If you’re experiencing a mental health emergency, please contact:
              </p>
              <ul className="list-disc list-inside text-red-800 mt-2">
                <li>Emergency services: 911 (US) or 999 (UK)</li>
                <li>National Suicide Prevention Lifeline: 988 (US)</li>
                <li>Samaritans: 116 123 (UK)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-slate-600 mb-4">
            By clicking &quot;Start&quot;, you acknowledge that this is a prototype and that messages may be
            stored in the configured database.
          </p>
          <Link href="/survey">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
              Start
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
