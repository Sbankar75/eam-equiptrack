import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Truck } from "lucide-react";

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
      navigate("/");
    } catch {
      setError("Incorrect username or password. Check your details and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--color-primary-900)" }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-12"
        style={{ background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))" }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{ backgroundColor: "var(--color-primary-500)" }}>
          <Truck size={32} className="text-white" />
        </div>
        <h2 className="font-display text-3xl font-bold text-white text-center">EquipTrack</h2>
        <p className="text-sm mt-3 text-center max-w-xs" style={{ color: "var(--color-primary-300)" }}>
          Enterprise Asset Management Platform — Track, maintain, and optimize your entire equipment fleet.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 text-xs" style={{ color: "var(--color-primary-200)" }}>
          <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>Assets & Logbooks</div>
          <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>Work Orders</div>
          <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>Invoicing & Billing</div>
          <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>Inventory & Spares</div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
              style={{ backgroundColor: "var(--color-primary-500)" }}>
              <Truck size={24} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">EquipTrack</h1>
          </div>

          <div className="lg:block hidden mb-6">
            <h1 className="font-display text-xl font-bold text-white">Sign In</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-primary-300)" }}>Access your EAM workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl p-6 space-y-4"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-primary-200)" }}>Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-2 transition"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", focusRingColor: "var(--color-primary-500)" } as any}
                autoFocus
                required
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-primary-200)" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-2 transition"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                required
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "rgba(220,38,38,0.15)", color: "#FCA5A5" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 hover:brightness-110"
              style={{ backgroundColor: "var(--color-primary-600)" }}
            >
              {busy ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-xs text-center pt-2" style={{ color: "var(--color-primary-400)" }}>
              Demo credentials: <span className="font-mono">admin / admin12345</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
