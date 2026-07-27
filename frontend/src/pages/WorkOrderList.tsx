import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { WorkOrdersAPI } from "../api/billing";
import type { WorkOrder } from "../api/types";

const PRIORITY_COLORS: Record<string, string> = {
  low: "var(--color-graphite-400)",
  medium: "var(--color-amber-500)",
  high: "var(--color-status-maintenance)",
  critical: "var(--color-status-retired)",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "var(--color-graphite-500)",
  open: "var(--color-amber-500)",
  in_progress: "#2563EB",
  on_hold: "var(--color-status-maintenance)",
  completed: "var(--color-status-active)",
  cancelled: "var(--color-status-retired)",
};

export default function WorkOrderList() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [search, statusFilter]);

  async function loadOrders() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const data = await WorkOrdersAPI.list(params);
      setOrders(data);
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
            <h1 className="text-2xl font-display font-bold">Work Orders</h1>
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              Manage maintenance and service work orders
            </p>
          </div>
          <Link
            to="/work-orders/new"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "var(--color-amber-500)" }}
          >
            + New Work Order
          </Link>
        </div>

        <div className="flex gap-3 mb-5">
          <input
            type="text"
            placeholder="Search work orders..."
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
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm" style={{ color: "var(--color-graphite-500)" }}>Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>No work orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-graphite-100)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--color-graphite-50)" }}>
                  <th className="text-left px-4 py-3 font-medium">WO #</th>
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium">Asset</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Priority</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((wo) => (
                  <tr key={wo.id} className="border-t hover:bg-gray-50" style={{ borderColor: "var(--color-graphite-100)" }}>
                    <td className="px-4 py-3 font-mono text-xs">{wo.wo_number}</td>
                    <td className="px-4 py-3">
                      <Link to={`/work-orders/${wo.id}`} className="font-medium hover:underline" style={{ color: "var(--color-amber-600)" }}>
                        {wo.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{wo.asset_name || "—"}</td>
                    <td className="px-4 py-3 capitalize">{wo.work_type.replace("_", " ")}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: PRIORITY_COLORS[wo.priority] }}>
                        {wo.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: STATUS_COLORS[wo.status] }}>
                        {wo.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">{wo.due_date || "—"}</td>
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
