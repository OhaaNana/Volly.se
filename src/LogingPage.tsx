import { useEffect, useState } from "react";
import MyTextInput from "./components/MyTextInput";
import { useLogin } from "./hooks/useLogin";
import type { LoginPageProps } from "./types";

function LoginPage({ onCreateAccount, onLoginSuccess, initialEmail = "" }: LoginPageProps) {
  const {
    email, setEmail,
    password, setPassword,
    errorMessage, setErrorMessage,
    isLoading, login: originalLogin
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail, setEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await originalLogin();
    if (success) {
      onLoginSuccess(email);
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-between px-20 py-10 bg-[#e5e5e5] rounded-3xl">
      {/* Vänster sida: Hero Text */}
      <div className="w-1/2">
        <h1 className="text-8xl font-medium leading-tight text-black tracking-tighter">
          Bli en del av Volly idag.
        </h1>
      </div>

      {/* Höger sida: Login-formulär */}
      <div className="w-[350px] flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-6 self-center">Logga in</h2>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <MyTextInput
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }}
              placeholder="E-post"
              className="w-full border-2 border-black p-2 rounded-md"
            />
          </div>

          <div className="flex flex-col gap-2">
            <MyTextInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }}
              placeholder="Lösenord"
              className="w-full border-2 border-black p-2 rounded-md"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              id="show-password" 
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="w-4 h-4"
            />
            <label htmlFor="show-password">Visa lösenord</label>
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm italic">
              <p>{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 font-bold rounded-md hover:opacity-90 transition-opacity"
          >
            {isLoading ? "Loggar in..." : "Logga in"}
          </button>

          <div className="flex justify-between w-full mt-2 text-[12px] font-medium">
            <button 
              type="button" 
              onClick={onCreateAccount}
              className="hover:underline"
            >
              Har du inget konto?
            </button>
            <button 
              type="button" 
              className="hover:underline"
            >
              Glömt ditt lösenord?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;