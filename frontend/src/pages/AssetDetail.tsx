import { useEffect, useState, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { AssetsAPI, LogbookAPI } from "../api/assets";
import type { Asset, LogbookEntry } from "../api/types";

const ENTRY_TYPE_LABELS: Record<string, string> = {
  usage: "Usage",
  service: "Service",
  breakdown: "Breakdown",
  repair: "Repair",
  fuel: "Fuel",
  inspection: "Inspection",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--color-graphite-500)" }}>{label}</p>
      <p className="text-sm mt-0.5" style={{ color: "var(--color-graphite-900)" }}>{value || "—"}</p>
    </div>
  );
}

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logType, setLogType] = useState("usage");
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [logDesc, setLogDesc] = useState("");
  const [logHours, setLogHours] = useState("");
  const [logCost, setLogCost] = useState("");
  const [saving, setSaving] = useState(false);

  function refresh() {
    if (!id) return;
    AssetsAPI.get(id).then(setAsset);
    LogbookAPI.listForAsset(id).then(setEntries);
  }

  useEffect(refresh, [id]);

  async function submitLog(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await LogbookAPI.create({
        asset: id,
        entry_type: logType as LogbookEntry["entry_type"],
        entry_date: logDate,
        description: logDesc,
        hours_meter_reading: logHours ? logHours : null,
        cost: logCost ? logCost : null,
      });
      setLogDesc(""); setLogHours(""); setLogCost("");
      setShowLogForm(false);
      refresh();
    } finally {
      setSaving(false);
    }
  }

  if (!asset) {
    return (
      <Layout>
        <div className="px-8 py-6 text-sm" style={{ color: "var(--color-graphite-500)" }}>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-8 py-6 max-w-5xl">
        <Link to="/assets" className="text-xs" style={{ color: "var(--color-graphite-500)" }}>&larr; All assets</Link>

        <div className="flex items-start justify-between mt-2 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-xl font-semibold" style={{ color: "var(--color-graphite-900)" }}>{asset.name}</h1>
              <StatusBadge status={asset.status} />
            </div>
            <p className="font-mono text-sm mt-1" style={{ color: "var(--color-graphite-500)" }}>{asset.asset_code}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 rounded-lg p-5" style={{ backgroundColor: "white", border: "1px solid var(--color-graphite-100)" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "var(--color-graphite-500)" }}>Asset Details</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category" value={asset.category} />
              <Field label="Make / Model" value={`${asset.make} ${asset.model_number}`.trim()} />
              <Field label="Serial Number" value={asset.serial_number} />
              <Field label="Location" value={asset.current_location} />
              <Field label="Assigned Customer" value={asset.assigned_customer_name || ""} />
              <Field label="Assigned Operator" value={asset.assigned_operator_name || ""} />
              <Field label="Purchase Date" value={asset.purchase_date || ""} />
              <Field label="Warranty Expiry" value={asset.warranty_expiry || ""} />
            </div>
            {asset.notes && (
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--color-graphite-100)" }}>
                <Field label="Notes" value={asset.notes} />
              </div>
            )}
          </div>

          <div className="rounded-lg p-5" style={{ backgroundColor: "white", border: "1px solid var(--color-graphite-100)" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "var(--color-graphite-500)" }}>Photos</p>
            {asset.photos.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>No photos uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {asset.photos.map((p) => (
                  <img key={p.id} src={p.image} alt={p.caption} className="rounded-md aspect-square object-cover" />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg p-5" style={{ backgroundColor: "white", border: "1px solid var(--color-graphite-100)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-graphite-500)" }}>Logbook</p>
            <button
              onClick={() => setShowLogForm((s) => !s)}
              className="text-xs font-medium px-3 py-1.5 rounded-md text-white"
              style={{ backgroundColor: "var(--color-amber-600)" }}
            >
              {showLogForm ? "Cancel" : "+ Add Entry"}
            </button>
          </div>

          {showLogForm && (
            <form onSubmit={submitLog} className="mb-5 p-4 rounded-md grid grid-cols-2 gap-3" style={{ backgroundColor: "var(--color-graphite-50)" }}>
              <div>
                <label className="text-[11px] font-medium" style={{ color: "var(--color-graphite-500)" }}>Type</label>
                <select value={logType} onChange={(e) => setLogType(e.target.value)} className="w-full mt-1 px-2 py-1.5 rounded-md text-sm" style={{ border: "1px solid var(--color-graphite-100)" }}>
                  {Object.entries(ENTRY_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium" style={{ color: "var(--color-graphite-500)" }}>Date</label>
                <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} className="w-full mt-1 px-2 py-1.5 rounded-md text-sm" style={{ border: "1px solid var(--color-graphite-100)" }} required />
              </div>
              <div>
                <label className="text-[11px] font-medium" style={{ color: "var(--color-graphite-500)" }}>Hours Meter Reading</label>
                <input value={logHours} onChange={(e) => setLogHours(e.target.value)} placeholder="e.g. 1452.5" className="w-full mt-1 px-2 py-1.5 rounded-md text-sm" style={{ border: "1px solid var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="text-[11px] font-medium" style={{ color: "var(--color-graphite-500)" }}>Cost</label>
                <input value={logCost} onChange={(e) => setLogCost(e.target.value)} placeholder="Optional" className="w-full mt-1 px-2 py-1.5 rounded-md text-sm" style={{ border: "1px solid var(--color-graphite-100)" }} />
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-medium" style={{ color: "var(--color-graphite-500)" }}>Description</label>
                <textarea value={logDesc} onChange={(e) => setLogDesc(e.target.value)} rows={2} className="w-full mt-1 px-2 py-1.5 rounded-md text-sm" style={{ border: "1px solid var(--color-graphite-100)" }} />
              </div>
              <div className="col-span-2">
                <button disabled={saving} type="submit" className="text-xs font-medium px-4 py-2 rounded-md text-white disabled:opacity-60" style={{ backgroundColor: "var(--color-graphite-900)" }}>
                  {saving ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </form>
          )}

          {entries.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>No logbook entries yet.</p>
          ) : (
            <div className="space-y-0">
              {entries.map((e, i) => (
                <div key={e.id} className="flex gap-3 py-3" style={{ borderTop: i > 0 ? "1px solid var(--color-graphite-100)" : "none" }}>
                  <div className="w-20 shrink-0 text-xs" style={{ color: "var(--color-graphite-500)" }}>{e.entry_date}</div>
                  <div className="w-24 shrink-0">
                    <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: "var(--color-graphite-50)", color: "var(--color-graphite-700)" }}>
                      {ENTRY_TYPE_LABELS[e.entry_type]}
                    </span>
                  </div>
                  <div className="flex-1 text-sm" style={{ color: "var(--color-graphite-800)" }}>
                    {e.description || <span style={{ color: "var(--color-graphite-400)" }}>No description</span>}
                    <div className="flex gap-3 mt-0.5 text-xs" style={{ color: "var(--color-graphite-500)" }}>
                      {e.hours_meter_reading && <span>Meter: {e.hours_meter_reading}</span>}
                      {e.cost && <span>Cost: ₹{e.cost}</span>}
                      {e.recorded_by_name && <span>By {e.recorded_by_name}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
