import MyTextInput from "../components/MyTextInput";
import { useSignup } from "../hooks/useSignup";
import type { SignupPageProps } from "../types";

function SignupPage({ onBackToLogin, onSignupSuccess }: SignupPageProps) {
  const {
    formData,
    errorMessage,
    isLoading,
    emailStatus,
    updateField,
    checkEmail,
    submitRegister,
  } = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitRegister();
    if (result.success && result.email) {
      onSignupSuccess(result.email);
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-between px-20 py-10 bg-[#e5e5e5] rounded-3xl">
      {/* Vänster sida: Hero Text (Samma som login för konsistens) */}
      <div className="w-1/2">
        <h1 className="text-8xl font-medium leading-tight text-black tracking-tighter">
          Bli en del <br />
          av Volly <br />
          idag.
        </h1>
      </div>

      {/* Höger sida: Signup-formulär */}
      <div className="w-[350px] flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-6 self-center">Skapa konto</h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {["phone", "email", "password"].map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <MyTextInput
                type={
                  field === "password"
                    ? "password"
                    : field === "email"
                      ? "email"
                      : "text"
                }
                value={formData[field as keyof typeof formData]}
                onChange={(e) => updateField(field, e.target.value)}
                onBlur={
                  field === "email"
                    ? () => checkEmail(formData.email)
                    : undefined
                }
                placeholder={
                  field === "phone"
                    ? "Telefonnummer"
                    : field === "email"
                      ? "E-post"
                      : "Lösenord"
                }
                className="w-full border-2 border-black p-2 rounded-md"
              />

              {/* Status-meddelanden för e-post */}
              {field === "email" && (
                <div className="text-[10px] h-2 ml-1">
                  {emailStatus === "checking" && (
                    <p className="text-gray-500">Kontrollerar...</p>
                  )}
                  {emailStatus === "available" && (
                    <p className="text-green-600">E-posten är ledig!</p>
                  )}
                  {emailStatus === "taken" && (
                    <p className="text-red-600">E-posten är upptagen</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {errorMessage && (
            <p className="text-red-600 text-sm italic">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 font-bold rounded-md hover:opacity-90 transition-opacity mt-2"
          >
            {isLoading ? "Skapar konto..." : "Registrera dig"}
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="text-sm font-medium hover:underline self-center mt-2"
          >
            Har du redan ett konto? Logga in
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
