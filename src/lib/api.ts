export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://frontend-task-chatapp.onrender.com/api";

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ??
  "https://frontend-task-chatapp.onrender.com";

export type User = {
  _id: string;
  name: string;
  phone: string;
  createdAt?: string;
};

export type Message = {
  _id: string;
  conversation: string;
  sender: string | User;
  text: string;
  createdAt: string;
};

export type Conversation = {
  _id: string;
  type?: "direct" | "group";
  name?: string;
  createdBy?: string;
  admins?: string[];
  participants: Array<string | User>;
  createdAt?: string;
  updatedAt?: string;
  lastMessage?: { text?: string; createdAt?: string };
};

type ConversationResponse = Omit<Conversation, "participants"> & {
  participants?: Array<string | User>;
  participant?: User;
};

export type ApiErrorShape = {
  error?: {
    message?: string;
    code?: string;
    details?: Array<{ path?: string; message?: string }>;
  };
};

export class ApiError extends Error {
  readonly code?: string;
  readonly status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function apiRequest<T>(
  path: string,
  token: string | null,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as
    | (T & ApiErrorShape)
    | null;

  if (!response.ok) {
    const errorBody = body as ApiErrorShape | null;
    throw new ApiError(
      errorBody?.error?.message ?? "Something went wrong. Please try again.",
      response.status,
      errorBody?.error?.code
    );
  }

  return body as T;
}

export function login(phone: string, name: string) {
  return apiRequest<{ token: string; user: User }>("/auth/login", null, {
    method: "POST",
    body: JSON.stringify({ phone, name }),
  });
}

export function getCurrentUser(token: string) {
  return apiRequest<User>("/auth/me", token);
}

export function searchUsers(token: string, query: string) {
  return apiRequest<User[]>(
    `/users/search?q=${encodeURIComponent(query)}`,
    token
  );
}

export async function getConversations(token: string) {
  const result = await apiRequest<
    ConversationResponse[] | { data?: ConversationResponse[] }
  >("/conversations", token);
  const conversations = Array.isArray(result) ? result : result.data ?? [];
  return conversations.map((conversation) => ({
    ...conversation,
    participants:
      conversation.participants ??
      (conversation.participant ? [conversation.participant] : []),
  }));
}

export function createConversation(token: string, userId: string) {
  return apiRequest<Conversation>("/conversations", token, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export function getMessages(
  token: string,
  conversationId: string,
  options: { limit?: number; before?: string } = {}
) {
  const params = new URLSearchParams({ limit: String(options.limit ?? 20) });
  if (options.before) params.set("before", options.before);

  return apiRequest<{ messages: Message[]; hasMore: boolean }>(
    `/conversations/${conversationId}/messages?${params.toString()}`,
    token
  );
}

export function sendMessage(
  token: string,
  conversationId: string,
  text: string
) {
  return apiRequest<Message>("/messages", token, {
    method: "POST",
    body: JSON.stringify({ conversationId, text }),
  });
}

export function createGroup(
  token: string,
  name: string,
  participantIds: string[]
) {
  return apiRequest<Conversation>("/conversations/group", token, {
    method: "POST",
    body: JSON.stringify({ name, participantIds }),
  });
}
