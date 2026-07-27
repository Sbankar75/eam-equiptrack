import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { CustomersAPI } from "../api/customers";
import type { Customer } from "../api/types";

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "", customer_type: "company", status: "active",
    contact_person: "", email: "", secondary_email: "",
    phone: "", secondary_phone: "",
    address_line1: "", address_line2: "", city: "", state: "", pincode: "", country: "India",
    gstin: "", pan: "", credit_limit: "", payment_terms_days: "30", notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      CustomersAPI.get(id).then((c) => {
        setForm({
          name: c.name, customer_type: c.customer_type, status: c.status,
          contact_person: c.contact_person, email: c.email, secondary_email: c.secondary_email,
          phone: c.phone, secondary_phone: c.secondary_phone,
          address_line1: c.address_line1, address_line2: c.address_line2,
          city: c.city, state: c.state, pincode: c.pincode, country: c.country,
          gstin: c.gstin, pan: c.pan,
          credit_limit: c.credit_limit || "", payment_terms_days: String(c.payment_terms_days),
          notes: c.notes,
        });
      });
    }
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = { ...form, payment_terms_days: parseInt(form.payment_terms_days) || 30 };
      if (!payload.credit_limit) delete payload.credit_limit;
      if (isEdit) {
        await CustomersAPI.update(id!, payload);
      } else {
        await CustomersAPI.create(payload);
      }
      navigate("/customers");
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border text-sm";

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-display font-bold mb-6">
          {isEdit ? "Edit Customer" : "Add New Customer"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
            <h2 className="font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Company/Customer Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Contact Person</label>
                <input name="contact_person" value={form.contact_person} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Customer Type</label>
                <select name="customer_type" value={form.customer_type} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="company">Company</option>
                  <option value="individual">Individual</option>
                  <option value="government">Government</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
            <h2 className="font-semibold mb-4">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Primary Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Secondary Email</label>
                <input name="secondary_email" type="email" value={form.secondary_email} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Primary Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Secondary Phone</label>
                <input name="secondary_phone" value={form.secondary_phone} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
            <h2 className="font-semibold mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1">Address Line 1</label>
                <input name="address_line1" value={form.address_line1} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1">Address Line 2</label>
                <input name="address_line2" value={form.address_line2} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">City</label>
                <input name="city" value={form.city} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">State</label>
                <input name="state" value={form.state} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Pincode</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Country</label>
                <input name="country" value={form.country} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
            <h2 className="font-semibold mb-4">Tax & Business</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">GSTIN</label>
                <input name="gstin" value={form.gstin} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">PAN</label>
                <input name="pan" value={form.pan} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Credit Limit (₹)</label>
                <input name="credit_limit" type="number" value={form.credit_limit} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Payment Terms (Days)</label>
                <input name="payment_terms_days" type="number" value={form.payment_terms_days} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1">Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: "var(--color-amber-500)" }}
            >
              {saving ? "Saving..." : isEdit ? "Update Customer" : "Create Customer"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="px-6 py-2 rounded-lg text-sm font-medium border"
              style={{ borderColor: "var(--color-graphite-100)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
