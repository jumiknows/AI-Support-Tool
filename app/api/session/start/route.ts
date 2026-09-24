import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { surveyAnswers, mode } = body;

    if (!surveyAnswers || !mode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (mode !== "text" && mode !== "avatar") {
      return NextResponse.json(
        { error: "Invalid mode. Must be 'text' or 'avatar'" },
        { status: 400 }
      );
    }

    const profile = {
      tone: surveyAnswers.tone || "",
      focus: surveyAnswers.focus || "",
      style: surveyAnswers.style || "",
      pace: surveyAnswers.pace || "",
      address: surveyAnswers.address || "",
    };

    const { data: session, error } = await supabase
      .from("sessions")
      .insert({
        mode,
        profile,
        step: "CHECK_IN",
      })
      .select()
      .maybeSingle();

    if (error || !session) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    const introMessage = "Hi, I'm glad you're here. My role is to listen and help you reflect on what's been stressing you out lately. I'm an AI-based support tool, not a professional counsellor, so I can't give diagnoses or handle emergencies. But we can talk through what's on your mind and look for small ways to make things feel a bit more manageable.";

    const checkInMessage = "To start, I'd like to check in. When you think about the last few days or weeks, what has been weighing on you the most? You can share as much or as little as you feel comfortable with.";

    const { error: messageError } = await supabase
      .from("messages")
      .insert([
        {
          session_id: session.id,
          sender: "agent",
          text: introMessage,
          step: "INTRO",
        },
        {
          session_id: session.id,
          sender: "agent",
          text: checkInMessage,
          step: "CHECK_IN",
        }
      ]);

    if (messageError) {
      console.error("Failed to create intro messages:", messageError);
    }

    return NextResponse.json({
      sessionId: session.id,
      mode: session.mode,
    });
  } catch (error) {
    console.error("Error in /api/session/start:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
