import type { Session, Message, Profile } from "./types";

type ConversationStep = "INTRO" | "CHECK_IN" | "EXPLORE" | "COPING" | "WRAP_UP" | "END";

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function extractKeywords(text: string): { emotions: string[]; topics: string[] } {
  const lowerText = text.toLowerCase();

  const emotionWords = ["stressed", "anxious", "worried", "overwhelmed", "frustrated", "sad", "tired", "angry", "scared", "confused", "lonely", "upset", "nervous"];
  const emotions = emotionWords.filter(word => lowerText.includes(word));

  const topicWords = {
    work: ["work", "job", "boss", "colleague", "deadline", "project"],
    school: ["school", "uni", "university", "class", "exam", "assignment", "study", "grade"],
    relationships: ["friend", "family", "partner", "relationship", "parent", "spouse"],
  };

  const topics: string[] = [];
  Object.entries(topicWords).forEach(([topic, words]) => {
    if (words.some(word => lowerText.includes(word))) {
      topics.push(topic);
    }
  });

  return { emotions, topics };
}

function isAskingForDiagnosis(text: string): boolean {
  const lowerText = text.toLowerCase();
  const diagnosisTerms = ["diagnose", "diagnosis", "do i have", "am i depressed", "am i anxious", "disorder", "condition", "what's wrong with me"];
  return diagnosisTerms.some(term => lowerText.includes(term));
}

function handleDiagnosisRequest(profile: Profile): string {
  if (profile.tone === "straightforward") {
    return "I can't diagnose or assess mental health conditions. That requires a trained professional who can evaluate your full situation. If you're concerned about your mental health, I'd encourage you to speak with a doctor or counselor who can properly help.";
  }
  return "I appreciate you trusting me with that question. However, I'm not able to diagnose or assess mental health conditions - that's something only a trained professional can do after getting to know your full situation. If you're concerned about what you're experiencing, talking with a doctor or counselor would be really valuable.";
}

function generateCheckInResponse(userText: string, profile: Profile): string {
  const { emotions, topics } = extractKeywords(userText);
  const emotion = emotions[0] || "challenged";

  const reflections = profile.tone === "straightforward"
    ? [`It sounds like you're dealing with ${emotion} feelings`, `You're experiencing some ${emotion} moments`]
    : [`I hear that you're feeling ${emotion}`, `That sounds really ${emotion}`, `It seems like things feel ${emotion} right now`];

  const questions = profile.style === "listening"
    ? ["What's been going through your mind?", "Tell me more about what's happening.", "What does that feel like for you?"]
    : ["What's been happening?", "Can you share more about that?", "What's contributing to these feelings?"];

  const reflection = getRandomItem(reflections);
  const question = getRandomItem(questions);

  if (profile.tone === "very_gentle") {
    return `${reflection}. I want you to know this is a safe space to share. ${question}`;
  }

  return `${reflection}. ${question}`;
}

function generateExploreResponse(userText: string, profile: Profile): string {
  const { emotions } = extractKeywords(userText);

  const validations = profile.tone === "straightforward"
    ? ["That makes sense given what you're dealing with", "I can see why that would be difficult", "That's a real challenge"]
    : ["That sounds really difficult", "I can understand why that would be hard", "What you're experiencing sounds challenging"];

  const specificPrompts = [
    "Can you think of a specific moment when you felt this way?",
    "When did you first start noticing these feelings?",
    "What tends to make it feel worse or better?",
    "How has this been affecting your day-to-day life?"
  ];

  const validation = getRandomItem(validations);
  const prompt = getRandomItem(specificPrompts);

  const bridge = profile.style === "listening"
    ? "I'm here to listen."
    : "I'd like to understand this better.";

  if (profile.tone === "very_gentle") {
    return `${validation}, and I really appreciate you sharing this with me. ${bridge} ${prompt}`;
  }

  return `${validation}. ${bridge} ${prompt}`;
}

function generateCopingResponse(userText: string, profile: Profile): string {
  const strategies = profile.style === "practical" ? [
    {
      action: "taking short breaks throughout the day",
      detail: "Even 5 minutes to step away can help reset your mind."
    },
    {
      action: "writing down your thoughts when they feel overwhelming",
      detail: "Getting them on paper can make them feel more manageable."
    },
    {
      action: "talking to someone you trust about what's going on",
      detail: "Sometimes just saying it out loud to another person helps."
    },
    {
      action: "focusing on one small thing you can control today",
      detail: "Breaking it down into smaller pieces can reduce the pressure."
    }
  ] : [
    {
      action: "noticing when these feelings come up and being gentle with yourself",
      detail: "Just recognizing them without judgment can make a difference."
    },
    {
      action: "taking a few deep breaths when things feel intense",
      detail: "It can help bring you back to the present moment."
    },
    {
      action: "doing something small that usually helps you feel grounded",
      detail: "Even a short walk or listening to music you like."
    }
  ];

  const strategy = getRandomItem(strategies);

  const intro = profile.tone === "straightforward"
    ? "Here's something that might help:"
    : "One thing you could try:";

  const question = profile.style === "listening"
    ? "What do you think about that?"
    : "Does that feel like something you could try?";

  return `${intro} ${strategy.action}. ${strategy.detail} ${question}`;
}

function generateWrapUpResponse(userText: string, profile: Profile, allMessages: Message[]): string {
  const userMessages = allMessages.filter(m => m.sender === "user");
  const hasSharedMultiple = userMessages.length >= 3;

  const summaries = profile.tone === "straightforward" ? [
    "You've shared quite a bit about what you're going through",
    "From what you've told me, you're dealing with some real challenges"
  ] : [
    "I really appreciate you opening up and sharing what's been on your mind",
    "Thank you for trusting me with what you've been experiencing"
  ];

  const strengths = [
    "reaching out and talking about it is a positive step",
    "being willing to explore these feelings takes courage",
    "you're trying to understand and work through this"
  ];

  const questions = [
    "Is there anything else you'd like to talk about today?",
    "What else is on your mind?",
    "Is there something else you'd like to share?"
  ];

  const summary = getRandomItem(summaries);
  const strength = hasSharedMultiple ? getRandomItem(strengths) : "being here and sharing takes courage";
  const question = getRandomItem(questions);

  return `${summary}, and ${strength}. ${question}`;
}

function generateEndResponse(profile: Profile): string {
  const gratitude = profile.tone === "straightforward"
    ? "Thanks for sharing with me today."
    : "Thank you for opening up and being so honest with me today.";

  const validation = "What you've shared is valid, and I hope some of our conversation has been helpful.";

  const reminder = "Remember, this is just a support tool. For ongoing help, connecting with a counselor or therapist would be valuable.";

  const closing = profile.tone === "very_gentle"
    ? "Take good care of yourself."
    : "Take care.";

  return `${gratitude} ${validation} ${reminder} ${closing}`;
}

export function runCounsellorAgent(
  session: Session,
  messages: Message[],
  userText: string
): { replyText: string; newStep: ConversationStep } {
  const profile = session.profile;

  if (isAskingForDiagnosis(userText)) {
    return {
      replyText: handleDiagnosisRequest(profile),
      newStep: session.step as ConversationStep,
    };
  }

  const agentMessages = messages.filter((m) => m.sender === "agent");
  const agentCount = agentMessages.length;

  let newStep: ConversationStep;
  let replyText: string;

  if (agentCount === 2) {
    newStep = "EXPLORE";
    replyText = generateExploreResponse(userText, profile);
  } else if (agentCount === 3) {
    newStep = "COPING";
    replyText = generateCopingResponse(userText, profile);
  } else if (agentCount === 4) {
    newStep = "WRAP_UP";
    replyText = generateWrapUpResponse(userText, profile, messages);
  } else {
    newStep = "END";
    replyText = generateEndResponse(profile);
  }

  return { replyText, newStep };
}

const crisisKeywords = [
  "suicide",
  "kill myself",
  "end my life",
  "hurt myself",
  "self-harm",
  "self harm",
  "want to die",
  "better off dead",
];

export function checkForCrisisKeywords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return crisisKeywords.some((keyword) => lowerText.includes(keyword));
}

export function getCrisisResponse(): { replyText: string; newStep: ConversationStep } {
  return {
    replyText: `I'm really sorry you're feeling this way. I'm just an AI support tool and can't help in emergencies. Please contact local emergency services or a crisis line immediately:

• Emergency services: 911 (US) or 999 (UK)
• National Suicide Prevention Lifeline: 988 (US)
• Crisis Text Line: Text HOME to 741741 (US)
• Samaritans: 116 123 (UK)

Your safety is the most important thing right now. Please reach out to one of these services - they have trained professionals who can help.`,
    newStep: "END",
  };
}
