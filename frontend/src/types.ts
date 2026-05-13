import type { InputHTMLAttributes } from "react";

export type StoredUser = {
  phone: string;
  email: string;
  password: string;
};

export type SignupFormData = {
  phone: string;
  email: string;
  password: string;
};

export type EmailStatus = "idle" | "checking" | "available" | "taken";

export type SignupResult = {
  success: boolean;
  email?: string;
};

export type LoginPageProps = {
  onCreateAccount: () => void;
  onLoginSuccess: (email: string) => void;
  initialEmail?: string;
};

export type SignupPageProps = {
  onBackToLogin: () => void;
  onSignupSuccess: (email: string) => void;
};

export type MyTextInputProps = InputHTMLAttributes<HTMLInputElement>;
