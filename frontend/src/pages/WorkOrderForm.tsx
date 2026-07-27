import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { WorkOrdersAPI } from "../api/billing";
import { AssetsAPI } from "../api/assets";
import { CustomersAPI } from "../api/customers";
import type { Asset, Customer } from "../api/types";

export default function WorkOrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [form, setForm] = useState({
    wo_number: "", title: "", description: "", work_type: "corrective",
    asset: "", customer: "", priority: "medium", status: "draft",
    scheduled_date: "", due_date: "", estimated_cost: "", notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([AssetsAPI.list(), CustomersAPI.list()]).then(([a, c]) => {
      setAssets(a);
      setCustomers(c);
    });
    if (id) {
      WorkOrdersAPI.get(id).then((wo) => {
        setForm({
          wo_number: wo.wo_number, title: wo.title, description: wo.description,
          work_type: wo.work_type, asset: wo.asset || "", customer: wo.customer || "",
          priority: wo.priority, status: wo.status,
          scheduled_date: wo.scheduled_date || "", due_date: wo.due_date || "",
          estimated_cost: wo.estimated_cost || "", notes: wo.notes,
        });
      });
    } else {
      setForm((f) => ({ ...f, wo_number: `WO-${Date.now().toString(36).toUpperCase()}` }));
    }
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = { ...form };
      if (!payload.asset) payload.asset = null;
      if (!payload.customer) payload.customer = null;
      if (!payload.scheduled_date) delete payload.scheduled_date;
      if (!payload.due_date) delete payload.due_date;
      if (!payload.estimated_cost) delete payload.estimated_cost;
      if (isEdit) {
        await WorkOrdersAPI.update(id!, payload);
      } else {
        await WorkOrdersAPI.create(payload);
      }
      navigate("/work-orders");
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
          {isEdit ? "Edit Work Order" : "New Work Order"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
            <h2 className="font-semibold mb-4">Work Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">WO Number *</label>
                <input name="wo_number" value={form.wo_number} onChange={handleChange} required className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Work Type</label>
                <select name="work_type" value={form.work_type} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="preventive">Preventive Maintenance</option>
                  <option value="corrective">Corrective Maintenance</option>
                  <option value="breakdown">Breakdown Repair</option>
                  <option value="inspection">Inspection</option>
                  <option value="installation">Installation</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Asset</label>
                <select name="asset" value={form.asset} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="">None</option>
                  {assets.map((a) => <option key={a.id} value={a.id}>{a.asset_code} - {a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Customer</label>
                <select name="customer" value={form.customer} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="">None</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Scheduled Date</label>
                <input name="scheduled_date" type="date" value={form.scheduled_date} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Due Date</label>
                <input name="due_date" type="date" value={form.due_date} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Estimated Cost (₹)</label>
                <input name="estimated_cost" type="number" step="0.01" value={form.estimated_cost} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1">Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "var(--color-amber-500)" }}>
              {saving ? "Saving..." : isEdit ? "Update Work Order" : "Create Work Order"}
            </button>
            <button type="button" onClick={() => navigate("/work-orders")} className="px-6 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: "var(--color-graphite-100)" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
