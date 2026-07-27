import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { SparePartsAPI } from "../api/spares";
import type { SparePart } from "../api/types";

export default function InventoryList() {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLowStock, setShowLowStock] = useState(false);

  useEffect(() => {
    loadParts();
  }, [search, showLowStock]);

  async function loadParts() {
    setLoading(true);
    try {
      if (showLowStock) {
        const data = await SparePartsAPI.lowStock();
        setParts(data);
      } else {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        const data = await SparePartsAPI.list(params);
        setParts(data);
      }
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
            <h1 className="text-2xl font-display font-bold">Spare Parts Inventory</h1>
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              Track stock levels, parts, and consumables
            </p>
          </div>
          <Link
            to="/inventory/new"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "var(--color-amber-500)" }}
          >
            + Add Spare Part
          </Link>
        </div>

        <div className="flex gap-3 mb-5">
          <input
            type="text"
            placeholder="Search parts by name, part number, vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: "var(--color-graphite-100)" }}
          />
          <button
            onClick={() => setShowLowStock(!showLowStock)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${showLowStock ? "text-white" : ""}`}
            style={{
              borderColor: "var(--color-graphite-100)",
              backgroundColor: showLowStock ? "var(--color-status-retired)" : "white",
            }}
          >
            {showLowStock ? "Show All" : "Low Stock Alert"}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm" style={{ color: "var(--color-graphite-500)" }}>Loading...</div>
        ) : parts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              {showLowStock ? "No low stock items" : "No spare parts found"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-graphite-100)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--color-graphite-50)" }}>
                  <th className="text-left px-4 py-3 font-medium">Part #</th>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-right px-4 py-3 font-medium">In Stock</th>
                  <th className="text-right px-4 py-3 font-medium">Min Level</th>
                  <th className="text-right px-4 py-3 font-medium">Unit Cost</th>
                  <th className="text-left px-4 py-3 font-medium">Location</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50" style={{ borderColor: "var(--color-graphite-100)" }}>
                    <td className="px-4 py-3 font-mono text-xs">{p.part_number}</td>
                    <td className="px-4 py-3">
                      <Link to={`/inventory/${p.id}`} className="font-medium hover:underline" style={{ color: "var(--color-amber-600)" }}>
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{p.category_name || "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold">{p.quantity_in_stock} {p.unit}</td>
                    <td className="px-4 py-3 text-right">{p.minimum_stock_level}</td>
                    <td className="px-4 py-3 text-right">{p.unit_cost ? `₹${parseFloat(p.unit_cost).toLocaleString()}` : "—"}</td>
                    <td className="px-4 py-3">{p.storeroom || "—"}</td>
                    <td className="px-4 py-3">
                      {p.is_below_minimum ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: "var(--color-status-retired)" }}>Low Stock</span>
                      ) : p.is_critical ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: "var(--color-amber-500)" }}>Critical</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: "var(--color-status-active)" }}>OK</span>
                      )}
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
