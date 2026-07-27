import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(username, password);
      navigate("/assets");
    } catch {
      setError("Incorrect username or password. Check your details and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-graphite-950" style={{ backgroundColor: "var(--color-graphite-950)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4" style={{ backgroundColor: "var(--color-amber-500)" }}>
            <span className="font-display font-bold text-lg text-white">EA</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">EquipTrack</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-graphite-400)" }}>Sign in to manage your fleet</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl p-6 space-y-4" style={{ backgroundColor: "var(--color-graphite-900)", border: "1px solid var(--color-graphite-700)" }}>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-graphite-400)" }}>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm text-white outline-none focus:ring-2"
              style={{ backgroundColor: "var(--color-graphite-800)", border: "1px solid var(--color-graphite-600)" }}
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-graphite-400)" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm text-white outline-none focus:ring-2"
              style={{ backgroundColor: "var(--color-graphite-800)", border: "1px solid var(--color-graphite-600)" }}
              required
            />
          </div>

          {error && <p className="text-sm" style={{ color: "#E28080" }}>{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md py-2.5 text-sm font-medium text-white transition disabled:opacity-60"
            style={{ backgroundColor: "var(--color-amber-600)" }}
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-xs text-center" style={{ color: "var(--color-graphite-500)" }}>
            Demo: admin / admin12345
          </p>
        </form>
      </div>
    </div>
  );
}
