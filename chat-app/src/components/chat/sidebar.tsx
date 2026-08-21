import { Conversation, User } from "@/lib/api";
import { conversationTitle } from "@/lib/format";
import {
  Avatar,
  eyebrowClass,
  IconButton,
  primaryButton,
  secondaryButton,
} from "./shared";

type Props = {
  user: User | null;
  conversations: Conversation[];
  directory: Record<string, User>;
  activeConversationId: string;
  onSelect: (id: string) => void;
  onLogout: () => void;
  onNewConversation: () => void;
  onNewGroup: () => void;
};

export function ConversationSidebar({
  user,
  conversations,
  directory,
  activeConversationId,
  onSelect,
  onLogout,
  onNewConversation,
  onNewGroup,
}: Props) {
  return (
    <aside className="flex min-h-screen flex-col border-r border-line bg-paper px-5 py-7 max-md:min-h-0 max-md:border-b max-md:border-r-0 max-md:px-4 max-md:pb-3.5 max-md:pt-4.5">
      <div className="flex items-start justify-between">
        <div>
          <p className={eyebrowClass}>Messages</p>
          <h1 className="m-0 text-[1.6rem] tracking-[-.07em]">Inbox</h1>
        </div>
        <IconButton onClick={onLogout} aria-label="Log out" title="Log out">
          ↗
        </IconButton>
      </div>
      <div className="my-7 mb-4.5 flex items-center gap-2.5 text-[.76rem] font-bold max-md:my-4 max-md:mb-2">
        <Avatar name={user?.name ?? "?"} />
        <span>{user?.name}</span>
      </div>
      <div className="grid gap-2 max-md:grid-cols-2">
        <button
          className={`${primaryButton} w-full`}
          onClick={onNewConversation}
        >
          New conversation
        </button>
        <button className={`${secondaryButton} w-full`} onClick={onNewGroup}>
          Create group
        </button>
      </div>
      <div
        className="mt-6.25 grid gap-1 overflow-auto max-md:mt-4.5 max-md:flex max-md:overflow-x-auto"
        aria-label="Conversations"
      >
        {conversations.length ? (
          conversations.map((conversation) => {
            const title = conversationTitle(
              conversation,
              user?._id ?? "",
              directory
            );
            return (
              <button
                className={`flex w-full items-center gap-2.75 rounded-[10px] border-0 bg-transparent p-2.5 text-left text-ink hover:bg-white max-md:min-w-45 ${
                  conversation._id === activeConversationId ? "bg-white" : ""
                }`}
                key={conversation._id}
                onClick={() => onSelect(conversation._id)}
              >
                <Avatar name={title} small />
                <span className="min-w-0">
                  <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[.76rem]">
                    {title}
                  </strong>
                  <small className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap text-[.65rem] text-muted">
                    {conversation.lastMessage?.text?.trim() ||
                      (conversation.type === "group"
                        ? "Group conversation"
                        : "Direct conversation")}
                  </small>
                </span>
              </button>
            );
          })
        ) : (
          <div className="grid min-h-45 place-items-center content-center p-7.5 text-center text-muted">
            <span className="grid size-10.75 place-items-center rounded-full bg-[#e7f4e8] text-[1.3rem] text-relay-deep">
              ✦
            </span>
            <p className="m-0 text-[.76rem] text-ink">No conversations yet.</p>
            <small className="text-[.65rem]">
              Start a conversation to see it here.
            </small>
          </div>
        )}
      </div>
    </aside>
  );
}
