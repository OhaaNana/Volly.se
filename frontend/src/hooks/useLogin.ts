import { useState } from "react";

export const useLogin = (initialEmail = "") => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async (): Promise<string | null> => {
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return null;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Login failed");
        return null;
      }
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      return email;
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error. Try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, errorMessage, setErrorMessage, isLoading, login };
};