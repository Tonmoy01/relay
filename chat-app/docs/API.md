# Chat API

This document records the live API used by the frontend. The service exposes REST endpoints under `/api` and a Socket.IO server at the host root.

## Base URLs

```text
REST:    https://frontend-task-chatapp.onrender.com/api
Socket:  https://frontend-task-chatapp.onrender.com
```

The health check is an exception to the REST prefix:

```text
GET https://frontend-task-chatapp.onrender.com/health
```

## Authentication

Login returns a JWT. Send it on protected REST requests:

```http
Authorization: Bearer <token>
```

For Socket.IO, pass the same token in the handshake:

```ts
io("https://frontend-task-chatapp.onrender.com", {
  auth: { token },
});
```

Unauthenticated requests currently return HTTP `400` with an error object such as:

```json
{
  "error": {
    "message": "No token provided",
    "code": "NO_TOKEN"
  }
}
```

## REST endpoints

All examples below use JSON request bodies where shown.

### `POST /auth/login`

Login or register automatically by phone number.

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

Return the user represented by the bearer token.

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

Search users by name or phone number.

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

Return the current user's direct and group conversations.

Response `200`:

```json
{
  "data": []
}
```

### `POST /conversations`

Start or open a direct conversation.

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

Return a page of message history. `before` is optional and requests older messages.

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

Send a message to a direct or group conversation.

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

The API currently accepts whitespace-only text with HTTP `200`; the frontend must trim and reject empty messages before sending.

### `POST /conversations/group`

Create a group conversation. `participantIds` must contain enough users for at least three total members, including the creator.

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

The client connects to the host root, not `/api`.

### `message:new`

Server to client. A new message object is delivered. The frontend adds it to the matching conversation and deduplicates by `_id`.

### `conversation:updated`

Server to client. Conversation metadata or group membership changed. The frontend refreshes the conversation list and active conversation.

### `message:send`

Client to server, with an optional acknowledgement callback:

```json
{
  "conversationId": "6a88605ee5d6aac975228aef",
  "text": "Hello!"
}
```

The frontend uses REST for sending so it can display the HTTP result directly, while Socket.IO handles incoming real-time updates.

## Additional group endpoints

The API also exposes group management routes for adding/removing participants, promoting admins, and renaming groups. They are documented by the supplied Swagger contract but are outside the minimum UI scope for this assignment.

## Known API details

- The Swagger definition intentionally omits response bodies and status codes, so the examples above were captured from live requests.
- The documented `/api/health` route returns `404`; the live health endpoint is `/health`.
- Missing authentication returns `400 NO_TOKEN`.
- Whitespace-only messages are accepted by the API, so the frontend performs the required validation.
