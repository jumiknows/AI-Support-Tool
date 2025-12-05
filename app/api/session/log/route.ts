import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId parameter" },
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

    const { data: messages, error: messagesError } = await supabase
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

    const logPath = join(process.cwd(), "logs", `${sessionId}.json`);
    let conversationLog = [];

    if (existsSync(logPath)) {
      try {
        const fileContent = readFileSync(logPath, "utf-8");
        conversationLog = JSON.parse(fileContent);
      } catch (err) {
        console.warn("Failed to read log file:", err);
      }
    }

    return NextResponse.json({
      sessionId: session.id,
      mode: session.mode,
      profile: session.profile,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
      finalStep: session.step,
      messages: messages || [],
      conversationLog,
    });
  } catch (error) {
    console.error("Error in /api/session/log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
