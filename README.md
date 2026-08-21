# Relay

Relay is split into two independently deployable Next.js applications:

- `landing-page/` — marketing page deployed at `https://relay-landing-page.vercel.app`
- `chat-app/` — login and chat application deployed at `https://relay-chat-app-two.vercel.app`

The landing page opens the chat app in a new tab. The chat app links back to the landing page in a new tab.

## Deploying with Vercel

Create two Vercel projects from the same repository and set each project’s **Root Directory**:

| Vercel project     | Root directory | Domain                          |
| ------------------ | -------------- | ------------------------------- |
| Relay Landing Page | `landing-page` | `relay-landing-page.vercel.app` |
| Relay Chat App     | `chat-app`     | `relay-chat-app-two.vercel.app`     |

For the chat app, configure these environment variables in Vercel:

```env
NEXT_PUBLIC_API_URL=https://frontend-task-chatapp.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

The API and Socket.IO service must allow the chat app’s Vercel domain through CORS and WebSocket settings.

## Local development

Run each app from its own directory:

```bash
cd landing-page
npm install
npm run dev
```

In another terminal:

```bash
cd chat-app
npm install
npm run dev
```
