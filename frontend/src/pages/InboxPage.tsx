import { useEffect, useRef, useState } from "react";
import InboxConversationCard, {
  type InboxConversationCardProps,
} from "../components/InboxConversationCard";

type ChatPreview = Pick<
  InboxConversationCardProps,
  | "name"
  | "initials"
  | "avatarClassName"
  | "threadTitle"
  | "preview"
  | "timeLabel"
> & { id: string };

interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt?: string;
  chatId?: string;
}

function SearchIcon() {
  return (
    <i
      aria-hidden
      className="fi fi-sr-member-search shrink-0 text-[16px] leading-none text-Colors-muted-foreground"
    />
  );
}

export default function InboxPage() {
  const [query, setQuery] = useState("");

  // Chats från backend
  const [chats, setChats] = useState<ChatPreview[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [newMessage, setNewMessage] = useState("");

  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);

  const currentUser = localStorage.getItem("currentUser") ?? "";

  // Olästa meddelanden
  const [unread, setUnread] = useState<Record<string, number>>({});

  const selectChat = (id: string) => {
    setSelectedId(id);

    setUnread((prev) => ({
      ...prev,
      [id]: 0,
    }));
  };

  // Hämta alla chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("/api/chat/rooms");

        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }

        const data = await response.json();

        setChats(data);

        // välj första chatten automatiskt
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  // Hämta chat historik
  useEffect(() => {
    if (!selectedId) return;

    const fetchMessages = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/chat/${selectedId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        const mapped = (data as Record<string, unknown>[]).map((m) => ({
          id: String(m.id),
          text: String(m.text_message ?? ""),
          sender: String(m.sender_id ?? ""),
          createdAt: m.created_at
            ? new Date(m.created_at as string).toLocaleTimeString()
            : undefined,
          chatId: selectedId,
        }));

        setMessages(mapped);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedId]);

  // WebSocket connection
  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(
      `${wsProtocol}//${window.location.host}/api/chat`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      setMessages((prev) => [...prev, message]);

      if (message.chatId && message.sender !== currentUser) {
        setUnread((prev) => {
          if (message.chatId === selectedId) {
            return prev;
          }

          return {
            ...prev,
            [message.chatId]: (prev[message.chatId] || 0) + 1,
          };
        });
      }
    };

    return () => {
      socket.close();
    };
  }, [currentUser, selectedId]);

  // Skicka nytt meddelande
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedId) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: currentUser,
      createdAt: new Date().toLocaleTimeString(),
      chatId: selectedId,
    };

    // Skicka till websocket server
    socketRef.current?.send(JSON.stringify(newMsg));

    // Uppdatera UI direkt
    setMessages((prev) => [...prev, newMsg]);

    setNewMessage("");
  };

  // Filter för sökfältet
  const filtered = chats.filter(
    (c) =>
      query.trim() === "" ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.threadTitle.toLowerCase().includes(query.toLowerCase()) ||
      c.preview.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="inline-flex min-h-0 w-full flex-1 flex-row justify-start items-stretch self-stretch overflow-hidden">
      {/* Vänster: inkorgslista */}
      <div className="inline-flex w-96 shrink-0 flex-col items-start justify-start self-stretch overflow-hidden border-r border-border bg-sidebar">
        <div className="flex w-96 flex-col items-start justify-start gap-3 border-b border-border p-5">
          <div className="justify-start font-['DM_Sans'] text-2xl font-bold text-foreground">
            Inkorg
          </div>

          <label className="inline-flex h-10 max-h-10 min-h-10 w-full cursor-text items-center justify-start gap-3 self-stretch rounded-3xl bg-Colors-card px-4 outline outline-1 -outline-offset-1 outline-Colors-border">
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
            filtered.map((chat) => {
              const unreadCount = unread[chat.id] ?? 0;

              return (
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

                  {unreadCount > 0 && (
                    <span className="absolute right-4 top-4 rounded-full bg-blue-500 px-2 py-1 text-[11px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Höger: chattvy */}
      <section
        className="flex min-h-0 min-w-0 flex-1 flex-col bg-Colors-background"
        aria-label="Chatt"
      >
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-xl font-bold text-foreground">Meddelanden</h2>

          <p
            className={`mt-1 text-sm ${
              isConnected ? "text-green-500" : "text-red-500"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </p>
        </div>

        {/* Messages */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <p className="text-Colors-muted-foreground">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-Colors-muted-foreground">
              Inga meddelanden hittades.
            </p>
          ) : (
            messages
              .filter((message) => message.chatId === selectedId)
              .map((message) => (
                <div
                  key={message.id}
                  className={`max-w-lg rounded-2xl p-4 shadow ${
                    message.sender === currentUser
                      ? "ml-auto bg-blue-500 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <p className="mb-1 font-bold">{message.sender}</p>

                  <p className="text-sm">{message.text}</p>

                  {message.createdAt && (
                    <p className="mt-2 text-xs opacity-70">
                      {message.createdAt}
                    </p>
                  )}
                </div>
              ))
          )}
        </div>

        {/* Skicka meddelande */}
        <div className="border-t border-border p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Skriv ett meddelande..."
              className="flex-1 rounded-xl border border-border px-4 py-3 outline-none"
            />

            <button
              onClick={sendMessage}
              className="rounded-xl bg-black px-5 py-3 text-white"
            >
              Skicka
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
