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
      console.log("LOGIN FETCH START");

      const response = await fetch("http://localhost:5174/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed");

        return false;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Spara current user
      localStorage.setItem("currentUser", email);

      return true;
    } catch (error) {
      console.log(error);

      setErrorMessage("Server error");

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
