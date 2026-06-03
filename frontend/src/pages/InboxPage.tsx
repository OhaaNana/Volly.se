import { useEffect, useRef, useState } from "react";
import InboxConversationCard from "../components/InboxConversationCard";
import { VideoChatLobby } from "./VideoChatLobby";
import VideoChatRoom from "./VideoChatRoom";

type ChatStatus = "pending" | "accepted" | "denied";

type ChatRow = {
  id: number;
  post_id: number;
  creator_id: number;
  status: ChatStatus;
  created_at: string;
  post_title: string;
  post_author_id: number;
  creator_first_name: string | null;
  creator_last_name: string | null;
  creator_email: string;
  author_first_name: string | null;
  author_last_name: string | null;
  author_email: string;
};

export type ChatPreview = {
  id: string;
  name: string;
  initials: string;
  avatarClassName: string;
  threadTitle: string;
  preview: string;
  timeLabel: string;
  status?: ChatStatus;
  creatorId?: number;
  postAuthorId?: number;
};

type InboxPageProps = {
  pendingChat?: ChatPreview | null;
};

interface Message {
  id: number | string;
  request_id: number | string;
  sender_id: number | null;
  sender_email?: string | null;
  text_message: string;
  created_at?: string;
}

function SearchIcon() {
  return (
    <i
      aria-hidden
      className="fi fi-sr-member-search shrink-0 text-[16px] leading-none text-muted-foreground"
    />
  );
}

function buildPreview(chat: ChatRow, viewerId: number): ChatPreview {
  const isCreator = chat.creator_id === viewerId;
  const first = (
    isCreator ? chat.author_first_name : chat.creator_first_name
  )?.trim();
  const last = (
    isCreator ? chat.author_last_name : chat.creator_last_name
  )?.trim();
  const email = isCreator ? chat.author_email : chat.creator_email;
  const fullName = `${first ?? ""} ${last ?? ""}`.trim();
  const name = fullName || email.split("@")[0] || "Okänt";
  const initials =
    ((first?.[0] ?? "") + (last?.[0] ?? "")).toUpperCase() ||
    name.slice(0, 2).toUpperCase();
  return {
    id: String(chat.id),
    name,
    initials,
    avatarClassName: "bg-orange-400",
    threadTitle: chat.post_title,
    preview: chat.status === "pending" ? "Väntar på svar..." : "",
    timeLabel: "",
    status: chat.status,
    creatorId: chat.creator_id,
    postAuthorId: chat.post_author_id,
  };
}

export default function InboxPage({ pendingChat }: InboxPageProps = {}) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"chats" | "calendar">("chats");
  const [videoState, setVideoState] = useState<null | "lobby" | "room">(null);
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [messagesTick, setMessagesTick] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);

  const userId = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return 0;
      const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(b64));
      return Number(payload.id) || 0;
    } catch {
      return 0;
    }
  })();
  const hasActiveChat = Boolean(selectedId);

  const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const selectedChat = chats.find((c) => c.id === selectedId) ?? null;
  const amCreator = selectedChat?.creatorId === userId;
  const amRecipient = selectedChat?.postAuthorId === userId;
  const status = selectedChat?.status;

  const [lastPendingId, setLastPendingId] = useState<string | null>(null);
  if (pendingChat && pendingChat.id !== lastPendingId) {
    setLastPendingId(pendingChat.id);
    setChats((prev) =>
      prev.some((c) => c.id === pendingChat.id) ? prev : [pendingChat, ...prev]
    );
    setSelectedId(pendingChat.id);
    setRefreshTick((t) => t + 1);
  }

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("/api/chat/my", {
          headers: getAuthHeader(),
        });
        if (!response.ok) throw new Error("Failed to fetch chats");
        const raw = await response.json();
        const data = (Array.isArray(raw) ? raw : []) as ChatRow[];
        const mapped = data.map((c) => buildPreview(c, userId));
        setChats(mapped);
        if (mapped.length > 0 && !selectedId) {
          setSelectedId(mapped[0].id);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [refreshTick, selectedId, userId]);

  useEffect(() => {
    if (!selectedId) return;
    const targetId = selectedId;
    const showSpinner = messagesTick === 0;
    const fetchMessages = async () => {
      if (showSpinner) setIsLoading(true);
      try {
        const response = await fetch(`/api/chat/chat/${targetId}`, {
          headers: getAuthHeader(),
        });
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        if (selectedId !== targetId) return;
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        if (showSpinner) setIsLoading(false);
      }
    };
    fetchMessages();
  }, [selectedId, messagesTick]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages([]);
    setMessagesTick(0);
  }, [selectedId]);

  useEffect(() => {
    const bump = () => {
      setRefreshTick((t) => t + 1);
      setMessagesTick((t) => (t === 0 ? 1 : t + 1));
    };
    const interval = setInterval(bump, 15000);
    window.addEventListener("focus", bump);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", bump);
    };
  }, []);

  useEffect(() => {
    if (!selectedId || status !== "accepted" || !userId) return;
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const url =
      `${proto}//${window.location.host}/api/chat/ws?userId=${encodeURIComponent(String(userId))}` +
      `&roomId=${encodeURIComponent(selectedId)}`;
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as Message;
      if (String(message.sender_id) !== String(userId)) {
        setMessages((prev) => [...prev, message]);
      }
    };

    return () => {
      socket.close();
    };
  }, [selectedId, status, userId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedId || status !== "accepted") return;
    const text = newMessage;
    setNewMessage("");
    const optimistic: Message = {
      id: `tmp-${Date.now()}`,
      request_id: selectedId,
      sender_id: userId,
      sender_email: localStorage.getItem("currentUser"),
      text_message: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    socketRef.current?.send(JSON.stringify({ text }));
  };

  const updateStatus = async (next: "accepted" | "denied") => {
    if (!selectedId) return;
    try {
      const res = await fetch(`/api/chat/chat/${selectedId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        console.error("Failed to update status", res.status);
        return;
      }
      setRefreshTick((t) => t + 1);
    } catch (e) {
      console.error("Error updating status", e);
    }
  };

  const openVideo = () => {
    if (!selectedId || status !== "accepted") return;
    setVideoState("lobby");
  };

  const filtered = chats.filter(
    (c) =>
      query.trim() === "" ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.threadTitle.toLowerCase().includes(query.toLowerCase()) ||
      c.preview.toLowerCase().includes(query.toLowerCase())
  );

  const selectChat = (id: string) => {
    setSelectedId(id);
  };

  const getStatusText = () => {
    if (!selectedId) return "Välj en chatt";
    if (status === "accepted")
      return isConnected ? "Connected" : "Connecting...";
    if (status === "pending")
      return amRecipient ? "Ny förfrågan" : "Väntar på svar";
    if (status === "denied") return "Avböjd";
    return "";
  };

  const getEmptyText = () => {
    if (status === "pending")
      return amCreator ? "Väntar på att mottagaren accepterar..." : "";
    if (status === "denied") return "Denna chatt blev avböjd.";
    return "Inga meddelanden ännu.";
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] lg:h-screen flex">
      <aside
        className={`w-full lg:w-96 border-r border-border bg-sidebar flex flex-col ${hasActiveChat ? "hidden lg:flex" : ""}`}
      >
        <div className="border-b border-border p-5">
          <h1 className="mb-3 font-display text-2xl font-bold text-foreground">
            Inkorg
          </h1>

          <label className="mb-3 inline-flex h-10 w-full items-center gap-3 rounded-full border border-border bg-card px-4 shadow-soft">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök bland chattar..."
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>

          <div className="flex gap-1 rounded-full bg-muted p-1">
            <button
              type="button"
              onClick={() => setTab("chats")}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                tab === "chats"
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Chattar
            </button>
            <button
              type="button"
              onClick={() => setTab("calendar")}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                tab === "calendar"
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Kalender
            </button>
          </div>
        </div>

        {tab === "chats" ? (
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Inga chattar hittades.
              </p>
            ) : (
              filtered.map((chat) => (
                <div key={chat.id} className="border-b border-border/60">
                  <InboxConversationCard
                    name={chat.name}
                    initials={chat.initials}
                    avatarClassName={chat.avatarClassName}
                    threadTitle={chat.threadTitle}
                    preview={chat.preview}
                    timeLabel={chat.timeLabel}
                    selected={selectedId === chat.id}
                    onClick={() => selectChat(chat.id)}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            <h3 className="px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Kommande
            </h3>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-xs font-semibold text-primary">Video</p>
              <p className="mt-1 text-sm font-semibold">Stödjande samtal</p>
              <p className="mt-1 text-xs text-muted-foreground">
                med Maja · 14:00 idag
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-xs font-semibold text-primary">Chatt</p>
              <p className="mt-1 text-sm font-semibold">Språkstöd</p>
              <p className="mt-1 text-xs text-muted-foreground">
                med Leo · 16:30 imorgon
              </p>
            </div>

            <h3 className="px-1 pt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Tidigare
            </h3>
            <div className="rounded-2xl border border-border bg-muted/40 p-4 opacity-80">
              <p className="text-sm font-semibold">Teknikhjälp</p>
              <p className="mt-1 text-xs text-muted-foreground">
                med Emma · 10:00 förra veckan
              </p>
            </div>
          </div>
        )}
      </aside>

      <section
        className={`min-w-0 flex-1 ${!hasActiveChat ? "hidden lg:flex" : "flex"}`}
      >
        {hasActiveChat ? (
          <div className="flex min-h-0 flex-1 flex-col bg-background">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedChat?.threadTitle ?? "Meddelanden"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {getStatusText()}
                </p>
              </div>
              {status === "accepted" && (
                <button
                  type="button"
                  onClick={openVideo}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Starta videosamtal
                </button>
              )}
            </div>

            {status === "pending" && amRecipient && (
              <div className="flex items-center gap-3 border-b border-border bg-yellow-50 px-6 py-4">
                <p className="flex-1 text-sm text-yellow-900">
                  {selectedChat?.name} vill chatta med dig om "
                  {selectedChat?.threadTitle}".
                </p>
                <button
                  onClick={() => updateStatus("accepted")}
                  className="rounded-full bg-success px-4 py-2 text-sm font-semibold text-white"
                >
                  Acceptera
                </button>
                <button
                  onClick={() => updateStatus("denied")}
                  className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-white"
                >
                  Avböj
                </button>
              </div>
            )}

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6">
              {isLoading ? (
                <p className="text-muted-foreground">Laddar...</p>
              ) : messages.length === 0 ? (
                <p className="text-muted-foreground">{getEmptyText()}</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-lg rounded-2xl p-4 shadow-soft ${
                      message.sender_id === userId
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-card text-foreground"
                    }`}
                  >
                    <p className="mb-1 text-sm font-semibold">
                      {message.sender_email ?? "Okänd"}
                    </p>
                    <p className="text-sm">{message.text_message}</p>
                    {message.created_at && (
                      <p className="mt-2 text-xs opacity-70">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={
                    status === "accepted"
                      ? "Skriv ett meddelande..."
                      : "Chatt inte aktiv"
                  }
                  disabled={status !== "accepted"}
                  className="flex-1 rounded-full border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50 focus:outline-none focus:ring focus:ring-ring"
                />
                <button
                  onClick={sendMessage}
                  disabled={status !== "accepted"}
                  className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background disabled:opacity-40"
                >
                  Skicka
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden flex-1 items-center justify-center p-10 text-center lg:flex">
            <div>
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-accent">
                <i
                  aria-hidden
                  className="fi fi-rr-comment-dots text-3xl leading-0 text-primary"
                />
              </div>
              <h2 className="mb-1 font-display text-xl font-bold text-foreground">
                Välj en konversation
              </h2>
              <p className="max-w-xs text-sm text-muted-foreground">
                Eller starta en ny genom att kontakta någon från ett inlägg -
                ett litet meddelande kan betyda mycket.
              </p>
            </div>
          </div>
        )}
      </section>

      {videoState === "lobby" && selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <VideoChatLobby
            roomId={selectedId}
            userName={selectedChat?.name ?? "Okänd"}
            onConnect={() => setVideoState("room")}
            onCancel={() => setVideoState(null)}
          />
        </div>
      )}

      {videoState === "room" && selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="h-[85vh] w-full max-w-[800px] overflow-hidden rounded-3xl">
            <VideoChatRoom
              roomId={selectedId}
              onDisconnect={() => setVideoState(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
