import { useState } from "react";
import { apiClient } from "../../lib/apiClient";

export function AuthForm({ onAuthenticated }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Ready");

  const submit = async (event) => {
    event.preventDefault();
    try {
      const endpoint = mode === "signin" ? "/auth/signin" : "/auth/signup";
      const { data } = await apiClient.post(endpoint, { email, password });
      localStorage.setItem("smartnotes_token", data.token);
      onAuthenticated(data.user);
    } catch (error) {
      setStatus(error?.response?.data?.error || error.message);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-xl font-semibold">Welcome to SmartNotes AI</h2>
      <div className="mb-4 flex gap-2">
        <button type="button" onClick={() => setMode("signin")} className="rounded-md border px-3 py-1 text-sm">
          Sign in
        </button>
        <button type="button" onClick={() => setMode("signup")} className="rounded-md border px-3 py-1 text-sm">
          Sign up
        </button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit" className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white dark:bg-slate-100 dark:text-slate-900">
          Continue
        </button>
      </form>
      <p className="mt-3 text-xs text-slate-500">{status}</p>
    </section>
  );
}
