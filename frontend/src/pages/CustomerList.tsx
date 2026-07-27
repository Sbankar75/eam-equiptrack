import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { CustomersAPI } from "../api/customers";
import type { Customer } from "../api/types";

const STATUS_COLORS: Record<string, string> = {
  active: "var(--color-status-active)",
  inactive: "var(--color-status-retired)",
  prospect: "var(--color-amber-500)",
};

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, [search, statusFilter]);

  async function loadCustomers() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const data = await CustomersAPI.list(params);
      setCustomers(data);
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
            <h1 className="text-2xl font-display font-bold">Customers</h1>
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              Manage your customer database
            </p>
          </div>
          <Link
            to="/customers/new"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "var(--color-amber-500)" }}
          >
            + Add Customer
          </Link>
        </div>

        <div className="flex gap-3 mb-5">
          <input
            type="text"
            placeholder="Search customers..."
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
            <option value="inactive">Inactive</option>
            <option value="prospect">Prospect</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm" style={{ color: "var(--color-graphite-500)" }}>Loading...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>No customers found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-graphite-100)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--color-graphite-50)" }}>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Contact</th>
                  <th className="text-left px-4 py-3 font-medium">City</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Assets</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50" style={{ borderColor: "var(--color-graphite-100)" }}>
                    <td className="px-4 py-3">
                      <Link to={`/customers/${c.id}`} className="font-medium hover:underline" style={{ color: "var(--color-amber-600)" }}>
                        {c.name}
                      </Link>
                      {c.contact_person && (
                        <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>{c.contact_person}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize">{c.customer_type}</td>
                    <td className="px-4 py-3">
                      <div>{c.email}</div>
                      <div className="text-xs" style={{ color: "var(--color-graphite-500)" }}>{c.phone}</div>
                    </td>
                    <td className="px-4 py-3">{c.city}{c.state ? `, ${c.state}` : ""}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: STATUS_COLORS[c.status] || "gray" }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{c.asset_count}</td>
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
