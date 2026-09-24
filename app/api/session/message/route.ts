import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-admin";
import {
  runCounsellorAgent,
  checkForCrisisKeywords,
  getCrisisResponse,
} from "@/lib/counsellor-agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, text } = body;

    if (!sessionId || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const { data: existingMessages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    const { error: userMessageError } = await supabase
      .from("messages")
      .insert({
        session_id: sessionId,
        sender: "user",
        text: text.trim(),
        step: session.step,
      });

    if (userMessageError) {
      console.error("Error saving user message:", userMessageError);
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 }
      );
    }

    let replyText: string;
    let newStep: string;

    if (checkForCrisisKeywords(text)) {
      const crisisResponse = getCrisisResponse();
      replyText = crisisResponse.replyText;
      newStep = crisisResponse.newStep;
    } else {
      const agentResponse = runCounsellorAgent(
        session,
        existingMessages || [],
        text
      );
      replyText = agentResponse.replyText;
      newStep = agentResponse.newStep;
    }

    const { error: agentMessageError } = await supabase
      .from("messages")
      .insert({
        session_id: sessionId,
        sender: "agent",
        text: replyText,
        step: newStep,
      });

    if (agentMessageError) {
      console.error("Error saving agent message:", agentMessageError);
      return NextResponse.json(
        { error: "Failed to save agent response" },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("sessions")
      .update({ step: newStep, updated_at: new Date().toISOString() })
      .eq("id", sessionId);

    if (updateError) {
      console.error("Error updating session:", updateError);
    }

    return NextResponse.json({
      replyText,
      step: newStep,
    });
  } catch (error) {
    console.error("Error in /api/session/message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
