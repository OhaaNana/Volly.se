import { useEffect, useState } from "react";
import LoginPage from "./LogingPage";
import SignupPage from "./signupPage";
import HomePage from "./pages/HomePage";
import HomePageLoggedIn from "./pages/HomePageLoggIn";

export function App() {
  
  //status = variabel som kan ändras
  //setStatus = Vad som avgör att den ändras
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setStatus(data.ok ? "Backend funkar" : "ERROR, Backend funkar inte"));
  }, []);
  
  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    localStorage.getItem("currentUser")
  );

  const [view, setView] = useState<"login" | "signup">("login");
  const [prefillEmail, setPrefillEmail] = useState("");

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setView("login");
  };

  if (currentUser) {
    return (
      <HomePageLoggedIn
        currentUser={currentUser}
        onLogout={logout}
      />
    );
  }

  return (
    <HomePage>
      <h1>{status}</h1>
      {view === "login" ? (
        <LoginPage
          initialEmail={prefillEmail}
          onLoginSuccess={(email) => {
            localStorage.setItem("currentUser", email);
            setCurrentUser(email);
          }}
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