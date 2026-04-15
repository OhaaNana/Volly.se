import { useEffect } from "react";
import MyTextInput from "./components/MyTextInput";
import { useLogin } from "./hooks/useLogin";
import type { LoginPageProps } from "./types";

function LoginPage({ onCreateAccount, onLoginSuccess, initialEmail = "" }: LoginPageProps) {

  const {
    email, setEmail,
    password, setPassword,
    errorMessage, setErrorMessage,
    isLoading, login: originalLogin
  } = useLogin();

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail, setEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await originalLogin();
    if (success) {
      onLoginSuccess(email);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
      >
        <h2>
          SIGN IN
        </h2>

        <div>
          <label>Email</label>
          <MyTextInput
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }}
            placeholder="Email"
          />
        </div>

        <div>
          <label>Password</label>
          <MyTextInput
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }}
            placeholder="Password"
          />
        </div>

        {errorMessage && (
          <div className="error-box">
            <p>{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "LOGIN"}
        </button>

        <button
          type="button"
          onClick={onCreateAccount}
        >
          CREATE ACCOUNT
        </button>
      </form>
    </div>
  );
}

export default LoginPage;