import { useState } from "react";
import LoginPage from "./LogingPage";
import SignupPage from "./signupPage";

export function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem("currentUser"));
  const [view, setView] = useState<"login" | "signup">("login");
  const [prefillEmail, setPrefillEmail] = useState("");

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setView("login");
  };

  return (
    <div>
      <h1>Zero bugs heros</h1>

      {currentUser ? (
        <div>
          <p>You are logged in as: <strong>{currentUser}</strong></p>
          <button type="button" onClick={logout}>
            Log out
          </button>
        </div>
      ) : view === "login" ? (
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

    </div>
  );
}

export default App;
