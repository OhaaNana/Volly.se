import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InboxConversationCard from "../components/InboxConversationCard";

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
      className="fi fi-sr-member-search shrink-0 text-[16px] leading-none text-Colors-muted-foreground"
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
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);

  const userId = Number(localStorage.getItem("userId") ?? "0");

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
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/api/chat/chat/${selectedId}`,
          { headers: getAuthHeader() }
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId || status !== "accepted" || !userId) return;
    const url =
      `ws://localhost:3001/chat?userId=${encodeURIComponent(String(userId))}` +
      `&roomId=${encodeURIComponent(selectedId)}`;
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as Message;
      setMessages((prev) => [...prev, message]);
    };

    return () => {
      socket.close();
    };
  }, [selectedId, status, userId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedId || status !== "accepted") return;
    const optimistic: Message = {
      id: `tmp-${Date.now()}`,
      request_id: selectedId,
      sender_id: userId,
      sender_email: localStorage.getItem("currentUser"),
      text_message: newMessage,
      created_at: new Date().toISOString(),
    };
    socketRef.current?.send(JSON.stringify({ text: newMessage }));
    setMessages((prev) => [...prev, optimistic]);
    setNewMessage("");
  };

  const updateStatus = async (next: "accepted" | "denied") => {
    if (!selectedId) return;
    try {
      const res = await fetch(
        `http://localhost:3001/api/chat/chat/${selectedId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
          body: JSON.stringify({ status: next }),
        }
      );
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
    navigate(`/room/${selectedId}`);
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
    <div className="inline-flex min-h-0 w-full flex-1 flex-row justify-start items-stretch self-stretch overflow-hidden">
      <div className="inline-flex w-96 shrink-0 flex-col items-start justify-start self-stretch overflow-hidden border-r border-border bg-sidebar">
        <div className="flex w-96 flex-col items-start justify-start gap-3 border-b border-border p-5">
          <div className="justify-start font-['DM_Sans'] text-2xl font-bold text-foreground">
            Inkorg
          </div>
          <label className="inline-flex h-10 max-h-10 min-h-10 w-full cursor-text items-center justify-start gap-3 self-stretch rounded-3xl bg-Colors-card px-4 outline -outline-offset-1 outline-Colors-border">
            <span className="sr-only">Sök bland chattar</span>

            <SearchIcon />

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök bland chattar..."
              className="min-h-0 min-w-0 flex-1 self-stretch bg-transparent font-['DM_Sans'] text-sm font-normal leading-4 text-foreground outline-none placeholder:text-Colors-muted-foreground"
            />
          </label>
        </div>

        <div
          className="flex min-h-0 w-96 flex-1 flex-col overflow-y-auto"
          role="list"
        >
          {filtered.length === 0 ? (
            <p className="p-4 text-sm text-Colors-muted-foreground">
              Inga chattar hittades.
            </p>
          ) : (
            filtered.map((chat) => (
              <div key={chat.id} className="relative">
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
                {chat.status && chat.status !== "accepted" && (
                  <span className="absolute right-3 top-3 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-semibold text-yellow-900">
                    {chat.status === "pending" ? "Väntar" : "Avböjd"}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <section
        className="flex min-h-0 min-w-0 flex-1 flex-col bg-Colors-background"
        aria-label="Chatt"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {selectedChat?.threadTitle ?? "Meddelanden"}
            </h2>
            <p className="mt-1 text-sm text-Colors-muted-foreground">
              {getStatusText()}
            </p>
          </div>
          {status === "accepted" && (
            <button
              type="button"
              onClick={openVideo}
              className="rounded-3xl bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-green-600"
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
              className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Acceptera
            </button>
            <button
              onClick={() => updateStatus("denied")}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Avböj
            </button>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <p className="text-Colors-muted-foreground">Laddar...</p>
          ) : !selectedId ? (
            <p className="text-Colors-muted-foreground">
              Välj en chatt för att visa meddelanden.
            </p>
          ) : messages.length === 0 ? (
            <p className="text-Colors-muted-foreground">{getEmptyText()}</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-lg rounded-2xl p-4 shadow ${message.sender_id === userId ? "ml-auto bg-blue-500 text-white" : "bg-white text-black"}`}
              >
                <p className="mb-1 font-bold">
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
              placeholder={
                status === "accepted"
                  ? "Skriv ett meddelande..."
                  : "Chatt inte aktiv"
              }
              disabled={status !== "accepted"}
              className="flex-1 rounded-xl border border-border px-4 py-3 outline-none disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={status !== "accepted"}
              className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-40"
            >
              Skicka
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
