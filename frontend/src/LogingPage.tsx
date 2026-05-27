import { useEffect, useState } from "react";
import MyTextInput from "./components/MyTextInput";
import { useLogin } from "./hooks/useLogin";
import type { LoginPageProps } from "./types";

function LoginPage({ onLoginSuccess, initialEmail = "" }: LoginPageProps) {
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

  const scrollToSignup = () => {
    document
      .getElementById("Skapa konto")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await originalLogin();
    if (success) {
      onLoginSuccess(email);
    }
  };

  return (
    <section className="w-full bg-linear-to-b from-primary-soft to-neutral-300 rounded-bl-[30px] rounded-br-[30px]">
      <div className="w-full max-w-7xl mx-auto p-32 flex justify-between items-center gap-12">
        <div className="flex-1 flex justify-center items-center gap-2.5">
          <h1 className="flex-1 text-center text-warm-foreground font-['DM_Sans'] leading-30">
            <span className="text-7xl font-medium">Enklare vardag. </span>
            <span className="text-7xl font-bold">Tillsammans</span>
            <span className="text-7xl font-medium">.</span>
          </h1>
        </div>

        <div className="w-96 inline-flex flex-col justify-start items-start gap-2.5 shrink-0">
          <div className="self-stretch p-10 rounded-[30px] flex flex-col justify-center items-center gap-12">
            <div className="w-80 flex flex-col justify-start items-center gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <h2 className="self-stretch text-center text-warm-foreground text-3xl font-semibold font-['DM_Sans'] leading-9">
                  Logga in
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                className="self-stretch flex flex-col justify-start items-start gap-4"
              >
                <div className="self-stretch p-3 bg-card rounded-md outline-2 -outline-offset-2 outline-foreground inline-flex justify-start items-center">
                  <MyTextInput
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="E-post"
                    className="flex-1 w-full opacity-50 text-foreground text-base font-normal font-['DM_Sans'] leading-4 bg-transparent border-none outline-none placeholder:text-foreground"
                  />
                </div>

                <div className="self-stretch p-3 bg-card rounded-md outline-2 -outline-offset-2 outline-foreground inline-flex justify-start items-center">
                  <MyTextInput
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="Lösenord"
                    className="flex-1 w-full opacity-50 text-foreground text-base font-normal font-['DM_Sans'] leading-4 bg-transparent border-none outline-none placeholder:text-foreground"
                  />
                </div>

                <label className="inline-flex justify-start items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword((current) => !current)}
                    className="sr-only"
                  />
                  <span
                    className={`size-3.5 rounded-xs border-[1.50px] border-foreground flex items-center justify-center ${
                      showPassword ? "bg-foreground" : "bg-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    {showPassword ? (
                      <span className="text-[8px] text-card leading-none">
                        ✓
                      </span>
                    ) : null}
                  </span>
                  <span className="text-foreground text-sm font-normal font-['DM_Sans'] leading-4">
                    Visa lösenord
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="self-stretch px-12 py-3 btn-volly-cta inline-flex justify-center items-center disabled:opacity-60"
                >
                  <span className="text-foreground text-base font-bold font-['DM_Sans'] leading-4">
                    {isLoading ? "Loggar in..." : "Logga in"}
                  </span>
                </button>

                {errorMessage ? (
                  <p className="self-stretch text-sm text-red-600 font-['DM_Sans']">
                    {errorMessage}
                  </p>
                ) : null}

                <div className="self-stretch inline-flex justify-between items-center">
                  <button
                    type="button"
                    onClick={scrollToSignup}
                    className="text-warm-foreground text-base font-semibold font-['DM_Sans'] leading-4 hover:opacity-80"
                  >
                    Skapa konto
                  </button>
                  <button
                    type="button"
                    className="text-warm-foreground text-base font-semibold font-['DM_Sans'] leading-4 hover:opacity-80"
                  >
                    Glömt lösenord
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
