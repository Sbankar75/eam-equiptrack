import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { PaymentReceiptsAPI } from "../api/billing";
import { CustomersAPI } from "../api/customers";
import type { PaymentReceipt, Customer } from "../api/types";

export default function PaymentReceipts() {
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    receipt_number: "", customer: "", amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_mode: "bank_transfer", reference_number: "", notes: "",
  });

  useEffect(() => {
    Promise.all([PaymentReceiptsAPI.list(), CustomersAPI.list()]).then(([r, c]) => {
      setReceipts(r);
      setCustomers(c);
      setLoading(false);
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await PaymentReceiptsAPI.create(form as any);
      const data = await PaymentReceiptsAPI.list();
      setReceipts(data);
      setShowForm(false);
      setForm({
        receipt_number: `RCP-${Date.now().toString(36).toUpperCase()}`,
        customer: "", amount: "",
        payment_date: new Date().toISOString().split("T")[0],
        payment_mode: "bank_transfer", reference_number: "", notes: "",
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
            <h1 className="text-2xl font-display font-bold">Payment Receipts</h1>
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              Record and track payment receipts with OCR support
            </p>
          </div>
          <button
            onClick={() => {
              setForm((f) => ({ ...f, receipt_number: `RCP-${Date.now().toString(36).toUpperCase()}` }));
              setShowForm(!showForm);
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "var(--color-amber-500)" }}
          >
            {showForm ? "Cancel" : "+ Add Receipt"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: "var(--color-graphite-100)" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Receipt Number</label>
                <input name="receipt_number" value={form.receipt_number} onChange={handleChange} required className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Customer</label>
                <select name="customer" value={form.customer} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="">Select customer</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Amount (₹) *</label>
                <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} required className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Payment Date</label>
                <input name="payment_date" type="date" value={form.payment_date} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Payment Mode</label>
                <select name="payment_mode" value={form.payment_mode} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="bank_transfer">Bank Transfer / NEFT / RTGS</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="upi">UPI</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Reference No.</label>
                <input name="reference_number" value={form.reference_number} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} placeholder="Transaction/Cheque no." />
              </div>
            </div>
            <button type="submit" className="mt-4 px-6 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "var(--color-amber-500)" }}>
              Save Receipt
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
                  <th className="text-left px-4 py-3 font-medium">Receipt #</th>
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Mode</th>
                  <th className="text-left px-4 py-3 font-medium">Reference</th>
                  <th className="text-left px-4 py-3 font-medium">OCR</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((r) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: "var(--color-graphite-100)" }}>
                    <td className="px-4 py-3 font-mono text-xs">{r.receipt_number}</td>
                    <td className="px-4 py-3 font-medium">{r.customer_name || "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold">₹{parseFloat(r.amount).toLocaleString()}</td>
                    <td className="px-4 py-3">{r.payment_date}</td>
                    <td className="px-4 py-3 capitalize">{r.payment_mode.replace("_", " ")}</td>
                    <td className="px-4 py-3">{r.reference_number || "—"}</td>
                    <td className="px-4 py-3">
                      {r.ocr_processed ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: "var(--color-status-active)" }}>Processed</span>
                      ) : r.receipt_image ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: "var(--color-amber-500)" }}>Pending</span>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--color-graphite-400)" }}>No image</span>
                      )}
                    </td>
                  </tr>
                ))}
                {receipts.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-8" style={{ color: "var(--color-graphite-500)" }}>No payment receipts yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
