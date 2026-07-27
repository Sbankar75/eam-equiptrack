import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { AssetsAPI } from "../api/assets";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "under_maintenance", label: "Under Maintenance" },
  { value: "idle", label: "Idle" },
  { value: "retired", label: "Retired" },
];

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-[11px] font-medium" style={{ color: "var(--color-graphite-500)" }}>{label}</label>
      <input
        {...props}
        className="w-full mt-1 px-3 py-2 rounded-md text-sm outline-none"
        style={{ border: "1px solid var(--color-graphite-100)" }}
      />
    </div>
  );
}

export default function AssetForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    asset_code: "", name: "", category: "", make: "", model_number: "",
    serial_number: "", current_location: "", status: "active",
    purchase_date: "", warranty_expiry: "", notes: "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form } as any;
      if (!payload.purchase_date) delete payload.purchase_date;
      if (!payload.warranty_expiry) delete payload.warranty_expiry;
      const created = await AssetsAPI.create(payload);
      navigate(`/assets/${created.id}`);
    } catch (err: any) {
      const data = err?.response?.data;
      setError(data ? JSON.stringify(data) : "Could not save this asset. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <div className="px-8 py-6 max-w-2xl">
        <Link to="/assets" className="text-xs" style={{ color: "var(--color-graphite-500)" }}>&larr; All assets</Link>
        <h1 className="font-display text-xl font-semibold mt-2 mb-6" style={{ color: "var(--color-graphite-900)" }}>Add Asset</h1>

        <form onSubmit={handleSubmit} className="rounded-lg p-6 space-y-4" style={{ backgroundColor: "white", border: "1px solid var(--color-graphite-100)" }}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Asset Code" value={form.asset_code} onChange={(e) => set("asset_code", e.target.value)} required placeholder="e.g. EXC-002" />
            <Input label="Name" value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="e.g. Wheel Loader" />
            <Input label="Category" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Loader" />
            <div>
              <label className="text-[11px] font-medium" style={{ color: "var(--color-graphite-500)" }}>Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md text-sm" style={{ border: "1px solid var(--color-graphite-100)" }}>
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <Input label="Make" value={form.make} onChange={(e) => set("make", e.target.value)} />
            <Input label="Model Number" value={form.model_number} onChange={(e) => set("model_number", e.target.value)} />
            <Input label="Serial Number" value={form.serial_number} onChange={(e) => set("serial_number", e.target.value)} />
            <Input label="Current Location" value={form.current_location} onChange={(e) => set("current_location", e.target.value)} />
            <Input label="Purchase Date" type="date" value={form.purchase_date} onChange={(e) => set("purchase_date", e.target.value)} />
            <Input label="Warranty Expiry" type="date" value={form.warranty_expiry} onChange={(e) => set("warranty_expiry", e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] font-medium" style={{ color: "var(--color-graphite-500)" }}>Notes</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} className="w-full mt-1 px-3 py-2 rounded-md text-sm" style={{ border: "1px solid var(--color-graphite-100)" }} />
          </div>

          {error && <p className="text-sm" style={{ color: "#C24A4A" }}>{error}</p>}

          <div className="flex gap-2 pt-2">
            <button disabled={saving} type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: "var(--color-amber-600)" }}>
              {saving ? "Saving..." : "Save Asset"}
            </button>
            <Link to="/assets" className="px-4 py-2 rounded-md text-sm font-medium" style={{ color: "var(--color-graphite-600)" }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
