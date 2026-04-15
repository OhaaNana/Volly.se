import MyTextInput from "./components/MyTextInput";
import { useSignup } from "./hooks/useSignup";
import type { SignupPageProps } from "./types";

function SignupPage({ onBackToLogin, onSignupSuccess }: SignupPageProps) {
  const { 
    formData, errorMessage, isLoading, emailStatus, 
    updateField, checkEmail, submitRegister 
  } = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitRegister();
    if (result.success && result.email) {
      onSignupSuccess(result.email);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>
          Create account
        </h2>

        {["phone", "email", "password"].map((field) => (
          <div key={field}>
            <label>{field}</label>
            <MyTextInput
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              value={formData[field as keyof typeof formData]}
              onChange={(e) => updateField(field, e.target.value)}
              onBlur={field === "email" ? () => checkEmail(formData.email) : undefined}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            />
            {field === "email" && emailStatus === "checking" && <p>Checking...</p>}
            {field === "email" && emailStatus === "available" && <p>Available!</p>}
            {field === "email" && emailStatus === "taken" && <p>Taken</p>}
          </div>
        ))}

        {errorMessage && (
          <p className="error-box">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </button>

        <button type="button" onClick={onBackToLogin}>
          Back to login
        </button>
      </form>
    </div>
  );
}

export default SignupPage;