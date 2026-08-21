"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import {
  ApiError,
  Conversation,
  createConversation,
  createGroup,
  getConversations,
  getCurrentUser,
  getMessages,
  Message,
  searchUsers,
  sendMessage,
  SOCKET_URL,
  User,
} from "@/lib/api";
import { clearSession, getCachedUser, getToken } from "@/lib/auth";
import { ConversationSidebar } from "@/components/chat/sidebar";
import { GroupModal, NewConversationModal } from "@/components/chat/modals";
import { MessagePanel } from "@/components/chat/message-panel";

function mergeMessages(current: Message[], incoming: Message[]) {
  const byId = new Map(current.map((message) => [message._id, message]));
  incoming.forEach((message) => byId.set(message._id, message));
  return [...byId.values()].sort(
    (left, right) =>
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
  );
}

export function ChatApp() {
  const router = useRouter();
  const messageScrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const isNearBottomRef = useRef(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [knownUsers, setKnownUsers] = useState<Record<string, User>>({});
  const [activeConversationId, setActiveConversationId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [draft, setDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [modalError, setModalError] = useState("");
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);

  const activeConversation = conversations.find(
    (conversation) => conversation._id === activeConversationId
  );

  const directory = useMemo(() => {
    const result = { ...knownUsers };
    conversations.forEach((conversation) => {
      conversation.participants.forEach((participant) => {
        if (typeof participant !== "string")
          result[participant._id] = participant;
      });
    });
    return result;
  }, [conversations, knownUsers]);

  useEffect(() => {
    queueMicrotask(() => setUser(getCachedUser()));
    const sessionToken = getToken();
    if (!sessionToken) {
      router.replace("/login");
      return;
    }

    queueMicrotask(() => setToken(sessionToken));
    let mounted = true;
    Promise.all([getCurrentUser(sessionToken), getConversations(sessionToken)])
      .then(([currentUser, result]) => {
        if (!mounted) return;
        setUser(currentUser);
        setConversations(result);
        if (result.length) setActiveConversationId(result[0]._id);
        setIsLoading(false);
      })
      .catch((caughtError) => {
        if (!mounted) return;
        if (
          caughtError instanceof ApiError &&
          caughtError.code === "NO_TOKEN"
        ) {
          clearSession();
          router.replace("/login");
          return;
        }
        setError("We could not load your conversations. Please try again.");
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!token || !activeConversationId) return;
    let mounted = true;
    queueMicrotask(() => {
      setIsLoadingMessages(true);
      setMessageError("");
      setMessages([]);
      setNewMessageCount(0);
    });
    getMessages(token, activeConversationId)
      .then((result) => {
        if (!mounted) return;
        setMessages(mergeMessages([], result.messages));
        setHasMoreMessages(result.hasMore);
        setIsNearBottom(true);
        window.setTimeout(
          () => messageScrollRef.current?.scrollTo({ top: 999999 }),
          0
        );
      })
      .catch(() => {
        if (mounted) setMessageError("We could not load these messages.");
      })
      .finally(() => {
        if (mounted) setIsLoadingMessages(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeConversationId, token]);

  useEffect(() => {
    if (!token) return;
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;
    socket.on("connect", () => setSocketConnected(true));
    socket.on("disconnect", () => setSocketConnected(false));
    socket.on("message:new", (incoming: Message) => {
      const conversationId = incoming.conversation;
      void getConversations(token).then((result) => setConversations(result));
      if (conversationId !== activeConversationId) return;
      setMessages((current) => mergeMessages(current, [incoming]));
      if (isNearBottomRef.current) {
        window.setTimeout(
          () =>
            messageScrollRef.current?.scrollTo({
              top: 999999,
              behavior: "smooth",
            }),
          0
        );
      } else {
        setNewMessageCount((count) => count + 1);
      }
    });
    socket.on("conversation:updated", () => {
      void getConversations(token).then((result) => setConversations(result));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeConversationId, token]);

  useEffect(() => {
    if (!token || searchQuery.trim().length < 2) {
      queueMicrotask(() => {
        setSearchResults([]);
        setSearchError("");
      });
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsSearching(true);
      searchUsers(token, searchQuery.trim())
        .then((result) => {
          setSearchResults(
            result.filter((resultUser) => resultUser._id !== user?._id)
          );
          setSearchError("");
          setKnownUsers((current) => ({
            ...current,
            ...Object.fromEntries(result.map((item) => [item._id, item])),
          }));
        })
        .catch(() => {
          setSearchResults([]);
          setSearchError("Search is unavailable right now. Please try again.");
        })
        .finally(() => setIsSearching(false));
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchQuery, token, user?._id]);

  async function loadOlderMessages() {
    const element = messageScrollRef.current;
    const firstMessage = messages[0];
    if (
      !token ||
      !activeConversationId ||
      !element ||
      !firstMessage ||
      !hasMoreMessages ||
      isLoadingOlder
    )
      return;

    const previousHeight = element.scrollHeight;
    const previousTop = element.scrollTop;
    setIsLoadingOlder(true);
    try {
      const result = await getMessages(token, activeConversationId, {
        before: firstMessage._id,
      });
      setMessages((current) => mergeMessages(current, result.messages));
      setHasMoreMessages(result.hasMore);
      window.requestAnimationFrame(() => {
        element.scrollTop = element.scrollHeight - previousHeight + previousTop;
      });
    } finally {
      setIsLoadingOlder(false);
    }
  }

  function handleMessageScroll() {
    const element = messageScrollRef.current;
    if (!element) return;
    const nearBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 80;
    isNearBottomRef.current = nearBottom;
    setIsNearBottom(nearBottom);
    if (nearBottom) setNewMessageCount(0);
    if (element.scrollTop < 80) void loadOlderMessages();
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!token || !activeConversationId || !text || isSending) return;

    setIsSending(true);
    setMessageError("");
    try {
      const sentMessage = await sendMessage(token, activeConversationId, text);
      setMessages((current) => mergeMessages(current, [sentMessage]));
      setDraft("");
      window.setTimeout(
        () =>
          messageScrollRef.current?.scrollTo({
            top: 999999,
            behavior: "smooth",
          }),
        0
      );
    } catch (caughtError) {
      setMessageError(
        caughtError instanceof ApiError
          ? caughtError.message
          : "Message could not be sent."
      );
    } finally {
      setIsSending(false);
    }
  }

  async function handleStartDirect(userToMessage: User) {
    if (!token) return;
    setIsCreating(true);
    setModalError("");
    try {
      const conversation = await createConversation(token, userToMessage._id);
      setConversations((current) => [
        conversation,
        ...current.filter((item) => item._id !== conversation._id),
      ]);
      setActiveConversationId(conversation._id);
      setIsNewConversationOpen(false);
      setSearchQuery("");
    } catch (caughtError) {
      setModalError(
        caughtError instanceof ApiError
          ? caughtError.message
          : "Conversation could not be started."
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleCreateGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !groupName.trim() || selectedParticipants.length < 2) {
      setModalError("Choose at least two people and enter a group name.");
      return;
    }

    setIsCreating(true);
    setModalError("");
    try {
      const conversation = await createGroup(
        token,
        groupName.trim(),
        selectedParticipants.map((participant) => participant._id)
      );
      setConversations((current) => [conversation, ...current]);
      setActiveConversationId(conversation._id);
      setIsGroupOpen(false);
      setGroupName("");
      setSelectedParticipants([]);
      setSearchQuery("");
    } catch (caughtError) {
      setModalError(
        caughtError instanceof ApiError
          ? caughtError.message
          : "Group could not be created."
      );
    } finally {
      setIsCreating(false);
    }
  }

  function toggleParticipant(participant: User) {
    setSelectedParticipants((current) =>
      current.some((item) => item._id === participant._id)
        ? current.filter((item) => item._id !== participant._id)
        : [...current, participant]
    );
  }

  function logout() {
    socketRef.current?.disconnect();
    clearSession();
    router.replace("/login");
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center gap-2.5 text-[.78rem] text-muted">
        <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-[#b9c9bb] border-t-relay-deep" />
        Loading your conversations…
      </main>
    );
  }

  return (
    <main className="grid min-h-screen grid-cols-[315px_minmax(0,1fr)] bg-card max-md:block">
      <ConversationSidebar
        user={user}
        conversations={conversations}
        directory={directory}
        activeConversationId={activeConversationId}
        onSelect={setActiveConversationId}
        onLogout={logout}
        onNewConversation={() => {
          setModalError("");
          setSearchQuery("");
          setIsNewConversationOpen(true);
        }}
        onNewGroup={() => {
          setModalError("");
          setSearchQuery("");
          setIsGroupOpen(true);
        }}
      />
      <MessagePanel
        conversation={activeConversation}
        user={user}
        directory={directory}
        messages={messages}
        isLoadingMessages={isLoadingMessages}
        isLoadingOlder={isLoadingOlder}
        messageScrollRef={messageScrollRef}
        socketConnected={socketConnected}
        isNearBottom={isNearBottom}
        newMessageCount={newMessageCount}
        messageError={messageError}
        draft={draft}
        isSending={isSending}
        onScroll={handleMessageScroll}
        onDraftChange={setDraft}
        onSend={handleSend}
        onShowNewMessages={() => {
          messageScrollRef.current?.scrollTo({
            top: 999999,
            behavior: "smooth",
          });
          setNewMessageCount(0);
        }}
      />
      {error ? (
        <div
          className="fixed bottom-5.5 right-5.5 z-5 max-w-80 rounded-[10px] border border-[#f2beb3] bg-[#fff5f2] px-4 py-3.25 text-xs text-[#a43b2c]"
          role="alert"
        >
          {error}
        </div>
      ) : null}
      {searchError && (isNewConversationOpen || isGroupOpen) ? (
        <div
          className="fixed bottom-5.5 right-5.5 z-5 max-w-80 rounded-[10px] border border-[#f2beb3] bg-[#fff5f2] px-4 py-3.25 text-xs text-[#a43b2c]"
          role="alert"
        >
          {searchError}
        </div>
      ) : null}
      {isNewConversationOpen ? (
        <NewConversationModal
          searchQuery={searchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          isCreating={isCreating}
          modalError={modalError}
          selectedParticipants={selectedParticipants}
          groupName={groupName}
          onSearchChange={setSearchQuery}
          onStartDirect={(selected) => void handleStartDirect(selected)}
          onToggleParticipant={toggleParticipant}
          onGroupNameChange={setGroupName}
          onCreateGroup={handleCreateGroup}
          onClose={() => setIsNewConversationOpen(false)}
        />
      ) : null}
      {isGroupOpen ? (
        <GroupModal
          searchQuery={searchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          isCreating={isCreating}
          modalError={modalError}
          selectedParticipants={selectedParticipants}
          groupName={groupName}
          onSearchChange={setSearchQuery}
          onStartDirect={(selected) => void handleStartDirect(selected)}
          onToggleParticipant={toggleParticipant}
          onGroupNameChange={setGroupName}
          onCreateGroup={handleCreateGroup}
          onClose={() => setIsGroupOpen(false)}
        />
      ) : null}
    </main>
  );
}
