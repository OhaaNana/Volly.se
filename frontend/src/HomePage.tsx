import { useState, type FormEvent, type ReactNode } from "react";
import { saveToken } from "./utils/auth";
import Navbar from "./Navbar";
import upArrow from "./assets/upArrow.png";
import Footer from "./components/footer";
import HowVollyWorks from "./components/HowVollyWorks";

type HomePageProps = {
  children: ReactNode;
  onSignupSuccess?: (email: string) => void;
};

const AUTH_URL = "/api/auth/register";

const scroll = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

function HomePage({ children, onSignupSuccess }: HomePageProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const updateField = (key: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
    setStatusMessage("");
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    if (!agreedToTerms) {
      setStatusMessage("Du måste godkänna villkoren för att skapa ett konto.");
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      setStatusMessage("Lösenorden matchar inte.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(AUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        message?: string;
        error?: string;
        details?: string;
        token?: string;
      } | null;

      if (!response.ok) {
        setStatusMessage(
          payload?.message ??
            payload?.error ??
            "Det gick inte att skapa kontot."
        );
        return;
      }

      if (payload?.token) saveToken(payload.token);
      localStorage.setItem("currentUser", formData.email);
      onSignupSuccess?.(formData.email);
      setStatusMessage("Kontot skapades.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        repeatPassword: "",
      });
      setAgreedToTerms(false);
    } catch {
      setStatusMessage("Det gick inte att skapa kontot. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="w-full flex flex-col gap-24">
        {children}

        <section id="Vision" className="w-full min-h-168 py-28 bg-background">
          <div className="w-full max-w-7xl mx-auto px-20 flex justify-center items-start">
            <div className="w-full max-w-225 flex flex-col justify-start items-start gap-6">
              <h2 className="self-stretch text-icon-active text-5xl font-semibold font-['DM_Sans'] leading-17">
                Vår Vision
              </h2>
              <p className="self-stretch text-foreground text-xl font-normal font-['DM_Sans'] leading-8">
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
                tillgång till stöd.
              </p>
              <div className="pt-6 inline-flex justify-start items-center gap-1.25">
                <span className="text-icon-active text-xl font-medium font-['DM_Sans'] leading-8">
                  Läs mer
                </span>
                <span
                  className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-8 border-l-transparent border-r-transparent border-t-icon-active"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="Skapa konto"
          className="w-full py-48 bg-primary-soft flex flex-col justify-center items-center gap-12"
        >
          <div className="w-full max-w-7xl mx-auto px-10 flex flex-col items-center">
            <div className="w-80 flex flex-col justify-start items-center gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <h2 className="self-stretch text-center text-warm-foreground text-3xl font-semibold font-['DM_Sans'] leading-9">
                  Skapa konto
                </h2>
              </div>

              <form
                onSubmit={handleSignup}
                className="self-stretch flex flex-col justify-start items-start gap-4"
              >
                <div className="w-80 max-w-80 min-w-64 flex flex-col justify-center items-start gap-4">
                  <div className="self-stretch inline-flex justify-start items-center gap-3 overflow-hidden">
                    <div className="flex-1 h-10 px-3 py-2 bg-card rounded-sm outline-2 -outline-offset-2 outline-foreground flex justify-start items-center gap-2">
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={(event) =>
                          updateField("firstName", event.target.value)
                        }
                        placeholder="Förnamn *"
                        className="flex-1 w-full opacity-50 text-foreground text-base font-normal font-['DM_Sans'] leading-4 bg-transparent border-none outline-none placeholder:text-foreground"
                      />
                    </div>
                    <div className="flex-1 h-10 px-3 py-2 bg-card rounded-sm outline-2 -outline-offset-2 outline-foreground flex justify-start items-center gap-2">
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={(event) =>
                          updateField("lastName", event.target.value)
                        }
                        placeholder="Efternamn *"
                        className="flex-1 w-full opacity-50 text-foreground text-base font-normal font-['DM_Sans'] leading-4 bg-transparent border-none outline-none placeholder:text-foreground"
                      />
                    </div>
                  </div>

                  {(["email", "password", "repeatPassword"] as const).map(
                    (field) => (
                      <div
                        key={field}
                        className="self-stretch h-10 px-3 py-2 bg-card rounded-sm outline-2 -outline-offset-2 outline-foreground inline-flex justify-start items-center gap-2"
                      >
                        <input
                          name={field}
                          type={field === "email" ? "email" : "password"}
                          value={formData[field]}
                          onChange={(event) =>
                            updateField(field, event.target.value)
                          }
                          placeholder={
                            field === "email"
                              ? "E-post *"
                              : field === "password"
                                ? "Lösenord *"
                                : "Upprepa lösenord *"
                          }
                          className="flex-1 w-full opacity-50 text-foreground text-base font-normal font-['DM_Sans'] leading-4 bg-transparent border-none outline-none placeholder:text-foreground"
                        />
                      </div>
                    )
                  )}

                  <label className="self-stretch inline-flex justify-start items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(event) =>
                        setAgreedToTerms(event.target.checked)
                      }
                      className="sr-only"
                    />
                    <span
                      className={`size-3.5 rounded-xs border-[1.50px] border-foreground flex items-center justify-center ${
                        agreedToTerms ? "bg-foreground" : "bg-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      {agreedToTerms ? (
                        <span className="text-[8px] text-card leading-none">
                          ✓
                        </span>
                      ) : null}
                    </span>
                    <span className="text-foreground text-sm font-normal font-['DM_Sans'] leading-4">
                      Jag har läst och godkänner villkoren
                    </span>
                  </label>
                </div>

                {statusMessage ? (
                  <p className="w-80 text-sm text-center text-muted-foreground font-['DM_Sans']">
                    {statusMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting || !agreedToTerms}
                  className="self-stretch px-12 py-3 btn-volly-cta inline-flex justify-center items-center disabled:opacity-60"
                >
                  <span className="text-warm-foreground text-base font-bold font-['DM_Sans'] leading-4">
                    {isSubmitting ? "Skapar konto..." : "Skapa konto"}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </section>

        <HowVollyWorks />
      </main>

      <button
        onClick={scroll}
        aria-label="Scroll to top"
        className="fixed bottom-20 right-6 z-50 rounded-full bg-card p-2 shadow-lg hover:scale-105 transition-transform outline outline-border"
      >
        <img src={upArrow} alt="pil" className="w-10 h-10 object-contain" />
      </button>

      <Footer />
    </div>
  );
}

export default HomePage;
