import { useState } from "react";
import type { EmailStatus, SignupFormData, SignupResult } from "../types";

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
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "email") {
      setEmailStatus("idle");
    }

    setErrorMessage("");
  };

  // Kontrollera email
  const checkEmail = async (email: string) => {
    if (!validateEmail(email)) {
      setEmailStatus("idle");
      return;
    }

    setEmailStatus("checking");

    try {
      const response = await fetch(
        `http://localhost:3001/check-email?email=${email}`
      );

      const data = await response.json();

      setEmailStatus(data.available ? "available" : "taken");
    } catch (error) {
      console.log(error);
      setEmailStatus("idle");
    }
  };

  // Registrera användare
  const submitRegister = async (): Promise<SignupResult> => {
    setErrorMessage("");

    // Validering
    if (!Object.values(formData).every((val) => val.trim())) {
      setErrorMessage("Please fill in all fields");
      return { success: false };
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage("Please enter a valid email");
      return { success: false };
    }

    if (emailStatus === "taken") {
      setErrorMessage("Email is already taken");
      return { success: false };
    }

    setIsLoading(true);

    try {
      console.log("REGISTER FETCH START");

      const response = await fetch("http://localhost:5174/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      console.log("REGISTER RESPONSE:", data);

      // Om backend skickar error
      if (!response.ok) {
        setErrorMessage(data.message || "Registration failed");

        return { success: false };
      }

      // Success
      return {
        success: true,
        email: formData.email,
      };
    } catch (error) {
      console.log(error);

      setErrorMessage("Server error");

      return {
        success: false,
      };
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
