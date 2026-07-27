import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { OperatorsAPI } from "../api/workforce";

export default function OperatorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "", phone: "", email: "", employee_id: "",
    designation: "", department: "", skills: "",
    license_number: "", license_expiry: "",
    status: "active", date_of_joining: "",
    emergency_contact_name: "", emergency_contact_phone: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      OperatorsAPI.get(id).then((op) => {
        setForm({
          name: op.name, phone: op.phone, email: op.email,
          employee_id: op.employee_id, designation: op.designation,
          department: op.department, skills: op.skills,
          license_number: op.license_number, license_expiry: op.license_expiry || "",
          status: op.status, date_of_joining: op.date_of_joining || "",
          emergency_contact_name: op.emergency_contact_name,
          emergency_contact_phone: op.emergency_contact_phone,
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
      const payload: any = { ...form };
      if (!payload.license_expiry) delete payload.license_expiry;
      if (!payload.date_of_joining) delete payload.date_of_joining;
      if (isEdit) {
        await OperatorsAPI.update(id!, payload);
      } else {
        await OperatorsAPI.create(payload);
      }
      navigate("/operators");
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
          {isEdit ? "Edit Operator" : "Add New Operator"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
            <h2 className="font-semibold mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Employee ID</label>
                <input name="employee_id" value={form.employee_id} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Designation</label>
                <input name="designation" value={form.designation} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Department</label>
                <input name="department" value={form.department} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }}>
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="contract">Contract</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Date of Joining</label>
                <input name="date_of_joining" type="date" value={form.date_of_joining} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
            <h2 className="font-semibold mb-4">Professional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1">Skills / Certifications</label>
                <textarea name="skills" value={form.skills} onChange={handleChange} rows={2} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} placeholder="e.g. Crane Operator, Heavy Vehicle License, ISO Certified" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">License Number</label>
                <input name="license_number" value={form.license_number} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">License Expiry</label>
                <input name="license_expiry" type="date" value={form.license_expiry} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--color-graphite-100)" }}>
            <h2 className="font-semibold mb-4">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Name</label>
                <input name="emergency_contact_name" value={form.emergency_contact_name} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Phone</label>
                <input name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={handleChange} className={inputClass} style={{ borderColor: "var(--color-graphite-100)" }} />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "var(--color-amber-500)" }}>
              {saving ? "Saving..." : isEdit ? "Update Operator" : "Create Operator"}
            </button>
            <button type="button" onClick={() => navigate("/operators")} className="px-6 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: "var(--color-graphite-100)" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
