import { Conversation, Message, User } from "@/lib/api";
import { conversationTitle, formatDate, formatTime } from "@/lib/format";
import { primaryButton, eyebrowClass } from "./shared";

type Props = {
  conversation: Conversation | undefined;
  user: User | null;
  directory: Record<string, User>;
  messages: Message[];
  isLoadingMessages: boolean;
  isLoadingOlder: boolean;
  messageScrollRef: React.RefObject<HTMLDivElement | null>;
  socketConnected: boolean;
  isNearBottom: boolean;
  newMessageCount: number;
  messageError: string;
  draft: string;
  isSending: boolean;
  onScroll: () => void;
  onDraftChange: (value: string) => void;
  onSend: (event: React.FormEvent<HTMLFormElement>) => void;
  onShowNewMessages: () => void;
};

export function MessagePanel({
  conversation,
  user,
  directory,
  messages,
  isLoadingMessages,
  isLoadingOlder,
  messageScrollRef,
  socketConnected,
  isNearBottom,
  newMessageCount,
  messageError,
  draft,
  isSending,
  onScroll,
  onDraftChange,
  onSend,
  onShowNewMessages,
}: Props) {
  return (
    <section className="relative flex min-h-screen min-w-0 flex-col bg-white">
      {conversation ? (
        <>
          <header className="flex min-h-22.25 items-start justify-between border-b border-line px-8 py-6.75 max-md:px-4.5 max-md:py-5">
            <div>
              <p className={eyebrowClass}>
                {conversation.type === "group"
                  ? "Group conversation"
                  : "Direct conversation"}
              </p>
              <h2 className="m-0 text-[1.45rem] tracking-[-.07em]">
                {conversationTitle(conversation, user?._id ?? "", directory)}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-[.68rem] text-muted">
              <span
                className={`size-1.75 rounded-full ${
                  socketConnected ? "bg-[#56ab70]" : "bg-relay-warm"
                }`}
              />
              {socketConnected ? "Live" : "Connecting"}
            </div>
          </header>
          <MessageList
            conversation={conversation}
            user={user}
            directory={directory}
            messages={messages}
            isLoadingMessages={isLoadingMessages}
            isLoadingOlder={isLoadingOlder}
            messageScrollRef={messageScrollRef}
            onScroll={onScroll}
          />
          {!isNearBottom && newMessageCount ? (
            <button
              className="absolute bottom-22 left-1/2 z-2 -translate-x-1/2 rounded-full border border-[#bad8c0] bg-[#f1fff2] px-3.25 py-2 text-[.7rem] font-bold text-relay-deep shadow-[0_8px_20px_#294a3720] hover:-translate-x-1/2 hover:-translate-y-0.5"
              onClick={onShowNewMessages}
            >
              ↓ {newMessageCount} new message{newMessageCount === 1 ? "" : "s"}
            </button>
          ) : null}
          {messageError ? (
            <p
              className="m-0 px-8 pb-2 text-[.74rem] leading-normal text-[#a43b2c] max-md:px-4.5"
              role="alert"
            >
              {messageError}
            </p>
          ) : null}
          <form
            className="flex gap-2.5 border-t border-line bg-white px-8 pb-5.5 pt-4 max-md:px-4 max-md:pb-4 max-md:pt-3"
            onSubmit={onSend}
          >
            <input
              className="h-11.5 flex-1 rounded-[10px] border border-line bg-white px-3.25 text-ink outline-none focus:border-relay-deep focus:ring-4 focus:ring-relay-green/25"
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              placeholder="Write a message…"
              aria-label="Message"
            />
            <button
              className={primaryButton}
              disabled={!draft.trim() || isSending}
            >
              {isSending ? "Sending…" : "Send"}
            </button>
          </form>
        </>
      ) : (
        <div className="grid place-items-center content-center p-7.5 text-center text-muted">
          <span className="grid size-10.75 place-items-center rounded-full bg-[#e7f4e8] text-[1.3rem] text-relay-deep">
            ✦
          </span>
          <h2 className="mt-4 text-ink tracking-tighter">
            Choose a conversation
          </h2>
          <p className="mt-2 text-[.72rem] leading-normal">
            Select a conversation or start a new one.
          </p>
        </div>
      )}
    </section>
  );
}

function MessageList({
  conversation,
  user,
  directory,
  messages,
  isLoadingMessages,
  isLoadingOlder,
  messageScrollRef,
  onScroll,
}: Omit<
  Pick<
    Props,
    | "conversation"
    | "user"
    | "directory"
    | "messages"
    | "isLoadingMessages"
    | "isLoadingOlder"
    | "messageScrollRef"
    | "onScroll"
  >,
  "conversation"
> & { conversation: Conversation }) {
  return (
    <div
      className="relative flex-1 overflow-auto scroll-smooth px-[max(32px,calc((100%-700px)/2))] py-5 max-md:px-4.5 max-md:py-4"
      ref={messageScrollRef}
      onScroll={onScroll}
      aria-label="Messages"
    >
      {isLoadingOlder ? (
        <p className="m-2.5 flex items-center justify-center gap-2 text-[.72rem] text-muted">
          Loading older messages…
        </p>
      ) : null}
      {isLoadingMessages ? (
        <div className="m-2.5 flex items-center justify-center gap-2 text-[.72rem] text-muted">
          <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-[#b9c9bb] border-t-relay-deep" />
          Loading messages…
        </div>
      ) : null}
      {!isLoadingMessages && !messages.length ? (
        <div className="grid min-h-full place-items-center content-center p-7.5 text-center text-muted">
          <span className="grid size-10.75 place-items-center rounded-full bg-[#e7f4e8] text-[1.3rem] text-relay-deep">
            ◌
          </span>
          <h3 className="mt-4 text-ink tracking-tighter">No messages yet</h3>
          <p className="mt-2 max-w-55 text-[.72rem] leading-normal">
            Send the first message to start this conversation.
          </p>
        </div>
      ) : null}
      {messages.map((message, index) => (
        <MessageItem
          key={message._id}
          message={message}
          previous={messages[index - 1]}
          conversation={conversation}
          user={user}
          directory={directory}
        />
      ))}
    </div>
  );
}

function MessageItem({
  message,
  previous,
  conversation,
  user,
  directory,
}: {
  message: Message;
  previous?: Message;
  conversation: Conversation;
  user: User | null;
  directory: Record<string, User>;
}) {
  const senderId =
    typeof message.sender === "string" ? message.sender : message.sender._id;
  const sender =
    typeof message.sender === "string"
      ? directory[message.sender]
      : message.sender;
  const isMine = senderId === user?._id;
  const showDate =
    !previous ||
    formatDate(previous.createdAt) !== formatDate(message.createdAt);
  return (
    <div>
      {showDate ? (
        <div className="my-5 flex items-center gap-3.5 text-[.62rem] text-muted">
          <span className="h-px flex-1 bg-line" />
          <span>{formatDate(message.createdAt)}</span>
          <span className="h-px flex-1 bg-line" />
        </div>
      ) : null}
      <article className={`my-1.5 flex ${isMine ? "justify-end" : ""}`}>
        <div
          className={`max-w-[min(75%,500px)] rounded-[4px_15px_15px_15px] bg-[#eff4ef] px-3.25 pb-2 pt-2.5 text-ink ${
            isMine
              ? "rounded-[15px_4px_15px_15px] bg-relay-deep text-white"
              : ""
          }`}
        >
          {conversation.type === "group" && !isMine ? (
            <strong className="mb-1 block text-[.66rem] text-relay-deep">
              {sender?.name ?? "Participant"}
            </strong>
          ) : null}
          <p className="m-0 whitespace-pre-wrap wrap-break-word text-[.82rem] leading-[1.45]">
            {message.text.trim() || "Empty message"}
          </p>
          <time className="mt-0.75 block text-right text-[.59rem] text-[#89998e]">
            {formatTime(message.createdAt)}
          </time>
        </div>
      </article>
    </div>
  );
}
