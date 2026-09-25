# AI Support Tool

A Next.js research prototype for structured supportive conversations.

The current conversation engine is rule-based. It adapts prompts to a short preference survey and stores prototype sessions in Supabase.

## Important

This is not a counsellor, medical service or emergency service.

Use synthetic data when testing the public project. Do not enter private health information, names, contact details or anything you would not want stored in a development database.

## Run it

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Set:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SHOW_RESEARCH_BUTTON=false
```

The service role key is server-only. Never expose it through a `NEXT_PUBLIC_` variable.

## Conversation stages

The rule-based flow has six stages:

1. intro
2. check-in
3. explore
4. coping
5. wrap-up
6. end

The prototype also checks for some crisis language and rejects diagnosis requests.

Those checks are limited. They are not a safety guarantee.

## Main code

| Path | Purpose |
| --- | --- |
| `app/` | Pages and API routes |
| `components/` | Chat, video and form UI |
| `lib/counsellor-agent.ts` | Rule-based conversation flow |
| `lib/supabase-admin.ts` | Server-only database client |
| `supabase/migrations/` | Database schema and policies |

## Data

Messages are stored in Supabase through server-side routes.

Apply the latest migrations before using a Supabase project. The current migrations remove the older anonymous table policies.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

GitHub Actions runs these checks on pull requests.

## Status

This is a research and portfolio prototype. It is not intended for clinical use.
