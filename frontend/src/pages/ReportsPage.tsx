import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";
import {
  Truck, Users, Wrench, Package, TrendingUp, AlertTriangle,
  CheckCircle, Clock,
} from "lucide-react";

interface ReportData {
  assets: { total: number; active: number; maintenance: number; idle: number; retired: number };
  customers: { total: number; active: number; inactive: number; prospects: number };
  work_orders: { total: number; open: number; in_progress: number; completed: number };
  inventory: { total_parts: number; low_stock: number; total_value: number };
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const res = await api.get("/dashboard/reports/");
      setData(res.data);
    } catch {
      // Fallback if endpoint doesn't exist yet
      setData({
        assets: { total: 0, active: 0, maintenance: 0, idle: 0, retired: 0 },
        customers: { total: 0, active: 0, inactive: 0, prospects: 0 },
        work_orders: { total: 0, open: 0, in_progress: 0, completed: 0 },
        inventory: { total_parts: 0, low_stock: 0, total_value: 0 },
      });
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-sm" style={{ color: "var(--color-slate-500)" }}>Loading reports...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold" style={{ color: "var(--color-slate-900)" }}>
            Reports & Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-slate-500)" }}>
            Overview of platform metrics and KPIs
          </p>
        </div>

        {data && (
          <div className="space-y-6">
            {/* Asset Summary */}
            <ReportSection title="Asset Overview" icon={Truck} color="#0E7474">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <MetricCard label="Total Assets" value={data.assets.total} icon={Truck} color="#0E7474" />
                <MetricCard label="Active" value={data.assets.active} icon={CheckCircle} color="#16A34A" />
                <MetricCard label="Under Maintenance" value={data.assets.maintenance} icon={Wrench} color="#EA580C" />
                <MetricCard label="Idle" value={data.assets.idle} icon={Clock} color="#64748B" />
                <MetricCard label="Retired" value={data.assets.retired} icon={AlertTriangle} color="#DC2626" />
              </div>
            </ReportSection>

            {/* Customer Summary */}
            <ReportSection title="Customer Overview" icon={Users} color="#115E5E">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="Total Customers" value={data.customers.total} icon={Users} color="#115E5E" />
                <MetricCard label="Active" value={data.customers.active} icon={CheckCircle} color="#16A34A" />
                <MetricCard label="Inactive" value={data.customers.inactive} icon={Clock} color="#64748B" />
                <MetricCard label="Prospects" value={data.customers.prospects} icon={TrendingUp} color="#2563EB" />
              </div>
            </ReportSection>

            {/* Work Order Summary */}
            <ReportSection title="Work Order Overview" icon={Wrench} color="#7C3AED">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="Total WOs" value={data.work_orders.total} icon={Wrench} color="#7C3AED" />
                <MetricCard label="Open" value={data.work_orders.open} icon={AlertTriangle} color="#EA580C" />
                <MetricCard label="In Progress" value={data.work_orders.in_progress} icon={Clock} color="#EAB308" />
                <MetricCard label="Completed" value={data.work_orders.completed} icon={CheckCircle} color="#16A34A" />
              </div>
            </ReportSection>

            {/* Inventory Summary */}
            <ReportSection title="Inventory Overview" icon={Package} color="#16A34A">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <MetricCard label="Total Parts" value={data.inventory.total_parts} icon={Package} color="#16A34A" />
                <MetricCard label="Low Stock" value={data.inventory.low_stock} icon={AlertTriangle} color="#DC2626" />
                <MetricCard label="Total Value (₹)" value={data.inventory.total_value} icon={TrendingUp} color="#0E7474" />
              </div>
            </ReportSection>
          </div>
        )}
      </div>
    </Layout>
  );
}

function ReportSection({ title, icon: Icon, color, children }: {
  title: string; icon: typeof Truck; color: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border p-5" style={{ borderColor: "var(--color-slate-200)" }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} style={{ color }} />
        <h2 className="font-semibold text-base" style={{ color: "var(--color-slate-800)" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: typeof Truck; color: string;
}) {
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-slate-200)" }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: color + "15" }}>
          <Icon size={14} style={{ color }} />
        </div>
      </div>
      <p className="text-xl font-bold" style={{ color }}>{value.toLocaleString()}</p>
      <p className="text-xs mt-0.5" style={{ color: "var(--color-slate-500)" }}>{label}</p>
    </div>
  );
}
