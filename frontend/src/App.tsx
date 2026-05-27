import { useState, useEffect, useCallback } from "react";
import { isTokenExpired, clearAuth } from "./utils/auth";
import LoginPage from "./pages/LogingPage";
import HomePage from "./pages/HomePage";
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
import OnboardingPage from "./pages/Onboarding/OnboardingPage";
import ConfirmDialog from "./components/ConfirmDialog";

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
  const [needsOnboarding, setNeedsOnboarding] = useState(false); //added a new onboarding state-variable
  const [prefillEmail] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedProfileEmail, setSelectedProfileEmail] = useState<
    string | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryKey | undefined
  >(undefined);
  const [pendingChat, setPendingChat] = useState<ChatPreview | null>(null);
  const [pendingDeletePostId, setPendingDeletePostId] = useState<string | null>(
    null
  );

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
          createdAt: (() => {
            const v = p.created_at as unknown;
            if (typeof v === "number") {
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

  const handleDeletePost = useCallback((postId: string) => {
    setPendingDeletePostId(postId);
  }, []);

  const cancelDeletePost = useCallback(() => {
    setPendingDeletePostId(null);
  }, []);

  const confirmDeletePost = useCallback(async () => {
    const postId = pendingDeletePostId;
    if (!postId) return;
    setPendingDeletePostId(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        console.error("Failed to delete post", res.status);
        return;
      }

      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (e) {
      console.error("Error deleting post", e);
    }
  }, [pendingDeletePostId]);

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
    setNeedsOnboarding(false); //added a onboarding flag on logout clear
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

  //show onboarding after signup
  if (currentUser && needsOnboarding) {
    return (
      <OnboardingPage
        onComplete={(data) => {
          // TODO: save onboarding data to your backend here
          console.log("Onboarding complete:", data);
          setNeedsOnboarding(false);
        }}
      />
    );
  }

  if (currentUser) {
    return (
      <div className="h-screen w-full overflow-hidden bg-background">
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
                  } else {
                    const created = await res.json();
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
              onDeletePost={handleDeletePost}
              currentUserEmail={currentUser}
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
        <ConfirmDialog
          open={pendingDeletePostId !== null}
          title="Ta bort inlägg?"
          description="Inlägget tas bort permanent och går inte att återställa."
          confirmLabel="Ta bort inlägg"
          cancelLabel="Avbryt"
          onConfirm={confirmDeletePost}
          onCancel={cancelDeletePost}
        />
      </div>
    );
  }

  return (
    <HomePage
      onSignupSuccess={(email) => {
        setSessionExpired(false);
        setCurrentUser(email);
        setNeedsOnboarding(true); //added the onboarding-after-signup trigger
      }}
    >
      <div className="flex flex-col">
        {sessionExpired && (
          <div className="w-full bg-(--volly-forest-green) text-primary-foreground text-lg font-medium text-center py-1">
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
