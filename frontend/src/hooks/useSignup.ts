import { useState } from "react";
import type {
  EmailStatus,
  SignupFormData,
  SignupResult,
  StoredUser,
} from "../types";

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

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
      const available = !users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      setEmailStatus(available ? "available" : "taken");
    } catch {
      setEmailStatus("idle");
    }
  };

  const submitRegister = async (): Promise<SignupResult> => {
    setErrorMessage("");

    if (!Object.values(formData).every((val) => val.trim())) {
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
      const res = await fetch("http://127.0.0.1:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setErrorMessage(
          (payload && (payload.message || payload.error)) ||
            "Registration failed"
        );
        return { success: false };
      }

      const data = await res.json();
      // backend returns token, store it
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

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
    submitRegister,
  };
};
