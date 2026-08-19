import { useState } from "react";

// A lightweight placeholder for real authentication. Not secure against a
// determined visitor (it's plain client-side JS), but it keeps the page from
// being wide open to anyone who stumbles on the deployed link. Swap this out
// once real sign-in is built.
const SITE_PIN = import.meta.env.VITE_SITE_PIN || "1234";

export default function LockScreen({ children }) {
  const [entered, setEntered] = useState("");
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem("unlocked") === "true"
  );
  const [error, setError] = useState(false);

  if (unlocked) return children;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entered === SITE_PIN) {
      sessionStorage.setItem("unlocked", "true");
      setUnlocked(true);
    } else {
      setError(true);
      setEntered("");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#fff0f5] via-[#ffe1ec] to-[#ffd0e0] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs rounded-2xl bg-white/90 p-6 text-center shadow-lg backdrop-blur"
      >
        <p className="mb-4 text-2xl">💗</p>
        <h1 className="mb-1 font-display text-lg font-semibold text-ink">
          This one's private
        </h1>
        <p className="mb-4 text-sm text-muted">Enter the PIN to continue</p>
        <input
          type="password"
          inputMode="numeric"
          value={entered}
          onChange={(e) => {
            setEntered(e.target.value);
            setError(false);
          }}
          className="mb-3 w-full rounded-xl border border-line bg-white px-3 py-2 text-center text-sm focus:border-accent/50 focus:outline-none"
          placeholder="••••"
          autoFocus
        />
        {error && <p className="mb-2 text-xs text-accent">That's not it — try again.</p>}
        <button
          type="submit"
          className="w-full rounded-xl bg-accent py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
