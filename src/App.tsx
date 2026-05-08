import { useState } from "react";
import LoginPage from "./pages/LogingPage";
import SignupPage from "./pages/signupPage";
import HomePage from "./pages/HomePage";
import MenuLoggedIn, { type MenuItem } from "./components/MenuLoggedIn";
import CreatePostPage from "./pages/CreatePostPage";
import LoggedInStartPage from "./pages/LoggedInStartPage";
import ProfilePage from "./pages/ProfilePage";

export function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem("currentUser"));
  const [view, setView] = useState<"login" | "signup">("login");
  const [prefillEmail, setPrefillEmail] = useState("");
  const [posts, setPosts] = useState<Array<{ id: string; title: string; content: string; createdAt: number }>>([]);
  const loggedInMenuItems = [
    { id: "start", label: "Start", flaticonClassName: "fi fi-rr-home" },
    { id: "kategorier", label: "Kategorier", flaticonClassName: "fi fi-rr-apps" },
    { id: "skapa", label: "Skapa", flaticonClassName: "fi fi-rr-edit" },
    { id: "inkorg", label: "Inkorg", flaticonClassName: "fi fi-rs-comment-dots" },
    { id: "sparat", label: "Sparat", flaticonClassName: "fi fi-rr-bookmark" },
    { id: "profil", label: "Profil", flaticonClassName: "fi fi-rr-circle-user" },
  ] as const satisfies readonly MenuItem<
    "start" | "kategorier" | "skapa" | "inkorg" | "sparat" | "profil"
  >[];
  type LoggedInMenuId = (typeof loggedInMenuItems)[number]["id"];
  const [activeLoggedInPage, setActiveLoggedInPage] = useState<LoggedInMenuId>("start");

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setView("login");
  };

  const firstName =
    currentUser?.split("@")[0]?.split(/[._-]/)[0]?.trim().replace(/^\w/, (c) => c.toUpperCase()) || "Anna";

  if (currentUser) {
    return (
      <div>
        <MenuLoggedIn
          items={loggedInMenuItems}
          activeId={activeLoggedInPage}
          onNavigate={setActiveLoggedInPage}
          brandName="Volly"
          brandInitial="V"
          user={{ name: currentUser, initials: currentUser.slice(0, 2).toUpperCase(), rating: 4.7 }}
        >
          {activeLoggedInPage === "skapa" ? (
            <CreatePostPage
              onSubmit={({ title, content }) => {
                setPosts((prev) => [
                  { id: crypto.randomUUID(), title, content, createdAt: Date.now() },
                  ...prev,
                ]);
                setActiveLoggedInPage("start");
              }}
            />
          ) : activeLoggedInPage === "profil" ? (
            <ProfilePage userEmail={currentUser} onLogout={logout} />
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
          onCreateAccount={() => setView("signup")}
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
