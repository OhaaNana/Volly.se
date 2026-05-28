import { useState } from "react";
import { saveToken } from "../utils/auth";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return false;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setErrorMessage(
          (payload && (payload.message || payload.error)) || "Login failed"
        );
        return false;
      }

      const data = await res.json();
      const token = data?.token;
      if (!token) {
        setErrorMessage("No token returned from server");
        return false;
      }

      saveToken(token);
      localStorage.setItem("currentUser", email);
      if (data?.id != null) {
        localStorage.setItem("userId", String(data.id));
      }
      if (data?.onboarding_completed === false) {
        localStorage.setItem("needsOnboarding", "true");
      }
      return true;
    } catch {
      setErrorMessage("Login failed.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errorMessage,
    setErrorMessage,
    isLoading,
    login,
  };
};
