import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tokenExpiry, clearAuth } from "./utils/auth";
import LoginPage from "./pages/LogingPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
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
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    localStorage.getItem("currentUser")
  );
  const [sessionExpired, setSessionExpired] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(
    () => localStorage.getItem("needsOnboarding") === "true"
  );
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

  const pathToTab = (pathname: string): LoggedInMenuId => {
    if (pathname.startsWith("/kategorier")) return "kategorier";
    if (pathname.startsWith("/skapa")) return "skapa";
    if (pathname.startsWith("/inkorg")) return "inkorg";
    if (pathname.startsWith("/profil")) return "profil";
    return "start";
  };
  const activeLoggedInPage = pathToTab(location.pathname);

  const goToTab = useCallback(
    (next: LoggedInMenuId) => {
      navigate(next === "start" ? "/" : `/${next}`);
    },
    [navigate]
  );

  const loadPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
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
  }, []);

  useEffect(() => {
    // Initial load + polling + focus refetch keep the feed live without WS.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPosts();
    const interval = setInterval(loadPosts, 20000);
    window.addEventListener("focus", loadPosts);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", loadPosts);
    };
  }, [loadPosts]);

  useEffect(() => {
    if (activeLoggedInPage === "start" || activeLoggedInPage === "kategorier") {
      // Refetch when the user lands on a feed view so they always see fresh posts.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadPosts();
    }
  }, [activeLoggedInPage, loadPosts]);

  const handleLoggedInNavigate = (nextPage: LoggedInMenuId) => {
    if (nextPage === "profil") {
      setSelectedProfileEmail(null);
    }
    if (nextPage === "kategorier") {
      setSelectedCategory(undefined);
    }
    goToTab(nextPage);
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
      goToTab("inkorg");
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
    goToTab("profil");
  };

  const logout = useCallback(
    (expired = false) => {
      clearAuth();
      setCurrentUser(null);
      setNeedsOnboarding(false);
      localStorage.removeItem("needsOnboarding");
      if (expired) setSessionExpired(true);
      navigate("/");
    },
    [navigate]
  );

  useEffect(() => {
    if (!currentUser) return;
    const check = () => {
      if (tokenExpiry()) logout(true);
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
      <div className="w-full min-h-screen bg-background flex flex-col">
        <Navbar hideLinks />
        <main className="flex-1 flex flex-col">
          <OnboardingPage
            onComplete={async (data) => {
              console.log("Onboarding complete:", data);
              try {
                const token = localStorage.getItem("token");
                await fetch("/api/users/me/onboarding", {
                  method: "PATCH",
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
              } catch (e) {
                console.error("Failed to persist onboarding completion", e);
              }
              setNeedsOnboarding(false);
              localStorage.removeItem("needsOnboarding");
            }}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentUser) {
    return (
      <div className="h-screen w-full overflow-hidden bg-background">
        <MenuLoggedIn<LoggedInMenuId>
          items={LOGGED_IN_MENU_ITEMS}
          activeId={activeLoggedInPage}
          onNavigate={handleLoggedInNavigate}
          onLogout={() => logout()}
          user={{
            name: currentUser,
            initials: currentUser.slice(0, 2).toUpperCase(),
          }}
        >
          {activeLoggedInPage === "skapa" ? (
            <CreatePostPage
              onCancel={() => goToTab("start")}
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
                  goToTab("start");
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
                      goToTab("start");
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
              onCreatePost={() => goToTab("skapa")}
              onExploreCategories={(category) => {
                setSelectedCategory(category ?? "allt");
                goToTab("kategorier");
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
        setNeedsOnboarding(true);
        localStorage.setItem("needsOnboarding", "true");
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
          onLoginSuccess={(email) => {
            setCurrentUser(email);
            setSessionExpired(false);
            setNeedsOnboarding(
              localStorage.getItem("needsOnboarding") === "true"
            );
          }}
        />
      </div>
    </HomePage>
  );
}

export default App;
