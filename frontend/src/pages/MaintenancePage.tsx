import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { MaintenanceAPI } from "../api/spares";
import type { MaintenanceSchedule } from "../api/types";

const STATUS_COLORS: Record<string, string> = {
  active: "var(--color-status-active)",
  paused: "var(--color-amber-500)",
  completed: "var(--color-graphite-400)",
};

export default function MaintenancePage() {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [overdue, setOverdue] = useState<MaintenanceSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOverdue, setShowOverdue] = useState(false);

  useEffect(() => {
    loadData();
  }, [showOverdue]);

  async function loadData() {
    setLoading(true);
    try {
      if (showOverdue) {
        const data = await MaintenanceAPI.overdue();
        setOverdue(data);
      } else {
        const data = await MaintenanceAPI.list();
        setSchedules(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleMarkCompleted(id: string) {
    try {
      await MaintenanceAPI.markCompleted(id);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  }

  const displayData = showOverdue ? overdue : schedules;

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold">Maintenance Schedules</h1>
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              Preventive maintenance planning and tracking
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowOverdue(!showOverdue)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${showOverdue ? "text-white" : ""}`}
              style={{
                borderColor: "var(--color-graphite-100)",
                backgroundColor: showOverdue ? "var(--color-status-retired)" : "white",
              }}
            >
              {showOverdue ? "Show All" : "Overdue Only"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm" style={{ color: "var(--color-graphite-500)" }}>Loading...</div>
        ) : displayData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              {showOverdue ? "No overdue maintenance" : "No maintenance schedules found"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-graphite-100)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--color-graphite-50)" }}>
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium">Asset</th>
                  <th className="text-left px-4 py-3 font-medium">Frequency</th>
                  <th className="text-left px-4 py-3 font-medium">Last Done</th>
                  <th className="text-left px-4 py-3 font-medium">Next Due</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((s) => {
                  const isOverdue = s.next_due && new Date(s.next_due) < new Date();
                  return (
                    <tr key={s.id} className="border-t" style={{ borderColor: "var(--color-graphite-100)" }}>
                      <td className="px-4 py-3 font-medium">{s.title}</td>
                      <td className="px-4 py-3">{s.asset_name}</td>
                      <td className="px-4 py-3 capitalize">{s.frequency.replace("_", " ")}</td>
                      <td className="px-4 py-3">{s.last_performed || "Never"}</td>
                      <td className="px-4 py-3" style={{ color: isOverdue ? "var(--color-status-retired)" : undefined }}>
                        {s.next_due || "Not set"}
                        {isOverdue && <span className="ml-1 text-xs">(overdue)</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: STATUS_COLORS[s.status] || "gray" }}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {s.status === "active" && (
                          <button
                            onClick={() => handleMarkCompleted(s.id)}
                            className="px-3 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: "var(--color-status-active)" }}
                          >
                            Mark Done
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
