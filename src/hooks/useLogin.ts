import { useState } from "react";
import type { StoredUser } from "../types";

const USERS_KEY = "users";

const getUsers = (): StoredUser[] => {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

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
      const users = getUsers();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        setErrorMessage("User not found.");
        return false;
      }

      if (user.password !== password) {
        setErrorMessage("Invalid password.");
        return false;
      }

      localStorage.setItem("currentUser", user.email);
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
