import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { AssetsAPI } from "../api/assets";
import type { Asset } from "../api/types";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "under_maintenance", label: "Under Maintenance" },
  { value: "idle", label: "Idle" },
  { value: "retired", label: "Retired" },
];

export default function AssetList() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      AssetsAPI.list({ search: search || undefined, status: status || undefined })
        .then(setAssets)
        .finally(() => setLoading(false));
    }, 250); // debounce search
    return () => clearTimeout(t);
  }, [search, status]);

  return (
    <Layout>
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-xl font-semibold" style={{ color: "var(--color-graphite-900)" }}>Assets</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-graphite-500)" }}>
              {loading ? "Loading..." : `${assets.length} asset${assets.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <Link
            to="/assets/new"
            className="px-4 py-2 rounded-md text-sm font-medium text-white"
            style={{ backgroundColor: "var(--color-amber-600)" }}
          >
            + Add Asset
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name, make, serial..."
            className="w-80 px-3 py-2 rounded-md text-sm outline-none"
            style={{ border: "1px solid var(--color-graphite-100)", backgroundColor: "white" }}
          />
          <div className="flex gap-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatus(f.value)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition"
                style={{
                  backgroundColor: status === f.value ? "var(--color-graphite-900)" : "white",
                  color: status === f.value ? "white" : "var(--color-graphite-600)",
                  border: "1px solid var(--color-graphite-100)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-graphite-100)", backgroundColor: "white" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--color-graphite-50)", borderBottom: "1px solid var(--color-graphite-100)" }}>
                {["Code", "Name", "Category", "Location", "Customer", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium" style={{ color: "var(--color-graphite-500)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr
                  key={a.id}
                  className="cursor-pointer hover:bg-graphite-50"
                  style={{ borderBottom: "1px solid var(--color-graphite-100)" }}
                >
                  <td className="px-4 py-3">
                    <Link to={`/assets/${a.id}`} className="font-mono text-xs font-medium" style={{ color: "var(--color-amber-600)" }}>
                      {a.asset_code}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/assets/${a.id}`} className="font-medium" style={{ color: "var(--color-graphite-900)" }}>
                      {a.name}
                    </Link>
                    <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>{a.make} {a.model_number}</p>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--color-graphite-600)" }}>{a.category || "—"}</td>
                  <td className="px-4 py-3" style={{ color: "var(--color-graphite-600)" }}>{a.current_location || "—"}</td>
                  <td className="px-4 py-3" style={{ color: "var(--color-graphite-600)" }}>{a.assigned_customer_name || "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
              {!loading && assets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: "var(--color-graphite-500)" }}>
                    No assets match this filter yet. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
