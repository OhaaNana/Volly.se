import { useState } from "react";

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
      const res = await fetch("http://127.0.0.1:3001/login", {
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

      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", email);
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
