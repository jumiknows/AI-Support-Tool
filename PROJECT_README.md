# AI Counselling Support Tool - Research Prototype

A research prototype for an AI counselling-style support tool built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Overview

This application supports two experimental modes:
- **Text Mode**: Text-only chat interaction (baseline condition)
- **Avatar Mode**: Text chat with accompanying video avatar

## Project Structure

```
├── app/
│   ├── page.tsx                    # Landing page with consent information
│   ├── survey/page.tsx             # Personalization survey
│   ├── session/page.tsx            # Main counselling session interface
│   └── api/
│       └── session/
│           ├── start/route.ts      # Initialize new session
│           ├── message/route.ts    # Handle user messages
│           └── messages/route.ts   # Fetch session messages
├── components/
│   ├── ChatPanel.tsx               # Message display component
│   ├── VideoPanel.tsx              # Video avatar display
│   └── InputBar.tsx                # Message input component
├── lib/
│   ├── supabase.ts                 # Supabase client and types
│   └── counsellor-agent.ts         # Rule-based counsellor logic
└── public/
    └── videos/                     # Video files for avatar mode
        └── README.md               # Video file requirements
```

## Key Features

### 1. Consent & Onboarding
- Clear research disclosure
- Persistent warning banner on all pages
- Crisis resource information

### 2. Personalization Survey
Five questions to customize the interaction:
- Preferred tone (very gentle, neutral, straightforward)
- Main stress area (school/uni, work, relationships, other)
- Session style (listening, practical, mix)
- Comfort with silence (pauses ok, quick replies)
- Addressing style (first name, no name, nicknames)

### 3. Conversation Flow
The system progresses through conversation steps:
- **INTRO**: Initial greeting
- **CHECK_IN**: Active listening and reflection
- **EXPLORE**: Encouraging elaboration
- **COPING**: Suggesting coping strategies
- **WRAP_UP**: Summarizing and closing
- **END**: Session complete

### 4. Crisis Detection
Monitors for crisis keywords and provides immediate resources:
- Suicide-related terms
- Self-harm mentions
- Emergency contact information

### 5. Data Persistence
- Sessions and messages stored in Supabase
- Conversation logs written to `logs/{sessionId}.json`
- Profile preferences maintained throughout session

## Database Schema

### Sessions Table
- `id`: Unique session identifier
- `mode`: "text" or "avatar"
- `profile`: JSONB containing survey answers
- `step`: Current conversation step
- `created_at`, `updated_at`: Timestamps

### Messages Table
- `id`: Unique message identifier
- `session_id`: Foreign key to sessions
- `sender`: "user" or "agent"
- `text`: Message content
- `step`: Step when message was sent
- `created_at`: Timestamp

## API Endpoints

### POST /api/session/start
Initialize a new session with survey answers.

**Request:**
```json
{
  "surveyAnswers": {
    "tone": "neutral",
    "focus": "work",
    "style": "mix",
    "pace": "quick_replies",
    "address": "no_name"
  },
  "mode": "text"
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "mode": "text"
}
```

### POST /api/session/message
Send a user message and receive counsellor response.

**Request:**
```json
{
  "sessionId": "uuid",
  "text": "I'm feeling stressed about work"
}
```

**Response:**
```json
{
  "replyText": "It sounds like you're feeling challenged...",
  "step": "EXPLORE"
}
```

### GET /api/session/messages
Retrieve all messages for a session.

**Query:** `?sessionId=uuid`

**Response:**
```json
{
  "messages": [...],
  "step": "EXPLORE"
}
```

## Counsellor Agent Logic

The rule-based agent (`lib/counsellor-agent.ts`) provides:
- Reflective listening responses
- Step-appropriate prompts
- Tone adaptation based on user preferences
- Random variation to avoid repetitiveness
- Crisis intervention when needed

## Video Requirements

For avatar mode to work properly, add these MP4 files to `public/videos/`:
- `intro.mp4` - Initial greeting
- `listening.mp4` - Active listening
- `empathy.mp4` - Empathetic responses
- `advice.mp4` - Coping strategies
- `closing.mp4` - Session wrap-up

## Development

The application is ready to run. All API routes are implemented with proper error handling and logging.

## Important Disclaimers

This is a **research prototype** and:
- Is NOT a replacement for professional mental health care
- Cannot diagnose conditions or provide medical advice
- Should NOT be used for emergencies or crisis situations
- Is for research and evaluation purposes only

## Next Steps

To enhance this prototype:
1. Add real video files for avatar mode
2. Replace rule-based agent with LLM integration
3. Implement proper user authentication
4. Add session analytics and research metrics
5. Enhance logging for research analysis
6. Add session timeout and completion tracking
