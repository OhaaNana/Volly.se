import { useEffect, useState } from "react";
import MyTextInput from "../components/MyTextInput";
import { useLogin } from "../hooks/useLogin";
import type { LoginPageProps } from "../types";

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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotStatus, setForgotStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [forgotError, setForgotError] = useState("");

  const formSubmitEmail = import.meta.env.VITE_FORMSUBMIT_EMAIL as
    | string
    | undefined;

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail, setEmail]);

  const openForgotPassword = () => {
    setForgotEmail(email);
    setForgotMessage("");
    setForgotStatus("idle");
    setForgotError("");
    setShowForgotPassword(true);
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotStatus("idle");
    setForgotError("");
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formSubmitEmail?.trim()) {
      setForgotStatus("error");
      setForgotError(
        "E-post för återställning är inte konfigurerad. Lägg till VITE_FORMSUBMIT_EMAIL i frontend/.env."
      );
      return;
    }

    setForgotStatus("submitting");
    setForgotError("");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(formSubmitEmail.trim())}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: forgotEmail.trim(),
            message: forgotMessage.trim() || "(inget meddelande)",
            _subject: "Glömt lösenord – Volly",
            _template: "table",
          }),
        }
      );

      const result = (await response.json().catch(() => null)) as {
        success?: string;
      } | null;
      if (!response.ok || result?.success !== "true") {
        throw new Error("Kunde inte skicka förfrågan");
      }

      setForgotStatus("success");
    } catch {
      setForgotStatus("error");
      setForgotError(
        "Något gick fel. Försök igen om en stund eller kontakta support."
      );
    }
  };

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
    <section className="w-full bg-gradient-primary-soft rounded-bl-[30px] rounded-br-[30px]">
      <div className="w-full max-w-7xl mx-auto p-32 flex justify-between items-center gap-12">
        <div className="flex-1 flex justify-center items-center gap-2.5">
          <h1 className="flex-1 text-left text-warm-foreground leading-28">
            <span className="text-7xl font-medium">Enklare vardag. </span>
            <span className="text-7xl font-bold">Tillsammans.</span>
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
                    className="flex-1 w-full opacity-50 text-foreground text-base font-normal leading-4 border-none outline-none placeholder:text-foreground"
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
                    className="flex-1 w-full opacity-50 text-foreground text-base font-normal leading-4 border-none outline-none placeholder:text-foreground"
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
                    className={`size-3.5 rounded-xs border-[1.75px] border-foreground flex items-center justify-center ${
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
                  <span className="text-foreground text-sm font-normal leading-4">
                    Visa lösenord
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="self-stretch px-12 py-3 btn-volly-cta inline-flex justify-center items-center disabled:opacity-60"
                >
                  <span className="text-foreground text-base font-bold leading-4">
                    {isLoading ? "Loggar in..." : "Logga in"}
                  </span>
                </button>

                {errorMessage ? (
                  <p className="self-stretch text-sm text-destructive">
                    {errorMessage}
                  </p>
                ) : null}

                <div className="self-stretch inline-flex justify-between items-center">
                  <button
                    type="button"
                    onClick={scrollToSignup}
                    className="text-warm-foreground text-base font-semibold leading-4 hover:opacity-80"
                  >
                    Skapa konto
                  </button>
                  <button
                    type="button"
                    onClick={openForgotPassword}
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

      {showForgotPassword ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeForgotPassword}
        >
          <div
            className="w-96 max-w-full p-8 bg-card rounded-[30px] shadow-lg flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {forgotStatus === "success" ? (
              <>
                <h3
                  id="forgot-password-title"
                  className="text-warm-foreground text-2xl font-semibold font-['DM_Sans'] text-center"
                >
                  Förfrågan skickad
                </h3>
                <p className="text-foreground text-sm font-normal font-['DM_Sans'] text-center">
                  Om din e-post finns registrerad återkommer vi så snart vi kan.
                </p>
                <button
                  type="button"
                  onClick={closeForgotPassword}
                  className="self-stretch px-12 py-3 btn-volly-cta inline-flex justify-center items-center"
                >
                  <span className="text-foreground text-base font-bold font-['DM_Sans'] leading-4">
                    Stäng
                  </span>
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <h3
                    id="forgot-password-title"
                    className="text-warm-foreground text-2xl font-semibold font-['DM_Sans'] text-center"
                  >
                    Glömt lösenord
                  </h3>
                  <p className="text-foreground text-sm font-normal font-['DM_Sans'] text-center opacity-70">
                    Fyll i din e-post så återkommer vi med hjälp att återställa
                    kontot.
                  </p>
                </div>

                <form
                  onSubmit={handleForgotPasswordSubmit}
                  className="flex flex-col gap-4"
                >
                  <div className="p-3 bg-card rounded-md outline outline-2 outline-offset-[-2px] outline-foreground">
                    <MyTextInput
                      type="email"
                      name="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="E-post"
                      className="w-full text-foreground text-base font-normal font-['DM_Sans'] leading-4 bg-transparent border-none outline-none placeholder:text-foreground opacity-50"
                    />
                  </div>

                  <div className="p-3 bg-card rounded-md outline outline-2 outline-offset-[-2px] outline-foreground">
                    <textarea
                      name="message"
                      value={forgotMessage}
                      onChange={(e) => setForgotMessage(e.target.value)}
                      placeholder="Meddelande (valfritt)"
                      rows={3}
                      className="w-full resize-none text-foreground text-base font-normal font-['DM_Sans'] leading-5 bg-transparent border-none outline-none placeholder:text-foreground opacity-50"
                    />
                  </div>

                  {forgotError ? (
                    <p className="text-sm text-red-600 font-['DM_Sans']">
                      {forgotError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={forgotStatus === "submitting"}
                    className="px-12 py-3 btn-volly-cta inline-flex justify-center items-center disabled:opacity-60"
                  >
                    <span className="text-foreground text-base font-bold font-['DM_Sans'] leading-4">
                      {forgotStatus === "submitting" ? "Skickar..." : "Skicka"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={closeForgotPassword}
                    className="text-warm-foreground text-sm font-semibold font-['DM_Sans'] hover:opacity-80"
                  >
                    Avbryt
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default LoginPage;
