import { useMemo, useState } from "react";

export default function AuthPage({ onSignIn, onSignUp, firebaseEnabled }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Use your email and password to continue.");
  const disabled = useMemo(() => !email || !password || !firebaseEnabled, [email, password, firebaseEnabled]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      if (mode === "signin") {
        await onSignIn(email, password);
        setStatus("Signed in.");
      } else {
        await onSignUp(email, password);
        setStatus("Account created.");
      }
    } catch (error) {
      setStatus(error.message || "Authentication failed.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>My Notes</h1>
        <p className="muted">Sign in or create an account to sync your notes in cloud storage.</p>

        {!firebaseEnabled && (
          <p className="warning">Firebase is not configured. Add Vite Firebase env vars to enable sign in/sign up.</p>
        )}

        <div className="auth-switch">
          <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>
            Sign in
          </button>
          <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
            Sign up
          </button>
        </div>

        <form onSubmit={submit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" />

          <button type="submit" disabled={disabled}>
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="muted">{status}</p>
      </section>
    </main>
  );
}
