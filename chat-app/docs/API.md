---

# Chat API

This is the live API the frontend actually talks to. REST endpoints live under `/api`, and the Socket.IO server is at the host root.

## Base URLs

```text
REST:    https://frontend-task-chatapp.onrender.com/api
Socket:  https://frontend-task-chatapp.onrender.com
```

Health check is a bit special — it doesn’t use the `/api` prefix:

```text
GET https://frontend-task-chatapp.onrender.com/health
```

## Authentication

Login gives you a JWT. Stick it on protected REST calls like this:

```http
Authorization: Bearer <token>
```

For Socket.IO, pass the same token in the handshake:

```ts
io("https://frontend-task-chatapp.onrender.com", {
  auth: { token },
});
```

If you forget the token, the API currently replies with HTTP `400` and something like:

```json
{
  "error": {
    "message": "No token provided",
    "code": "NO_TOKEN"
  }
}
```

## REST endpoints

All the examples below use JSON bodies where relevant.

### `POST /auth/login`

Logs you in (or registers you) with a phone number.

Request:

```json
{
  "phone": "+15550108231",
  "name": "Demo User"
}
```

Response `200`:

```json
{
  "token": "<jwt>",
  "user": {
    "_id": "6a886025e5d6aac9752289eb",
    "name": "Demo User",
    "phone": "+15550108231",
    "createdAt": "2026-08-21T14:26:45.740Z"
  }
}
```

### `GET /auth/me`

Returns the user that matches the bearer token.

Response `200`:

```json
{
  "_id": "6a886025e5d6aac9752289eb",
  "name": "Demo User",
  "phone": "+15550108231",
  "createdAt": "2026-08-21T14:26:45.740Z"
}
```

### `GET /users/search?q=<term>`

Search users by name or phone.

Response `200`:

```json
[
  {
    "_id": "6a886049e5d6aac975228a9f",
    "name": "Demo Friend",
    "phone": "+15550108232"
  }
]
```

### `GET /conversations`

Returns the current user’s direct and group conversations.

Response `200`:

```json
{
  "data": []
}
```

### `POST /conversations`

Starts or opens a direct conversation.

Request:

```json
{
  "userId": "6a886049e5d6aac975228a9f"
}
```

Response `200`:

```json
{
  "_id": "6a88605ee5d6aac975228aef",
  "participants": [
    "6a886025e5d6aac9752289eb",
    "6a886049e5d6aac975228a9f"
  ],
  "createdAt": "2026-08-21T14:27:42.745Z"
}
```

### `GET /conversations/:id/messages?limit=20&before=<messageId>`

Fetches a page of message history. `before` is optional — use it to load older messages.

Response `200`:

```json
{
  "messages": [
    {
      "_id": "6a8860a3e5d6aac975228c7f",
      "conversation": "6a88605ee5d6aac975228aef",
      "sender": "6a886025e5d6aac9752289eb",
      "text": "Hello from the API check",
      "createdAt": "2026-08-21T14:28:51.889Z"
    }
  ],
  "hasMore": false
}
```

### `POST /messages`

Sends a message to a direct or group conversation.

Request:

```json
{
  "conversationId": "6a88605ee5d6aac975228aef",
  "text": "Hello!"
}
```

Response `200`:

```json
{
  "_id": "6a8860a3e5d6aac975228c7f",
  "conversation": "6a88605ee5d6aac975228aef",
  "sender": "6a886025e5d6aac9752289eb",
  "text": "Hello!",
  "createdAt": "2026-08-21T14:28:51.889Z"
}
```

Note: the API currently accepts pure whitespace and still returns `200`. The frontend trims the text and rejects empty messages before sending.

### `POST /conversations/group`

Creates a group. `participantIds` needs enough people so the group ends up with at least three members (including the creator).

Request:

```json
{
  "name": "Project Team",
  "participantIds": [
    "6a886049e5d6aac975228a9f",
    "6a886088e5d6aac975228c03"
  ]
}
```

Response `201`:

```json
{
  "_id": "6a886094e5d6aac975228c2d",
  "type": "group",
  "name": "Project Team",
  "createdBy": "6a886025e5d6aac9752289eb",
  "admins": ["6a886025e5d6aac9752289eb"],
  "participants": [
    {
      "_id": "6a886025e5d6aac9752289eb",
      "name": "Demo User",
      "phone": "+15550108231"
    }
  ],
  "createdAt": "2026-08-21T14:28:36.907Z",
  "updatedAt": "2026-08-21T14:28:36.907Z"
}
```

## Socket.IO events

Connect to the host root (not `/api`).

### `message:new`

Server → client. A new message arrives. The frontend drops it into the right conversation and dedupes by `_id`.

### `conversation:updated`

Server → client. Conversation metadata or group membership changed. Frontend refreshes the conversation list and the currently open chat.

### `message:send`

Client → server (optional acknowledgement callback):

```json
{
  "conversationId": "6a88605ee5d6aac975228aef",
  "text": "Hello!"
}
```

In practice the frontend still sends messages over REST so it can show the HTTP response right away. Socket.IO is mainly used for incoming real-time updates.

## Extra group endpoints

There are also routes for adding/removing people, promoting admins, and renaming groups. They’re in the Swagger file, but they’re outside the minimum scope for this assignment.

## A few things we noticed

- Swagger intentionally leaves out response bodies and status codes, so the examples above come from actual live requests.
- The documented `/api/health` route returns `404`. The real health endpoint is just `/health`.
- Missing auth comes back as `400 NO_TOKEN`.
- Whitespace-only messages are accepted by the API, so the frontend has to validate them.
