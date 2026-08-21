Here's a more natural, human-sounding rewrite of the docs:

---

## Routes

- `/` — landing page  
- `/login` — login / register form  
- `/chat` — the actual chat app (you need to be logged in)

## Running it locally

You’ll need **Node.js 22+** and npm.

```bash
npm install
npm run dev
```

The live version is here: [https://relay-tonmoy.vercel.app](https://relay-tonmoy.vercel.app)

By default it talks to the assignment backend. If you want to point it somewhere else, create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://frontend-task-chatapp.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

## Quick checks

```bash
npm run lint
npm run build
```

The build runs in Next.js Webpack mode so it stays reliable even in more restricted environments.

## Tech stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS v4
- Socket.IO client for real-time stuff
- Plain `fetch` + React state — kept the client intentionally simple

## API docs

Full API contract lives in [docs/API.md](./docs/API.md). It covers the actual request/response shapes we saw in production, auth, pagination, WebSocket events, status codes, and a few quirks we ran into.

## How it’s structured

- API client + response normalization → `src/lib/api.ts`
- Auth storage → `src/lib/auth.ts`
- Display helpers → `src/lib/format.ts`

The chat screen is split into a stateful orchestrator (`src/components/chat-app.tsx`) and smaller UI pieces under `src/components/chat/` (sidebar, message panel, modals, search, etc.). Login and landing pages are separate.

The API returns different shapes for direct chats vs group chats, so the client normalizes everything before it hits the UI. We also trim messages on the frontend because the live API currently accepts pure whitespace.

JWTs live in `sessionStorage` (this is a client-only take-home). They’re cleared on logout or when the session becomes invalid. Message text is never injected as raw HTML.

## Design choices

Went for a quiet paper background, dark ink text, green for actions, and a few small coral/warm accents. The landing page sticks to the core idea instead of the usual marketing sections. Chat UI focuses on readable bubbles, clear timestamps, sensible loading/empty/error states, and a small “new messages” indicator when you’re scrolled up in history.

## Known API quirks

- Swagger doesn’t include response schemas or status codes, so `docs/API.md` is based on what we actually observed.
- `/health` works at the root; `/api/health` returns 404.
- Missing auth comes back as `400 NO_TOKEN`.
- The API accepts whitespace-only messages — the frontend blocks them.

## If there was more time

Would like to add better group admin features, stronger e2e tests with mocked Socket.IO events, message virtualization for long histories, and a proper server-side session boundary for production.

## Deployment

Works fine on Vercel or any other Next.js host. Just set these as environment variables:

```env
NEXT_PUBLIC_API_URL=https://frontend-task-chatapp.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

Make sure the backend allows the frontend origin for both CORS and WebSocket connections.
