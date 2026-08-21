import type { Conversation, User } from "@/lib/api";

export function getParticipantId(participant: string | User) {
  return typeof participant === "string" ? participant : participant._id;
}

export function getParticipantUser(
  participant: string | User,
  users: Record<string, User>
) {
  return typeof participant === "string" ? users[participant] : participant;
}

export function conversationTitle(
  conversation: Conversation,
  currentUserId: string,
  users: Record<string, User>
) {
  if (conversation.type === "group" || conversation.name) {
    return conversation.name || "Group conversation";
  }

  const otherParticipant = conversation.participants.find(
    (participant) => getParticipantId(participant) !== currentUserId
  );
  return (
    getParticipantUser(otherParticipant ?? conversation.participants[0], users)
      ?.name ?? "Conversation"
  );
}

export function formatTime(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
