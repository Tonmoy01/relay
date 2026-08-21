# Relay Chat App

This is the standalone Relay login and authenticated chat application.

## Environment variables

```env
NEXT_PUBLIC_API_URL=https://frontend-task-chatapp.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

## Local development

```bash
npm install
npm run dev
```

Deploy this folder as its own Vercel project with the domain:

`https://relay-chat-app.vercel.app`

The login screen links back to `https://relay-landing-page.vercel.app` in a new tab.
