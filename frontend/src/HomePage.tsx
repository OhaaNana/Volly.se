import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import upArrow from "./assets/upArrow.png";

type HomePageProps = {
  children?: ReactNode;
  onSignupSuccess?: (email: string) => void;
};

const AUTH_REGISTER_URL = "http://localhost:3001/api/auth/register";
const AUTH_LOGIN_URL = "http://localhost:3001/api/auth/login";

type NavItem = {
  id: string;
  label: string;
  href?: string;
};

const navItems: NavItem[] = [
  { id: "Vision", label: "Vår vision" },
  { id: "Funkar", label: "Hur Volly fungerar" },
  { id: "FAQ", label: "FAQ", href: "/faq" },
  { id: "Skapa konto", label: "Skapa konto" },
] as const;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function HomePage({ children, onSignupSuccess }: HomePageProps) {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loginStatus, setLoginStatus] = useState("");
  const [signupStatus, setSignupStatus] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const updateLoginField = (field: keyof typeof loginForm, value: string) => {
    setLoginForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateSignupField = (field: keyof typeof signupForm, value: string) => {
    setSignupForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginStatus("");
    setIsLoggingIn(true);

    try {
      const response = await fetch(AUTH_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const payload = (await response.json()) as {
        token?: string;
        refreshToken?: string;
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message ?? payload.error ?? "Login failed");
      }

      if (payload.token) localStorage.setItem("token", payload.token);
      if (payload.refreshToken)
        localStorage.setItem("refreshToken", payload.refreshToken);

      localStorage.setItem("currentUser", loginForm.email);
      onSignupSuccess?.(loginForm.email);
      setLoginStatus("Du är inloggad.");
    } catch (error) {
      setLoginStatus(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignupStatus("");

    if (!agreedToTerms) {
      setSignupStatus("Du måste godkänna villkoren innan du kan skapa konto.");
      return;
    }

    if (signupForm.password !== signupForm.repeatPassword) {
      setSignupStatus("Lösenorden matchar inte.");
      return;
    }

    setIsSigningUp(true);

    try {
      const response = await fetch(AUTH_REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: signupForm.firstName,
          last_name: signupForm.lastName,
          email: signupForm.email,
          password: signupForm.password,
        }),
      });

      const payload = (await response.json()) as {
        token?: string;
        refreshToken?: string;
        message?: string;
        error?: string;
        details?: string;
      };

      if (!response.ok) {
        throw new Error(
          payload.message ?? payload.details ?? payload.error ?? "Signup failed"
        );
      }

      if (payload.token) localStorage.setItem("token", payload.token);
      if (payload.refreshToken)
        localStorage.setItem("refreshToken", payload.refreshToken);

      localStorage.setItem("currentUser", signupForm.email);
      onSignupSuccess?.(signupForm.email);
      setSignupStatus("Kontot skapades.");
    } catch (error) {
      setSignupStatus(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      <div className="flex w-full flex-col overflow-hidden bg-background">
        <header className="relative inline-flex h-32 w-full items-center justify-between bg-primary-soft pl-14 pr-12 py-10">
          <button
            type="button"
            onClick={() => scrollToSection("top")}
            className="flex h-12 items-center gap-3"
          >
            <span className="font-['Emblema_One'] text-5xl font-normal leading-12 text-primary">
              Volly
            </span>
          </button>

          <nav className="flex items-center gap-1">
            {navItems.map((item) =>
              item.href ? (
                <Link
                  key={item.id}
                  to={item.href}
                  className="rounded-3xl px-4 py-2 font-['DM_Sans'] text-2xl font-semibold text-warm-foreground transition-colors hover:bg-white/40"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="rounded-3xl px-4 py-2 font-['DM_Sans'] text-2xl font-semibold text-warm-foreground transition-colors hover:bg-white/40"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          <div className="pointer-events-none absolute -left-20 top-32 h-0 w-360 border-t-2 border-border" />
        </header>

        <div className="flex flex-col gap-24">
          <section className="inline-flex w-full items-center justify-between rounded-bl-[30px] rounded-br-[30px] bg-linear-to-b from-primary-soft to-neutral-300 p-32">
            <div className="flex flex-1 items-center justify-center gap-2.5">
              <div className="justify-center font-['DM_Sans'] text-7xl font-medium leading-30 text-warm-foreground">
                <span>Enklare vardag. </span>
                <span className="font-bold">Tillsammans</span>
                <span>.</span>
              </div>
            </div>

            <div className="w-96">
              <div className="rounded-[30px] p-10">
                <form
                  onSubmit={handleLoginSubmit}
                  className="flex w-80 flex-col items-center gap-8"
                >
                  <div className="flex w-full flex-col items-start gap-2">
                    <div className="w-full text-center font-['DM_Sans'] text-3xl font-semibold leading-9 text-warm-foreground">
                      Logga in
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-4">
                    <label className="flex items-center rounded-md border-2 border-foreground bg-card p-3">
                      <input
                        name="email"
                        type="email"
                        value={loginForm.email}
                        onChange={(event) =>
                          updateLoginField("email", event.target.value)
                        }
                        placeholder="E-post"
                        className="w-full bg-transparent font-['DM_Sans'] text-base text-foreground outline-none placeholder:text-foreground/50"
                      />
                    </label>

                    <label className="flex items-center rounded-md border-2 border-foreground bg-card p-3">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(event) =>
                          updateLoginField("password", event.target.value)
                        }
                        placeholder="Lösenord"
                        className="w-full bg-transparent font-['DM_Sans'] text-base text-foreground outline-none placeholder:text-foreground/50"
                      />
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={(event) =>
                          setShowPassword(event.target.checked)
                        }
                        className="h-3.5 w-3.5 rounded-xs border-[1.5px] border-foreground accent-warm-foreground"
                      />
                      <span className="font-['DM_Sans'] text-sm text-foreground">
                        Visa lösenord
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="inline-flex items-center justify-center rounded-md border border-border bg-linear-to-r from-orange-300 to-red-400 px-12 py-3 text-base font-bold text-foreground shadow-[0px_8px_24px_-8px_rgba(22,26,38,0.08),0px_1px_3px_0px_rgba(22,26,38,0.05)] transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isLoggingIn ? "Loggar in..." : "Logga in"}
                    </button>

                    <div className="flex items-center justify-between gap-2 text-base font-semibold text-warm-foreground">
                      <button type="button">Glömt lösenord</button>
                    </div>

                    {loginStatus ? (
                      <p className="text-center text-sm text-foreground/75">
                        {loginStatus}
                      </p>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>
          </section>

          <section
            id="Vision"
            className="inline-flex h-168 w-full items-start justify-center gap-12 overflow-hidden bg-background px-20 py-28"
          >
            <div className="inline-flex w-225 max-w-225 flex-col items-start justify-start gap-6">
              <div className="h-16 self-stretch font-['DM_Sans'] text-5xl font-semibold leading-17 text-icon-active">
                Vår Vision
              </div>
              <div className="self-stretch font-['DM_Sans'] text-xl font-normal leading-8 text-foreground">
                Vår vision är att bygga en plattform, där det är enkelt och
                uppmuntrande att kunna be om hjälp med sina vardagliga sysslor.
                Vi vill skapa en gemenskap där människor känner sig trygga och
                modiga nog att kunna fråga om hjälp, och där andra kan kliva
                fram och bli någons ”arm” när det behövs.
                <br />
                <br />
                Alla har inte ett nätverk av familj eller vänner i sin närhet.
                Vår mission är att överbrygga klyftan mellan personliga nätverk
                och formell socialtjänst, för att säkerställa att alla har lika
                tillgång till stöd....
              </div>
              <button
                type="button"
                onClick={() => scrollToSection("Funkar")}
                className="inline-flex items-center gap-1.25 pt-6"
              >
                <span className="font-['DM_Sans'] text-xl font-medium leading-8 text-icon-active">
                  Läs mer
                </span>
                <div className="flex w-7 items-center justify-center overflow-hidden p-1">
                  <img src={upArrow} alt="" className="h-3 w-4 rotate-90" />
                </div>
              </button>
            </div>
          </section>

          <section
            id="Skapa konto"
            className="flex flex-col items-center justify-center gap-12 rounded-[30px] bg-primary-soft px-10 py-48"
          >
            <div className="flex w-80 flex-col items-center gap-8">
              <div className="flex flex-col items-start gap-2 self-stretch">
                <div className="self-stretch text-center font-['DM_Sans'] text-3xl font-semibold leading-9 text-warm-foreground">
                  Skapa konto
                </div>
              </div>

              <form
                onSubmit={handleSignupSubmit}
                className="flex w-80 max-w-80 min-w-64 flex-col items-start justify-center gap-4"
              >
                <div className="flex w-full items-center gap-3 overflow-hidden">
                  <label className="flex h-10 flex-1 items-center gap-2 rounded-sm border-2 border-foreground bg-card px-3 py-2">
                    <input
                      name="firstName"
                      value={signupForm.firstName}
                      onChange={(event) =>
                        updateSignupField("firstName", event.target.value)
                      }
                      placeholder="Förnamn *"
                      className="w-full bg-transparent font-['DM_Sans'] text-base text-foreground outline-none placeholder:text-foreground/50"
                    />
                  </label>
                  <label className="flex h-10 flex-1 items-center gap-2 rounded-sm border-2 border-foreground bg-card px-3 py-2">
                    <input
                      name="lastName"
                      value={signupForm.lastName}
                      onChange={(event) =>
                        updateSignupField("lastName", event.target.value)
                      }
                      placeholder="Efternamn *"
                      className="w-full bg-transparent font-['DM_Sans'] text-base text-foreground outline-none placeholder:text-foreground/50"
                    />
                  </label>
                </div>

                <label className="flex h-10 w-full items-center gap-2 rounded-sm border-2 border-foreground bg-card px-3 py-2">
                  <input
                    name="email"
                    type="email"
                    value={signupForm.email}
                    onChange={(event) =>
                      updateSignupField("email", event.target.value)
                    }
                    placeholder="E-post *"
                    className="w-full bg-transparent font-['DM_Sans'] text-base text-foreground outline-none placeholder:text-foreground/50"
                  />
                </label>

                <label className="flex h-10 w-full items-center gap-2 rounded-sm border-2 border-foreground bg-card px-3 py-2">
                  <input
                    name="password"
                    type="password"
                    value={signupForm.password}
                    onChange={(event) =>
                      updateSignupField("password", event.target.value)
                    }
                    placeholder="Lösenord *"
                    className="w-full bg-transparent font-['DM_Sans'] text-base text-foreground outline-none placeholder:text-foreground/50"
                  />
                </label>

                <label className="flex h-10 w-full items-center gap-2 rounded-sm border-2 border-foreground bg-card px-3 py-2">
                  <input
                    name="repeatPassword"
                    type="password"
                    value={signupForm.repeatPassword}
                    onChange={(event) =>
                      updateSignupField("repeatPassword", event.target.value)
                    }
                    placeholder="Upprepa lösenord *"
                    className="w-full bg-transparent font-['DM_Sans'] text-base text-foreground outline-none placeholder:text-foreground/50"
                  />
                </label>

                <label className="flex items-center gap-2 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(event) => setAgreedToTerms(event.target.checked)}
                    className="h-3.5 w-3.5 rounded-xs border-[1.5px] border-foreground accent-warm-foreground"
                  />
                  <span className="font-['DM_Sans'] text-sm text-foreground">
                    Jag har läst och godkänner villkoren
                  </span>
                </label>

                {signupStatus ? (
                  <p className="w-80 text-center text-sm text-foreground/75">
                    {signupStatus}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="inline-flex items-center justify-center rounded-md border border-border bg-linear-to-r from-orange-300 to-red-400 px-12 py-3 text-base font-bold text-warm-foreground shadow-[0px_8px_24px_-8px_rgba(22,26,38,0.08),0px_1px_3px_0px_rgba(22,26,38,0.05)] transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSigningUp ? "Skapar konto..." : "Skapa konto"}
                </button>
              </form>
            </div>
          </section>

          <section
            id="Funkar"
            className="flex h-200 flex-col items-center justify-center bg-background px-20 pb-24"
          >
            <div className="flex flex-col items-center justify-center gap-12 overflow-hidden">
              <div className="text-center font-['DM_Sans'] text-5xl font-semibold leading-13 text-icon-active">
                Hur Volly fungerar
              </div>
              <div className="inline-flex w-full max-w-5xl items-start justify-start gap-7">
                <div className="flex flex-1 flex-col items-start justify-start gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[50px] bg-primary-soft">
                    <div className="flex h-14 w-14 items-center justify-center">
                      <div className="h-8 w-8 rounded-full border-4 border-primary" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1 overflow-hidden self-stretch">
                    <div className="self-stretch font-['DM_Sans'] text-lg font-semibold text-forest">
                      Hitta eller skapa ett inlägg
                    </div>
                    <div className="self-stretch font-['DM_Sans'] text-lg font-normal leading-6 text-muted-foreground">
                      Utforska flödet för att hitta människor som söker eller
                      erbjuder stöd - eller skapa ett eget inlägg för att be
                      eller erbjuda hjälp till andra. <br />
                      <br />
                      När du hittar ett inlägg du vill svara på skickas en
                      meddelandeförfrågan för att starta en privat chatt mellan
                      er.
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-start justify-start gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[50px] bg-primary-soft">
                    <div className="flex h-14 w-14 items-center justify-center">
                      <div className="h-5 w-10 rounded-full border-4 border-primary" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1 overflow-hidden self-stretch">
                    <div className="self-stretch font-['DM_Sans'] text-lg font-semibold text-forest">
                      Chatta &amp; videosamtala
                    </div>
                    <div className="self-stretch font-['DM_Sans'] text-lg font-normal leading-6 text-muted-foreground">
                      Lär känna varandra tryggt direkt i Volly genom chatt och
                      videosamtal. <br />
                      <br />
                      Videosamtal blir tillgängligt först efter att en chatt har
                      startats, vilket fungerar som en extra säkerhetsåtgärd och
                      ger båda parter möjlighet att känna sig bekväma innan
                      vidare kontakt.
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-start justify-start gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[50px] bg-primary-soft">
                    <div className="flex h-14 w-14 items-center justify-center">
                      <div className="h-7 w-7 rounded-full border-4 border-primary" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1 overflow-hidden self-stretch">
                    <div className="self-stretch font-['DM_Sans'] text-lg font-semibold text-forest">
                      Hjälp tryggt &amp; säkert
                    </div>
                    <div className="self-stretch font-['DM_Sans'] text-lg font-normal leading-6 text-muted-foreground">
                      Verifierade konton, betyg och recensioner hjälper dig att
                      skapa säkra kontakter, samtidigt som möjligheten att vara
                      anonym ger extra integritet vid behov. <br />
                      <br />
                      För din säkerhet rekommenderar vi att du aldrig delar
                      känsliga eller personliga uppgifter med andra användare.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="flex w-full flex-col items-start justify-start gap-3.5 rounded-tl-[30px] rounded-tr-[30px] bg-primary-soft px-12 pb-6 pt-12">
            <div className="inline-flex w-full items-start justify-start gap-24 p-8">
              <div className="inline-flex flex-col items-start justify-start gap-4 self-stretch">
                <div className="font-['DM_Sans'] text-3xl font-semibold leading-6 text-warm-foreground">
                  Om oss
                </div>
                <div className="flex flex-col items-start justify-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => scrollToSection("Vision")}
                    className="self-stretch font-['DM_Sans'] text-xl font-normal leading-6 text-warm-foreground underline"
                  >
                    Vår vision
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("Funkar")}
                    className="self-stretch font-['DM_Sans'] text-xl font-normal leading-6 text-warm-foreground underline"
                  >
                    Hur Volly fungerar
                  </button>
                  <Link
                    to="/faq"
                    className="self-stretch font-['DM_Sans'] text-xl font-normal leading-6 text-warm-foreground underline"
                  >
                    FAQ
                  </Link>
                </div>
              </div>

              <div className="inline-flex flex-col items-start justify-start gap-12 self-stretch">
                <div className="flex flex-col items-start justify-start gap-4">
                  <div className="w-64 font-['DM_Sans'] text-3xl font-semibold leading-6 text-warm-foreground">
                    Kontakta oss
                  </div>
                  <a
                    href="mailto:info@volly.nu"
                    className="font-['DM_Sans'] text-xl font-normal leading-6 text-warm-foreground underline"
                  >
                    info@volly.nu
                  </a>
                </div>
                <div className="flex flex-col items-start justify-start gap-4">
                  <div className="font-['DM_Sans'] text-3xl font-semibold leading-6 text-warm-foreground">
                    Säkerhet &amp; Villkor
                  </div>
                  <button
                    type="button"
                    className="font-['DM_Sans'] text-xl font-normal leading-6 text-warm-foreground underline"
                  >
                    Användarvillkor
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col items-end justify-between self-stretch">
                <div className="flex flex-col items-end justify-center gap-2.5 py-16">
                  <div className="font-['Emblema_One'] text-7xl font-normal leading-6 text-primary opacity-70">
                    Volly
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-187.5">
              <div className="inline-flex items-center justify-center gap-2.5">
                <div className="font-['DM_Sans'] text-xl font-normal leading-6 text-muted-foreground">
                  © 2026 Volly
                </div>
              </div>
            </div>
          </footer>

          {children ? <div className="hidden">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
