import { useState } from "react";
import type { EmailStatus, SignupFormData, SignupResult, StoredUser } from "../types";

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

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const useSignup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    phone: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "email") setEmailStatus("idle");
    setErrorMessage("");
  };

  const checkEmail = async (email: string) => {
    if (!validateEmail(email)) {
      setEmailStatus("idle");
      return;
    }
    setEmailStatus("checking");
    try {
      const users = getUsers();
      const available = !users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      setEmailStatus(available ? "available" : "taken");
    } catch {
      setEmailStatus("idle");
    }
  };

  const submitRegister = async (): Promise<SignupResult> => {
    setErrorMessage("");

    if (!Object.values(formData).every(val => val.trim())) {
      setErrorMessage("Please fill in all fields");
      return { success: false };
    }

    if (emailStatus === "taken") {
      setErrorMessage("Email is already taken");
      return { success: false };
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return { success: false };
    }

    setIsLoading(true);
    try {
      const users = getUsers();
      const exists = users.some((u) => u.email.toLowerCase() === formData.email.toLowerCase());

      if (exists) {
        setErrorMessage("Email is already taken");
        return { success: false };
      }

      users.push(formData);
      saveUsers(users);
      return { success: true, email: formData.email };
    } catch {
      setErrorMessage("Registration failed.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errorMessage,
    isLoading,
    emailStatus,
    updateField,
    checkEmail,
    submitRegister
  };
};