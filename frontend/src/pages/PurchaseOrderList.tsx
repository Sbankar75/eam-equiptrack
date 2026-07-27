import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { PurchaseOrdersAPI } from "../api/billing";
import type { PurchaseOrder } from "../api/types";

const STATUS_COLORS: Record<string, string> = {
  draft: "var(--color-graphite-500)",
  sent: "var(--color-amber-500)",
  acknowledged: "#2563EB",
  partial_received: "var(--color-status-maintenance)",
  received: "var(--color-status-active)",
  cancelled: "var(--color-status-retired)",
};

export default function PurchaseOrderList() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [search]);

  async function loadOrders() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      const data = await PurchaseOrdersAPI.list(params);
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
            <h1 className="text-2xl font-display font-bold">Purchase Orders</h1>
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              Manage purchase orders for spare parts and services
            </p>
          </div>
          <Link
            to="/purchase-orders/new"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "var(--color-amber-500)" }}
          >
            + New PO
          </Link>
        </div>

        <div className="flex gap-3 mb-5">
          <input
            type="text"
            placeholder="Search by PO number or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: "var(--color-graphite-100)" }}
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm" style={{ color: "var(--color-graphite-500)" }}>Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>No purchase orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-graphite-100)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--color-graphite-50)" }}>
                  <th className="text-left px-4 py-3 font-medium">PO #</th>
                  <th className="text-left px-4 py-3 font-medium">Vendor</th>
                  <th className="text-left px-4 py-3 font-medium">Order Date</th>
                  <th className="text-right px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((po) => (
                  <tr key={po.id} className="border-t hover:bg-gray-50" style={{ borderColor: "var(--color-graphite-100)" }}>
                    <td className="px-4 py-3">
                      <Link to={`/purchase-orders/${po.id}`} className="font-mono text-xs font-medium hover:underline" style={{ color: "var(--color-amber-600)" }}>
                        {po.po_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium">{po.vendor_name}</td>
                    <td className="px-4 py-3">{po.order_date || "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold">₹{parseFloat(po.total_amount).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: STATUS_COLORS[po.status] || "gray" }}>
                        {po.status.replace("_", " ")}
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
