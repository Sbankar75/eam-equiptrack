import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { MarketDataAPI } from "../api/customers";
import type { MarketData } from "../api/types";

export default function MarketDataPage() {
  const [items, setItems] = useState<MarketData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "", category: "" });

  useEffect(() => {
    MarketDataAPI.list().then((data) => { setItems(data); setLoading(false); });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await MarketDataAPI.create(form as any);
      const data = await MarketDataAPI.list();
      setItems(data);
      setShowForm(false);
      setForm({ title: "", content: "", category: "" });
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this market data entry?")) {
      await MarketDataAPI.remove(id);
      setItems(items.filter((i) => i.id !== id));
    }
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border text-sm";

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold">Market Data</h1>
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              Internal market intelligence (Admin only — not to disclose)
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "var(--color-amber-500)" }}
          >
            {showForm ? "Cancel" : "+ Add Entry"}
          </button>
        </div>

        <div className="p-3 rounded-lg mb-6 text-sm" style={{ backgroundColor: "var(--color-amber-100)", color: "var(--color-amber-600)" }}>
          This section is restricted to Admin/Owner roles. Data here is for internal use only.
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: "var(--color-graphite-100)" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Category</label>
                <input name="category" value={form.category} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} placeholder="e.g. pricing, competitor, trend" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1">Content *</label>
                <textarea name="content" value={form.content} onChange={handleChange} required rows={4} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
            </div>
            <button type="submit" className="mt-4 px-6 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "var(--color-amber-500)" }}>
              Save
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12 text-sm" style={{ color: "var(--color-graphite-500)" }}>Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>No market data entries yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border p-5" style={{ borderColor: "var(--color-graphite-100)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <div className="flex gap-3 mt-1 text-xs" style={{ color: "var(--color-graphite-500)" }}>
                      {item.category && <span className="px-2 py-0.5 rounded" style={{ backgroundColor: "var(--color-graphite-50)" }}>{item.category}</span>}
                      <span>By {item.created_by_name}</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="text-xs px-2 py-1 rounded" style={{ color: "var(--color-status-retired)" }}>
                    Delete
                  </button>
                </div>
                <p className="mt-3 text-sm whitespace-pre-wrap" style={{ color: "var(--color-graphite-700)" }}>{item.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
