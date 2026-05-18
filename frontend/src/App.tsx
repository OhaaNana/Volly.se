import { useState, useEffect } from "react";
import LoginPage from "./LogingPage";
import SignupPage from "./signupPage";
import HomePage from "./HomePage";
import "./index.css";
import MenuLoggedIn, { type MenuItem } from "./components/MenuLoggedIn";
import CreatePostPage from "./pages/CreatePostPage";
import LoggedInStartPage from "./pages/LoggedInStartPage";
import CategoryPage from "./pages/CategoryPage";
import InboxPage from "./pages/InboxPage";
import ProfilePage from "./pages/ProfilePage";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  postType?: "seek" | "offer";
  category?: string;
  tags?: string[];
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
  const [view, setView] = useState<"login" | "signup">("login");
  const [prefillEmail, setPrefillEmail] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadPosts() {
      try {
        const res = await fetch("http://localhost:3001/posts");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        const mapped: Post[] = (data as Record<string, unknown>[]).map((p) => ({
          id: String(p.id),
          title: String(p.title ?? ""),
          content: String(p.description ?? p.content ?? ""),
          createdAt: p.created_at
            ? new Date(p.created_at as string).getTime()
            : Date.now(),
          postType: helpTypeToPostType(p.help_type),
          category: p.category != null ? String(p.category) : undefined,
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
  const loggedInMenuItems = [
    { id: "start", label: "Start", flaticonClassName: "fi fi-rr-home" },
    {
      id: "kategorier",
      label: "Kategorier",
      flaticonClassName: "fi fi-rr-apps",
    },
    { id: "skapa", label: "Skapa", flaticonClassName: "fi fi-rr-edit" },
    {
      id: "inkorg",
      label: "Inkorg",
      flaticonClassName: "fi fi-rs-comment-dots",
    },
    { id: "sparat", label: "Sparat", flaticonClassName: "fi fi-rr-bookmark" },
    {
      id: "profil",
      label: "Profil",
      flaticonClassName: "fi fi-rr-circle-user",
    },
  ] as const satisfies readonly MenuItem<
    "start" | "kategorier" | "skapa" | "inkorg" | "sparat" | "profil"
  >[];
  type LoggedInMenuId = (typeof loggedInMenuItems)[number]["id"];
  const [activeLoggedInPage, setActiveLoggedInPage] =
    useState<LoggedInMenuId>("start");

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setView("login");
  };

  const firstName =
    currentUser
      ?.split("@")[0]
      ?.split(/[._-]/)[0]
      ?.trim()
      .replace(/^\w/, (c) => c.toUpperCase()) || "Anna";

  if (currentUser) {
    return (
      <div className="min-h-dvh w-full bg-Colors-background">
        <MenuLoggedIn
          items={loggedInMenuItems}
          activeId={activeLoggedInPage}
          onNavigate={setActiveLoggedInPage}
          brandName="Volly"
          brandInitial="V"
          user={{
            name: currentUser,
            initials: currentUser.slice(0, 2).toUpperCase(),
            rating: 4.7,
          }}
        >
          {activeLoggedInPage === "skapa" ? (
            <CreatePostPage
              onCancel={() => setActiveLoggedInPage("start")}
              onSubmit={(post) => {
                setPosts((prev) => [
                  {
                    id: crypto.randomUUID(),
                    title: post.title,
                    content: post.content,
                    createdAt: Date.now(),
                    postType: post.postType,
                    category: post.category,
                    tags: post.tags,
                  },
                  ...prev,
                ]);
                setActiveLoggedInPage("start");
              }}
            />
          ) : activeLoggedInPage === "profil" ? (
            <ProfilePage userEmail={currentUser} onLogout={logout} />
          ) : activeLoggedInPage === "kategorier" ? (
            <CategoryPage posts={posts} />
          ) : activeLoggedInPage === "inkorg" ? (
            <InboxPage />
          ) : (
            <LoggedInStartPage
              firstName={firstName}
              onCreatePost={() => setActiveLoggedInPage("skapa")}
              onExploreCategories={() => setActiveLoggedInPage("kategorier")}
              onProfile={() => setActiveLoggedInPage("profil")}
              posts={posts}
            />
          )}
        </MenuLoggedIn>
      </div>
    );
  }

  return (
    <HomePage>
      {view === "login" ? (
        <LoginPage
          initialEmail={prefillEmail}
          onLoginSuccess={(email) => setCurrentUser(email)}
        />
      ) : (
        <SignupPage
          onBackToLogin={() => setView("login")}
          onSignupSuccess={(email) => {
            setPrefillEmail(email);
            setView("login");
          }}
        />
      )}
    </HomePage>
  );
}

export default App;
