const TOKEN_KEY = "token";
const EXPIRY_KEY = "tokenExpiry";
const USER_KEY = "currentUser";

const ONE_HOUR_MS = 60 * 60 * 1000;

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, String(Date.now() + ONE_HOUR_MS));
}

export function getToken(): string | null {
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (expiry && Date.now() > Number(expiry)) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function isTokenExpired(): boolean {
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (!expiry) return false;
  return Date.now() > Number(expiry);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("userId");
}
