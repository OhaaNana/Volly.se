import { useEffect, useState } from "react";
import MyTextInput from "./components/MyTextInput";
import { useLogin } from "./hooks/useLogin";
import type { LoginPageProps } from "./types";
import "./index.css";

function LoginPage({
  onLoginSuccess,
  initialEmail = "",
}: LoginPageProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errorMessage,
    setErrorMessage,
    isLoading,
    login: originalLogin,
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
    <div className="self-stretch h-[700px] px-20 py-12 bg-neutral-200 inline-flex justify-between items-center">
      <div className="flex-1 flex justify-center items-center gap-2.5">
        <div className="flex-1 justify-center text-black text-8xl font-medium font-['DM_Sans'] leading-[120px]">
          Lorem ipsum dolor sit amet lorem ipsum{" "}
        </div>
      </div>
      <div className="p-10 rounded-[30px] inline-flex flex-col justify-center items-center gap-12">
        <div className="flex flex-col justify-start items-center gap-8">
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch text-center justify-start text-black text-3xl font-medium font-['DM_Sans'] leading-8">
              Logga in
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="self-stretch flex flex-col justify-start items-start gap-4"
          >
            <div className="w-80 h-10 px-3 py-2 bg-white rounded outline outline-2 outline-offset-[-2px] outline-black inline-flex justify-start items-center gap-2">
              <MyTextInput
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="E-post"
                className="flex-1 justify-start text-black text-base font-normal font-['DM_Sans'] leading-5 line-clamp-1 bg-transparent border-none outline-none"
              />
            </div>
            <div className="w-80 h-10 px-3 py-2 bg-white rounded outline outline-2 outline-offset-[-2px] outline-black inline-flex justify-start items-center gap-2">
              <MyTextInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="Lösenord"
                className="flex-1 justify-start text-black text-base font-normal font-['DM_Sans'] leading-5 line-clamp-1 bg-transparent border-none outline-none"
              />
            </div>
            <div className="inline-flex justify-start items-center gap-2">
              <div className="w-4 h-4 relative overflow-hidden">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Visa lösenord"
                />
                <div className={`w-3.5 h-3.5 left-[1.33px] top-[1.30px] absolute ${showPassword ? 'bg-black' : 'bg-white border-2 border-black'}`} />
              </div>
              <div className="justify-start text-black text-base font-normal font-['DM_Sans'] leading-4">
                Visa lösenord
              </div>
            </div>
            <div className="w-80 h-10 px-12 bg-black rounded inline-flex justify-center items-center gap-2.5 overflow-hidden">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-full justify-start text-white text-base font-medium font-['DM_Sans'] leading-5"
              >
                {isLoading ? "Loggar in..." : "Logga in"}
              </button>
            </div>
            {errorMessage && (
              <div className="w-80 text-red-600 text-sm italic">
                <p>{errorMessage}</p>
              </div>
            )}
            <div className="self-stretch inline-flex justify-end items-center overflow-hidden">
              <button
                type="button"
                className="justify-start text-black text-base font-normal font-['DM_Sans'] leading-4"
              >
                Glömt ditt lösenord?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
