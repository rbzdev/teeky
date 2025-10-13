# Project-wide engineering & domain guidelines (Next.js / TypeScript / Prisma)

## Stack
- Framework: Next.js 15 (App Router) with TypeScript strict mode.
- UI: React Server Components where possible; client components only when interactivity/state is required.
- ORM: Prisma (MongoDB). Prefer explicit field names; keep models minimal and normalized enough for clarity.
- Styling: Tailwind CSS (utility-first). Co-locate component-specific styles; avoid arbitrary values when a token exists.
- Package manager: pnpm.

## Core Domain (Online Invitation App)
Primary entities we expect to model and their indicative fields (use as guidance, keep lean):
- User: id,phone, email, name, passwordHash, createdAt, updatedAt.
- Invitation (or Event): id, hostId (User), title, description, location, startsAt, endsAt, theme, visibility ('private'|'public'), status ('draft'|'active'|'archived'), createdAt, updatedAt.
- Guest: id, invitationId, name, email, status ('pending'|'accepted'|'declined'), token, respondedAt.
- RSVP / Response logic will usually be handled via Guest.status updates.
- Asset / Media (optional future): store only URLs + metadata, never raw binary in Mongo.

When adding models:
1. Prefer camelCase for field names; never abbreviate semantically important words.
2. Add @@index / @@unique only when required by queries or constraints (avoid premature indexing in MongoDB).
3. Always include createdAt (default now()) and updatedAt (@updatedAt) unless the record is immutable.

## Naming Conventions
- Files: kebab-case for route segments (`app/inv/[slug]/page.tsx`), PascalCase for React components, camelCase for functions & variables.
- Prisma models: PascalCase singular (User, Invitation, Guest).
- Environment variables: UPPER_SNAKE_CASE (e.g. DATABASE_URL, APP_BASE_URL).
- Commit messages: Conventional Commits (feat:, fix:, chore:, refactor:, docs:, test:, perf:).

## Folder Structure (Guidance)
app/
	(routes and server components)
lib/
	prisma/ (Prisma client helper)
	domain/ (pure domain logic, validation)
components/
	ui/ (reusable presentational components)
	invitations/ (feature-scoped components if needed)
scripts/ (one-off maintenance / generation scripts)

Avoid deep nesting unless clarity improves.

## React & Next.js Rules
- Server-first: default all components to server; add 'use client' only when using state, effects, context, event handlers, or browser-only APIs.
- Do not access process.env directly in client components—explicitly expose only required public vars prefixed with NEXT_PUBLIC_.
- Prefer Server Actions or route handlers for mutations; validate input (Zod or custom) before DB operations.
- Return typed objects (never raw Prisma entities with sensitive fields). Strip passwordHash and internal tokens.

## Error Handling
- Wrap database mutations in try/catch; log minimal context (no secrets). Re-throw sanitized errors for API responses.
- Use typed error helpers (e.g. createError('NOT_FOUND', 'Invitation not found')). Consider a small error enum if patterns emerge.

## Security & Privacy
- Never log credentials, tokens, or password hashes.
- Always hash passwords with a modern algorithm (bcrypt, argon2). Never store raw passwords.
- Token-like fields (guest access tokens) must be random (at least 128 bits of entropy base64 / hex) and indexed only if queried.
- Validate ownership: a user may access only invitations they host or those explicitly shared / public.
- Rate-limit public RSVP endpoints (future enhancement).
- Keep DATABASE_URL and secrets out of version control (.env*, already gitignored). Rotate leaked credentials immediately.
- Never explore or open .env* files without asking for permission first.

## Performance
- Avoid N+1 queries: use Prisma relations & select only needed fields.
- Use pagination / cursor for large guest lists (never fetch unbounded arrays to render).
- Memoize heavy pure computations; never memoize DB results unless a clear caching layer is introduced.

## Accessibility & UX
- Provide semantic markup (headings hierarchy, landmarks).
- All interactive elements must be keyboard accessible and have discernible text.
- Provide alt text for media; empty alt only for decorative icons.

## Internationalisation (Prep)
- Keep user-visible strings centralizable (e.g. a simple dictionary) to ease future i18n.

## Testing Strategy
- Unit: pure domain & utility functions in `lib/domain` or `lib/utils`.
- Integration: route handlers (mock env + seed minimal test data) — target critical flows: create invitation, send guest invite, submit RSVP.
- Contract: ensure API JSON shapes are stable (type exports or schema validation).
- Use Jest + Testing Library; aim for >80% coverage on critical paths.

## Prisma Usage Guidelines
- Always run `pnpm prisma format` before committing schema changes.
- After editing schema: `pnpm prisma generate` (and if Mongo DB shape must sync, `pnpm prisma db push`).
- Use `select` or `include` intentionally—never return wide objects to the client.
- Add a unique compound index only when query patterns demand it (e.g. `@@unique([invitationId, email])` on Guest if appropriate).

## Validation
- Prefer Zod (if added) for incoming payloads; fall back to manual guards if dependency minimization is preferred initially.
- Strip unexpected fields (fail closed) to reduce accidental persistence of unsafe data.

## Logging
- Keep logs structured (JSON-like when possible) for server actions & route handlers.
- No console.log in committed UI code except temporary debug (remove before merge).

## AI Assistant (Copilot) Directives
- When generating new code:
	- Do not expose secrets; use placeholders like <INVITE_TOKEN_PLACEHOLDER> when needed.
	- Follow the naming & domain guidelines above.
	- Prefer type-safe patterns; no implicit any.
	- Provide brief JSDoc on exported functions, especially in domain layer.
	- Avoid adding heavy dependencies without justification (prefer stdlib or lightweight libs).
- When asked for examples involving invitations or guests, ground them in the domain model above and redact sensitive fields.

## Style & Cleanliness
- Keep functions short (<40 LOC ideally). Extract helpers instead of adding inline complexity.
- Remove unused imports and dead code promptly.
- Prefer pure functions in domain logic; side-effects isolated to boundary layers (DB, network, file IO).

## Future Enhancements (Do not pre-implement without request)
- Email sending queue for invitations.
- Public invitation landing pages with SEO metadata.
- Guest self-service update portal.
- Analytics (view counts, RSVP funnels) — ensure anonymization.

---
These rules guide consistency, security, and scalability of the invitation creation platform. Keep additions minimal, purposeful, and aligned with domain clarity.
