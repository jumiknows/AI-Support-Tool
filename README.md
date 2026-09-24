# AI Support Tool

A Next.js prototype for structured supportive conversations with text and optional avatar modes.

The current agent is rule-based. It adapts prompts to a short preference survey and stores prototype sessions in Supabase.

## Important

This is not a counsellor, medical service, or emergency service.

Use synthetic test data when running the public project. Do not enter private health information, names, contact details, or anything you would not want stored in a development database.

## Run locally

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SHOW_RESEARCH_BUTTON=false
```

The service role key is server-only. Never prefix it with `NEXT_PUBLIC_` and never commit it.

## Main pieces

| Path | Purpose |
| --- | --- |
| `app/` | Pages and API routes |
| `components/` | Chat, video, input, and UI components |
| `lib/counsellor-agent.ts` | Rule-based conversation flow |
| `lib/supabase-admin.ts` | Server-only database client |
| `supabase/migrations/` | Database schema and access policies |

## Conversation flow

```text
INTRO → CHECK_IN → EXPLORE → COPING → WRAP_UP → END
```

The prototype includes keyword checks for crisis language and rejects diagnosis requests. These checks are limited and should not be treated as a safety guarantee.

## Data handling

Messages are stored in Supabase through server-side API routes.

Local conversation log files are not part of the current design and are ignored by Git.

Apply all migrations before using a real Supabase project. The latest migration removes the original anonymous table policies.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

GitHub Actions runs these checks on pull requests.

## Status

Research and portfolio prototype. It is not intended for real clinical use.
