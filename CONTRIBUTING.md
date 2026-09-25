# Contributing

AI Support Tool is a research and portfolio prototype that can store conversation text. Keep changes reviewable and use synthetic data during development.

## Workflow

1. Start from the latest `main`.
2. Create one focused branch.
3. Add tests when practical for behavior changes.
4. Run the local checks.
5. Open a pull request and describe data, safety, and Supabase implications.

Example branches:

```text
feat/session-expiry
fix/server-only-supabase-client
docs/data-handling
refactor/conversation-state
```

## Local checks

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

Use only test credentials and synthetic conversation data.

## Pull requests

Use Conventional Commit-style titles such as:

```text
fix: keep service role key server-side
feat: add session deletion control
docs: clarify prototype limitations
```

Call out changes to:

- stored conversation data
- Supabase tables or policies
- authentication or authorization
- crisis-language handling
- diagnosis or medical-behavior boundaries
- environment variables

Prefer squash merge after CI passes.
