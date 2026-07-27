import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { OperatorsAPI } from "../api/workforce";
import type { Operator } from "../api/types";

const STATUS_COLORS: Record<string, string> = {
  active: "var(--color-status-active)",
  on_leave: "var(--color-amber-500)",
  terminated: "var(--color-status-retired)",
  contract: "var(--color-graphite-500)",
};

export default function OperatorList() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOperators();
  }, [search, statusFilter]);

  async function loadOperators() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const data = await OperatorsAPI.list(params);
      setOperators(data);
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
            <h1 className="text-2xl font-display font-bold">Operators</h1>
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              Manage operator profiles and workforce
            </p>
          </div>
          <Link
            to="/operators/new"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "var(--color-amber-500)" }}
          >
            + Add Operator
          </Link>
        </div>

        <div className="flex gap-3 mb-5">
          <input
            type="text"
            placeholder="Search operators..."
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
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="contract">Contract</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm" style={{ color: "var(--color-graphite-500)" }}>Loading...</div>
        ) : operators.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>No operators found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operators.map((op) => (
              <Link
                key={op.id}
                to={`/operators/${op.id}`}
                className="bg-white rounded-xl border p-5 hover:shadow-md transition"
                style={{ borderColor: "var(--color-graphite-100)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{op.name}</h3>
                    <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>
                      {op.designation || op.department || "No designation"}
                    </p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: STATUS_COLORS[op.status] || "gray" }}
                  >
                    {op.status.replace("_", " ")}
                  </span>
                </div>
                <div className="space-y-1 text-sm" style={{ color: "var(--color-graphite-600)" }}>
                  {op.employee_id && <p>ID: {op.employee_id}</p>}
                  {op.phone && <p>📞 {op.phone}</p>}
                  {op.date_of_joining && <p>Joined: {op.date_of_joining}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
