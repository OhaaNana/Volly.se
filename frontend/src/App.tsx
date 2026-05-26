import { useState, useEffect, useCallback } from "react";
import { isTokenExpired, clearAuth } from "./utils/auth";
import LoginPage from "./LogingPage";
import HomePage from "./HomePage";
import "./index.css";
import MenuLoggedIn, {
  LOGGED_IN_MENU_ITEMS,
  type LoggedInMenuId,
} from "./components/MenuLoggedIn";
import CreatePostPage from "./pages/CreatePostPage";
import LoggedInStartPage from "./pages/LoggedInStartPage";
import CategoryPage, { type CategoryKey } from "./pages/CategoryPage";
import InboxPage, { type ChatPreview } from "./pages/InboxPage";
import ProfilePage from "./pages/ProfilePage";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  postType?: "seek" | "offer";
  category?: string;
  tags?: string[];
  author_email?: string;
  first_name?: string;
  last_name?: string;
};

function helpTypeToPostType(helpType: unknown): Post["postType"] {
  if (helpType === "getHelp") return "seek";
  if (helpType === "giveHelp") return "offer";
  return undefined;
}

export function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    localStorage.getItem("currentUser")
  );
  const [sessionExpired, setSessionExpired] = useState(false);
  const [prefillEmail] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedProfileEmail, setSelectedProfileEmail] = useState<
    string | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryKey | undefined
  >(undefined);
  const [pendingChat, setPendingChat] = useState<ChatPreview | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadPosts() {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        const mapped: Post[] = (data as Record<string, unknown>[]).map((p) => ({
          id: String(p.id),
          title: String(p.title ?? ""),
          content: String(p.description ?? p.content ?? ""),
          // normalize created_at which may be ISO string, ms number, or seconds number
          createdAt: (() => {
            const v = p.created_at as unknown;
            if (typeof v === "number") {
              // if it's seconds (<=1e11) convert to ms
              return v < 1e12 ? v * 1000 : v;
            }
            if (typeof v === "string") return new Date(v).getTime();
            return Date.now();
          })(),
          postType: helpTypeToPostType(p.help_type),
          category: p.category != null ? String(p.category) : undefined,
          tags:
            Array.isArray(p.tags) && p.tags.length > 0
              ? (p.tags as string[])
              : typeof p.tagg === "string" && p.tagg.trim()
                ? (String(p.tagg)
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean) as string[])
                : undefined,
          author_email:
            p.author_email != null ? String(p.author_email) : undefined,
          first_name: p.first_name != null ? String(p.first_name) : undefined,
          last_name: p.last_name != null ? String(p.last_name) : undefined,
        }));
        setPosts(mapped);
      } catch (error) {
        console.error("Failed to load posts:", error);
      }
    }

    loadPosts();
    return () => {
      mounted = false;
    };
  }, []);
  const [activeLoggedInPage, setActiveLoggedInPage] =
    useState<LoggedInMenuId>("start");

  const handleLoggedInNavigate = (nextPage: LoggedInMenuId) => {
    setActiveLoggedInPage(nextPage);
    if (nextPage === "profil") {
      setSelectedProfileEmail(null);
    }
    if (nextPage === "kategorier") {
      setSelectedCategory(undefined);
    }
  };

  const openChatFromPost = async (post: Post) => {
    if (post.author_email && post.author_email === currentUser) {
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/chat/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ postId: Number(post.id) }),
      });
      if (!res.ok) {
        console.error("Failed to start chat", res.status);
        return;
      }
      const chat = await res.json();
      const first = post.first_name?.trim() ?? "";
      const last = post.last_name?.trim() ?? "";
      const fullName = `${first} ${last}`.trim();
      const fallbackName = post.author_email?.split("@")[0] ?? "Okänt namn";
      const name = fullName || fallbackName;
      const initials =
        ((first[0] ?? "") + (last[0] ?? "")).toUpperCase() ||
        name.slice(0, 2).toUpperCase();

      setPendingChat({
        id: String(chat.id),
        name,
        initials,
        avatarClassName: "bg-orange-400",
        threadTitle: post.title,
        preview: post.content,
        timeLabel: "",
      });
      setActiveLoggedInPage("inkorg");
    } catch (e) {
      console.error("Error starting chat", e);
    }
  };

  const openProfileFromPost = (authorEmail?: string) => {
    if (!authorEmail || authorEmail === currentUser) {
      setSelectedProfileEmail(null);
    } else {
      setSelectedProfileEmail(authorEmail);
    }
    setActiveLoggedInPage("profil");
  };

  const logout = useCallback((expired = false) => {
    clearAuth();
    setCurrentUser(null);
    if (expired) setSessionExpired(true);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const check = () => {
      if (isTokenExpired()) logout(true);
    };
    check();
    const interval = setInterval(check, 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUser, logout]);

  const firstName =
    currentUser
      ?.split("@")[0]
      ?.split(/[._-]/)[0]
      ?.trim()
      .replace(/^\w/, (c) => c.toUpperCase()) || "Anna";

  if (currentUser) {
    return (
      <div className="min-h-dvh w-full bg-Colors-background">
        <MenuLoggedIn<LoggedInMenuId>
          items={LOGGED_IN_MENU_ITEMS}
          activeId={activeLoggedInPage}
          onNavigate={handleLoggedInNavigate}
          onLogout={logout}
          brandName="Volly"
          brandInitial="V"
          user={{
            name: currentUser,
            initials: currentUser.slice(0, 2).toUpperCase(),
          }}
        >
          {activeLoggedInPage === "skapa" ? (
            <CreatePostPage
              onCancel={() => setActiveLoggedInPage("start")}
              onSubmit={async (post) => {
                // send to backend
                try {
                  const token = localStorage.getItem("token");
                  const body = {
                    title: post.title,
                    description: post.content,
                    help_type:
                      post.postType === "seek" ? "getHelp" : "giveHelp",
                    category: post.category ?? "",
                    tagg: (post.tags || []).join(","),
                  };

                  const res = await fetch("/api/posts", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(body),
                  });

                  if (!res.ok) {
                    console.error("Failed to create post", res.status);
                    // optionally show error to user
                  } else {
                    const created = await res.json();
                    // prepend created post to UI list
                    setPosts((prev) => [
                      {
                        id: String(created.id ?? crypto.randomUUID()),
                        title: String(created.title ?? post.title),
                        content: String(created.description ?? post.content),
                        createdAt: (() => {
                          const v = created.created_at as unknown;
                          if (typeof v === "number")
                            return v < 1e12 ? v * 1000 : v;
                          if (typeof v === "string")
                            return new Date(v).getTime();
                          return Date.now();
                        })(),
                        postType: post.postType,
                        category: post.category,
                        tags: post.tags,
                        author_email: currentUser ?? undefined,
                        first_name: created.first_name,
                        last_name: created.last_name,
                      },
                      ...prev,
                    ]);
                  }
                } catch (e) {
                  console.error("Error creating post", e);
                } finally {
                  setActiveLoggedInPage("start");
                }
              }}
            />
          ) : activeLoggedInPage === "profil" ? (
            <ProfilePage
              userEmail={selectedProfileEmail ?? currentUser}
              isReadOnly={Boolean(selectedProfileEmail)}
              onBack={
                selectedProfileEmail
                  ? () => {
                      setSelectedProfileEmail(null);
                      setActiveLoggedInPage("start");
                    }
                  : undefined
              }
              onProfileUpdated={(nextEmail) => {
                localStorage.setItem("currentUser", nextEmail);
                setCurrentUser(nextEmail);
                setSelectedProfileEmail(null);
              }}
            />
          ) : activeLoggedInPage === "kategorier" ? (
            <CategoryPage
              posts={posts}
              onProfile={openProfileFromPost}
              initialCategory={selectedCategory}
              onContact={openChatFromPost}
            />
          ) : activeLoggedInPage === "inkorg" ? (
            <InboxPage pendingChat={pendingChat} />
          ) : (
            <LoggedInStartPage
              firstName={firstName}
              onCreatePost={() => setActiveLoggedInPage("skapa")}
              onExploreCategories={(category) => {
                setSelectedCategory(category ?? "allt");
                setActiveLoggedInPage("kategorier");
              }}
            />
          )}
        </MenuLoggedIn>
      </div>
    );
  }

  return (
    <HomePage
      onSignupSuccess={(email) => {
        setSessionExpired(false);
        setCurrentUser(email);
      }}
    >
      <div className="flex flex-col">
        {sessionExpired && (
          <div className="w-full bg-[var(--volly-forest-green)] font-['DM_Sans'] text-[var(--volly-white)] text-lg font-medium text-center py-1">
            Din session har gått ut. Logga in igen för att fortsätta.
          </div>
        )}
        <LoginPage
          initialEmail={prefillEmail}
          onLoginSuccess={(email) => setCurrentUser(email)}
        />
      </div>
    </HomePage>
  );
}

export default App;
