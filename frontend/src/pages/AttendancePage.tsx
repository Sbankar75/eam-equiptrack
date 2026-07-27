import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { AttendanceAPI, OperatorsAPI } from "../api/workforce";
import type { Attendance, Operator } from "../api/types";

const STATUS_COLORS: Record<string, string> = {
  present: "var(--color-status-active)",
  absent: "var(--color-status-retired)",
  half_day: "var(--color-amber-500)",
  leave: "var(--color-graphite-500)",
  holiday: "var(--color-graphite-400)",
};

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [form, setForm] = useState({
    operator: "", date: selectedDate, status: "present",
    check_in: "", check_out: "", overtime_hours: "0",
    site_location: "", notes: "",
  });

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  async function loadData() {
    setLoading(true);
    try {
      const [att, ops] = await Promise.all([
        AttendanceAPI.list({ date: selectedDate }),
        OperatorsAPI.list(),
      ]);
      setRecords(att);
      setOperators(ops);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload: any = { ...form };
      if (!payload.check_in) delete payload.check_in;
      if (!payload.check_out) delete payload.check_out;
      await AttendanceAPI.create(payload);
      await loadData();
      setShowForm(false);
    } catch (e) {
      console.error(e);
    }
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border text-sm";

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold">Attendance</h1>
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              Daily attendance tracking
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: "var(--color-graphite-100)" }}
            />
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: "var(--color-amber-500)" }}
            >
              {showForm ? "Cancel" : "+ Mark Attendance"}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: "var(--color-graphite-100)" }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Operator *</label>
                <select name="operator" value={form.operator} onChange={handleChange} required className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="">Select</option>
                  {operators.map((op) => <option key={op.id} value={op.id}>{op.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="half_day">Half Day</option>
                  <option value="leave">On Leave</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Site Location</label>
                <input name="site_location" value={form.site_location} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Check In</label>
                <input name="check_in" type="time" value={form.check_in} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Check Out</label>
                <input name="check_out" type="time" value={form.check_out} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Overtime (hrs)</label>
                <input name="overtime_hours" type="number" step="0.5" value={form.overtime_hours} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
            </div>
            <button type="submit" className="mt-4 px-6 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "var(--color-amber-500)" }}>
              Save
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12 text-sm" style={{ color: "var(--color-graphite-500)" }}>Loading...</div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-graphite-100)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--color-graphite-50)" }}>
                  <th className="text-left px-4 py-3 font-medium">Operator</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Check In</th>
                  <th className="text-left px-4 py-3 font-medium">Check Out</th>
                  <th className="text-left px-4 py-3 font-medium">OT Hrs</th>
                  <th className="text-left px-4 py-3 font-medium">Site</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: "var(--color-graphite-100)" }}>
                    <td className="px-4 py-3 font-medium">{r.operator_name}</td>
                    <td className="px-4 py-3">{r.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: STATUS_COLORS[r.status] || "gray" }}>
                        {r.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">{r.check_in || "—"}</td>
                    <td className="px-4 py-3">{r.check_out || "—"}</td>
                    <td className="px-4 py-3">{r.overtime_hours}</td>
                    <td className="px-4 py-3">{r.site_location || "—"}</td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-8" style={{ color: "var(--color-graphite-500)" }}>No attendance records for this date</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
