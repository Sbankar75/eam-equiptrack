import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { SalaryAPI, OperatorsAPI } from "../api/workforce";
import type { SalaryRecord, Operator } from "../api/types";

const STATUS_COLORS: Record<string, string> = {
  paid: "var(--color-status-active)",
  pending: "var(--color-amber-500)",
  partial: "var(--color-status-maintenance)",
  hold: "var(--color-status-retired)",
};

export default function Payroll() {
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    operator: "", month: "", basic_salary: "", overtime_amount: "0",
    deductions: "0", bonus: "0", net_payable: "",
    payment_mode: "bank_transfer", status: "pending", notes: "",
  });

  useEffect(() => {
    Promise.all([
      SalaryAPI.list(),
      OperatorsAPI.list(),
    ]).then(([sal, ops]) => {
      setRecords(sal);
      setOperators(ops);
      setLoading(false);
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const updated = { ...form, [e.target.name]: e.target.value };
    if (["basic_salary", "overtime_amount", "deductions", "bonus"].includes(e.target.name)) {
      const net = (parseFloat(updated.basic_salary) || 0) +
        (parseFloat(updated.overtime_amount) || 0) +
        (parseFloat(updated.bonus) || 0) -
        (parseFloat(updated.deductions) || 0);
      updated.net_payable = net.toFixed(2);
    }
    setForm(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await SalaryAPI.create(form as any);
      const data = await SalaryAPI.list();
      setRecords(data);
      setShowForm(false);
      setForm({
        operator: "", month: "", basic_salary: "", overtime_amount: "0",
        deductions: "0", bonus: "0", net_payable: "",
        payment_mode: "bank_transfer", status: "pending", notes: "",
      });
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
            <h1 className="text-2xl font-display font-bold">Payroll / Salary</h1>
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              Manage salary payments for operators
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "var(--color-amber-500)" }}
          >
            {showForm ? "Cancel" : "+ Add Salary Record"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: "var(--color-graphite-100)" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Operator *</label>
                <select name="operator" value={form.operator} onChange={handleChange} required className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="">Select operator</option>
                  {operators.map((op) => <option key={op.id} value={op.id}>{op.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Month *</label>
                <input name="month" type="date" value={form.month} onChange={handleChange} required className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Basic Salary *</label>
                <input name="basic_salary" type="number" step="0.01" value={form.basic_salary} onChange={handleChange} required className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Overtime</label>
                <input name="overtime_amount" type="number" step="0.01" value={form.overtime_amount} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Deductions</label>
                <input name="deductions" type="number" step="0.01" value={form.deductions} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Bonus</label>
                <input name="bonus" type="number" step="0.01" value={form.bonus} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Net Payable</label>
                <input name="net_payable" type="number" step="0.01" value={form.net_payable} readOnly className={inputClass + " bg-gray-50"} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Payment Mode</label>
                <select name="payment_mode" value={form.payment_mode} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partially Paid</option>
                  <option value="hold">On Hold</option>
                </select>
              </div>
            </div>
            <button type="submit" className="mt-4 px-6 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "var(--color-amber-500)" }}>
              Save Record
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
                  <th className="text-left px-4 py-3 font-medium">Month</th>
                  <th className="text-right px-4 py-3 font-medium">Basic</th>
                  <th className="text-right px-4 py-3 font-medium">Net Payable</th>
                  <th className="text-left px-4 py-3 font-medium">Mode</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: "var(--color-graphite-100)" }}>
                    <td className="px-4 py-3 font-medium">{r.operator_name}</td>
                    <td className="px-4 py-3">{r.month}</td>
                    <td className="px-4 py-3 text-right">₹{parseFloat(r.basic_salary).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold">₹{parseFloat(r.net_payable).toLocaleString()}</td>
                    <td className="px-4 py-3 capitalize">{r.payment_mode.replace("_", " ")}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: STATUS_COLORS[r.status] || "gray" }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8" style={{ color: "var(--color-graphite-500)" }}>No salary records yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
