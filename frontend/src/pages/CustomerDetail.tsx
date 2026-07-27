import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { CustomersAPI } from "../api/customers";
import type { Customer } from "../api/types";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      CustomersAPI.get(id).then((c) => { setCustomer(c); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Layout><div className="p-6">Loading...</div></Layout>;
  if (!customer) return <Layout><div className="p-6">Customer not found</div></Layout>;

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold">{customer.name}</h1>
            <p className="text-sm" style={{ color: "var(--color-graphite-500)" }}>
              {customer.customer_type} &middot; {customer.city}{customer.state ? `, ${customer.state}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/customers/${id}/edit`}
              className="px-4 py-2 rounded-lg text-sm font-medium border"
              style={{ borderColor: "var(--color-graphite-100)" }}
            >
              Edit
            </Link>
            <button
              onClick={async () => {
                if (confirm("Delete this customer?")) {
                  await CustomersAPI.remove(id!);
                  navigate("/customers");
                }
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: "var(--color-status-retired)" }}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
              <h2 className="font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>Contact Person</p>
                  <p className="font-medium">{customer.contact_person || "—"}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>Email</p>
                  <p className="font-medium">{customer.email || "—"}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>Phone</p>
                  <p className="font-medium">{customer.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>Secondary Phone</p>
                  <p className="font-medium">{customer.secondary_phone || "—"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
              <h2 className="font-semibold mb-4">Address</h2>
              <p className="text-sm">
                {customer.address_line1}{customer.address_line1 && <br />}
                {customer.address_line2}{customer.address_line2 && <br />}
                {customer.city}{customer.state ? `, ${customer.state}` : ""} {customer.pincode}<br />
                {customer.country}
              </p>
            </div>

            {customer.contacts && customer.contacts.length > 0 && (
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
                <h2 className="font-semibold mb-4">Additional Contacts</h2>
                <div className="space-y-3">
                  {customer.contacts.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--color-graphite-50)" }}>
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>{c.designation}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p>{c.email}</p>
                        <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>{c.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
              <h2 className="font-semibold mb-4">Business Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>GSTIN</p>
                  <p className="font-mono">{customer.gstin || "—"}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>PAN</p>
                  <p className="font-mono">{customer.pan || "—"}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>Credit Limit</p>
                  <p>₹{customer.credit_limit || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>Payment Terms</p>
                  <p>{customer.payment_terms_days} days</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--color-graphite-500)" }}>Assets Assigned</p>
                  <p className="font-semibold text-lg">{customer.asset_count}</p>
                </div>
              </div>
            </div>

            {customer.notes && (
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
                <h2 className="font-semibold mb-2">Notes</h2>
                <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
