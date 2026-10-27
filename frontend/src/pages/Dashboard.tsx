import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import {
  Truck, Wrench, BookOpen, BarChart3, FileText, Package,
  Settings2, Users, DollarSign, Receipt, ClipboardList, Warehouse,
} from "lucide-react";
import { api } from "../api/client";

interface DashboardStats {
  total_assets: number;
  active_assets: number;
  maintenance_assets: number;
  total_customers: number;
  total_operators: number;
  open_work_orders: number;
  pending_invoices: number;
  low_stock_items: number;
}

const MODULE_CARDS = [
  { id: "assets", label: "Asset", description: "Equipment & machinery", icon: Truck, path: "/assets", color: "#0E7474" },
  { id: "work-orders", label: "Work Order", description: "Maintenance jobs", icon: Wrench, path: "/work-orders", color: "#7C3AED" },
  { id: "logbook", label: "Logbook", description: "Usage & service history", icon: BookOpen, path: "/assets", color: "#0F8585" },
  { id: "reports", label: "Reports", description: "Analytics & insights", icon: BarChart3, path: "/reports", color: "#334155" },
  { id: "invoices", label: "Invoice", description: "Sales & billing", icon: FileText, path: "/invoices", color: "#EA580C" },
  { id: "inventory", label: "Inventory", description: "Stock management", icon: Warehouse, path: "/inventory", color: "#16A34A" },
  { id: "maintenance", label: "Maintenance", description: "PM schedules", icon: Settings2, path: "/maintenance", color: "#2563EB" },
  { id: "customers", label: "Customer", description: "Client database", icon: Users, path: "/customers", color: "#0D3B3B" },
  { id: "spares", label: "Spare", description: "Parts & consumables", icon: Package, path: "/inventory", color: "#16A34A" },
  { id: "payroll", label: "Payroll", description: "Salary & wages", icon: DollarSign, path: "/payroll", color: "#7C3AED" },
  { id: "payments", label: "Payments", description: "Receipts & tracking", icon: Receipt, path: "/receipts", color: "#EA580C" },
  { id: "operators", label: "Workforce", description: "Operators & staff", icon: ClipboardList, path: "/operators", color: "#115E5E" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await api.get("/dashboard/stats/");
      setStats(res.data);
    } catch {
      // Dashboard stats endpoint may not exist yet, use defaults
      setStats({
        total_assets: 0, active_assets: 0, maintenance_assets: 0,
        total_customers: 0, total_operators: 0, open_work_orders: 0,
        pending_invoices: 0, low_stock_items: 0,
      });
    }
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold" style={{ color: "var(--color-slate-900)" }}>
            Welcome back, {user?.full_name || "User"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-slate-500)" }}>
            {user?.tenant_name} &middot; Enterprise Asset Management
          </p>
        </div>

        {/* Quick Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Assets" value={stats.total_assets} color="#0E7474" icon={Truck} />
            <StatCard label="Open Work Orders" value={stats.open_work_orders} color="#7C3AED" icon={Wrench} />
            <StatCard label="Customers" value={stats.total_customers} color="#115E5E" icon={Users} />
            <StatCard label="Low Stock Items" value={stats.low_stock_items} color="#DC2626" icon={Package} />
          </div>
        )}

        {/* Module Cards Grid */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-slate-700)" }}>Modules</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {MODULE_CARDS.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => navigate(mod.path)}
                className="bg-white rounded-xl border p-5 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                style={{ borderColor: "var(--color-slate-200)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: mod.color + "15" }}>
                  <Icon size={24} style={{ color: mod.color }} />
                </div>
                <h3 className="font-semibold text-sm" style={{ color: "var(--color-slate-800)" }}>{mod.label}</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-slate-500)" }}>{mod.description}</p>
                <div className="mt-3 text-xs font-medium px-3 py-1 rounded-full inline-block"
                  style={{ backgroundColor: mod.color, color: "white" }}>
                  {mod.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: typeof Truck }) {
  return (
    <div className="bg-white rounded-xl border p-4 flex items-center gap-3"
      style={{ borderColor: "var(--color-slate-200)" }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: color + "15" }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color }}>{value}</p>
        <p className="text-xs" style={{ color: "var(--color-slate-500)" }}>{label}</p>
      </div>
    </div>
  );
}
