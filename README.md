## Routes

- `/` — landing page.
- `/login` — login/register form.
- `/chat` — authenticated chat application.

## Run locally

Requirements: Node.js 22 or newer and npm.

```bash
npm install
npm run dev
```

Open the deployed app at [https://relay-tonmoy.vercel.app](https://relay-tonmoy.vercel.app).

The default API points to the assignment service. To use a different deployment, create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://frontend-task-chatapp.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

## Verification commands

```bash
npm run lint
npm run build
```

The build uses Next.js Webpack mode for reliable production verification in restricted environments.

## Tech stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS v4 utility classes for component styling
- Socket.IO client for real-time updates
- Native `fetch` and React state for a deliberately small client architecture

## API documentation

The API contract is documented in [docs/API.md](./docs/API.md). It includes the live request and response shapes, authentication, pagination, WebSocket events, status codes, and known API inconsistencies.

## Architecture notes

The application keeps the API client and response normalization in `src/lib/api.ts`, authentication storage in `src/lib/auth.ts`, and display formatting in `src/lib/format.ts`. The chat screen is split between the stateful `src/components/chat-app.tsx` orchestrator and reusable UI components in `src/components/chat/` for the sidebar, message panel, modals, search results, and shared controls. The login form and landing page remain separate UI surfaces.

The API returns different shapes for direct and group conversation list items, so the API client normalizes those responses before they reach the UI. The frontend trims messages before sending because the live API currently accepts whitespace-only messages.

JWTs are kept in `sessionStorage` for this client-only take-home application. They are cleared on logout or an invalid-session response. React-rendered message text is never inserted as raw HTML.

## Design decisions

The visual direction uses a quiet paper background, dark ink typography, green actions, and small coral/warm accents. The landing page intentionally focuses on the product’s core promise instead of adding generic marketing sections. The chat panel prioritizes readable message bubbles, clear timestamps, straightforward loading/empty/error states, and a small “new messages” affordance when the user is reading older history.

## Known API issues

- Swagger omits response schemas and status codes, so `docs/API.md` records observed live responses.
- `/health` works at the service root while `/api/health` returns `404`.
- Missing authentication returns `400 NO_TOKEN`.
- Whitespace-only messages are accepted by the API; the frontend prevents them.

## Improvements with more time

The next improvements would be richer group administration, stronger automated end-to-end coverage using mocked Socket.IO events, message virtualization for very large histories, and a server-side session boundary for a production deployment.

## Deployment

The frontend can be deployed to Vercel or another Next.js host. Configure the backend URLs as deployment environment variables:

```env
NEXT_PUBLIC_API_URL=https://frontend-task-chatapp.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

The API and Socket.IO service must remain reachable and allow the deployed frontend origin through CORS and WebSocket settings.
