import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { InvoicesAPI } from "../api/billing";
import type { Invoice } from "../api/types";

const STATUS_COLORS: Record<string, string> = {
  draft: "var(--color-graphite-500)",
  sent: "var(--color-amber-500)",
  paid: "var(--color-status-active)",
  partial: "var(--color-status-maintenance)",
  overdue: "var(--color-status-retired)",
  cancelled: "var(--color-graphite-400)",
};

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, [search, statusFilter]);

  async function loadInvoices() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const data = await InvoicesAPI.list(params);
      setInvoices(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold">Invoices</h1>
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              Manage sales invoices and billing
            </p>
          </div>
          <Link
            to="/invoices/new"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "var(--color-amber-500)" }}
          >
            + New Invoice
          </Link>
        </div>

        <div className="flex gap-3 mb-5">
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: "var(--color-graphite-100)" }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: "var(--color-graphite-100)" }}
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="partial">Partially Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm" style={{ color: "var(--color-graphite-500)" }}>Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>No invoices found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-graphite-100)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--color-graphite-50)" }}>
                  <th className="text-left px-4 py-3 font-medium">Invoice #</th>
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Due Date</th>
                  <th className="text-right px-4 py-3 font-medium">Total</th>
                  <th className="text-right px-4 py-3 font-medium">Balance</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t hover:bg-gray-50" style={{ borderColor: "var(--color-graphite-100)" }}>
                    <td className="px-4 py-3">
                      <Link to={`/invoices/${inv.id}`} className="font-mono text-xs font-medium hover:underline" style={{ color: "var(--color-amber-600)" }}>
                        {inv.invoice_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium">{inv.customer_name || "—"}</td>
                    <td className="px-4 py-3">{inv.invoice_date}</td>
                    <td className="px-4 py-3">{inv.due_date || "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold">₹{parseFloat(inv.grand_total).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right" style={{ color: parseFloat(inv.balance_due) > 0 ? "var(--color-status-retired)" : "var(--color-status-active)" }}>
                      ₹{parseFloat(inv.balance_due).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: STATUS_COLORS[inv.status] || "gray" }}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
