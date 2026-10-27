import { type ReactNode, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Truck, Wrench, ClipboardList, FileText,
  Package, Users, BarChart3, ChevronLeft, ChevronRight,
  LogOut, Home, User, DollarSign, CalendarCheck,
  ShoppingCart, Receipt, Warehouse, Settings2, BookOpen,
} from "lucide-react";

const TOP_TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { id: "assets", label: "Assets", icon: Truck, path: "/assets" },
  { id: "work-orders", label: "Work Management", icon: Wrench, path: "/work-orders" },
  { id: "maintenance", label: "Maintenance", icon: Settings2, path: "/maintenance" },
  { id: "billing", label: "Billing", icon: FileText, path: "/invoices" },
  { id: "workforce", label: "Workforce", icon: Users, path: "/operators" },
  { id: "inventory", label: "Inventory", icon: Package, path: "/inventory" },
  { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
];

const SIDEBAR_ITEMS: Record<string, { label: string; to: string; icon: typeof Home }[]> = {
  dashboard: [],
  assets: [
    { label: "All Assets", to: "/assets", icon: Truck },
    { label: "Logbook", to: "/assets", icon: BookOpen },
    { label: "Add Asset", to: "/assets/new", icon: Truck },
  ],
  "work-orders": [
    { label: "Work Orders", to: "/work-orders", icon: ClipboardList },
    { label: "New Work Order", to: "/work-orders/new", icon: ClipboardList },
  ],
  maintenance: [
    { label: "Schedules", to: "/maintenance", icon: Settings2 },
  ],
  billing: [
    { label: "Invoices", to: "/invoices", icon: FileText },
    { label: "Purchase Orders", to: "/purchase-orders", icon: ShoppingCart },
    { label: "Payment Receipts", to: "/receipts", icon: Receipt },
  ],
  workforce: [
    { label: "Operators", to: "/operators", icon: Users },
    { label: "Add Operator", to: "/operators/new", icon: User },
    { label: "Payroll", to: "/payroll", icon: DollarSign },
    { label: "Attendance", to: "/attendance", icon: CalendarCheck },
  ],
  inventory: [
    { label: "Spare Parts", to: "/inventory", icon: Warehouse },
    { label: "Customers", to: "/customers", icon: Users },
    { label: "Market Data", to: "/market-data", icon: BarChart3 },
  ],
  reports: [],
};

function getActiveTab(pathname: string): string {
  if (pathname === "/" || pathname === "/dashboard") return "dashboard";
  if (pathname.startsWith("/assets")) return "assets";
  if (pathname.startsWith("/work-orders")) return "work-orders";
  if (pathname.startsWith("/maintenance")) return "maintenance";
  if (pathname.startsWith("/invoices") || pathname.startsWith("/purchase-orders") || pathname.startsWith("/receipts")) return "billing";
  if (pathname.startsWith("/operators") || pathname.startsWith("/payroll") || pathname.startsWith("/attendance")) return "workforce";
  if (pathname.startsWith("/inventory") || pathname.startsWith("/customers") || pathname.startsWith("/market-data")) return "inventory";
  if (pathname.startsWith("/reports")) return "reports";
  return "dashboard";
}

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeTab = getActiveTab(location.pathname);
  const sidebarItems = SIDEBAR_ITEMS[activeTab] || [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header Bar */}
      <header className="h-14 flex items-center justify-between px-5 shrink-0"
        style={{ backgroundColor: "var(--color-primary-800)" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--color-primary-500)" }}>
              <Truck size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-base tracking-tight">EquipTrack</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded font-medium"
            style={{ backgroundColor: "var(--color-primary-700)", color: "var(--color-primary-200)" }}>
            EAM
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Home size={16} className="text-white/70 cursor-pointer hover:text-white" onClick={() => navigate("/")} />
          </div>
          <div className="flex items-center gap-2 pl-3"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.2)" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: "var(--color-primary-600)" }}>
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="text-xs text-white/90">
              <p className="font-medium">{user?.full_name}</p>
            </div>
            <button onClick={() => { logout(); navigate("/login"); }}
              className="ml-2 p-1.5 rounded hover:bg-white/10 transition" title="Sign out">
              <LogOut size={15} className="text-white/70" />
            </button>
          </div>
        </div>
      </header>

      {/* Top Navigation Tabs */}
      <nav className="h-11 flex items-center px-2 gap-1 shrink-0"
        style={{ backgroundColor: "var(--color-primary-700)" }}>
        {TOP_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-medium transition-all"
              style={{
                backgroundColor: isActive ? "white" : "transparent",
                color: isActive ? "var(--color-primary-800)" : "rgba(255,255,255,0.85)",
              }}
            >
              <Icon size={14} />
              {tab.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Body: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Collapsible Sidebar */}
        {sidebarItems.length > 0 && (
          <aside
            className="shrink-0 flex flex-col border-r transition-all duration-200 overflow-hidden"
            style={{
              width: sidebarOpen ? "200px" : "0px",
              borderColor: "var(--color-slate-200)",
              backgroundColor: "var(--color-primary-800)",
            }}
          >
            <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to + item.label}
                    to={item.to}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all"
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                      color: isActive ? "white" : "rgba(255,255,255,0.75)",
                    }}
                  >
                    <Icon size={15} />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-center py-2 border-t hover:bg-white/10 transition"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <ChevronLeft size={16} className="text-white/60" />
            </button>
          </aside>
        )}

        {/* Sidebar toggle (when collapsed) */}
        {sidebarItems.length > 0 && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="shrink-0 w-6 flex items-center justify-center border-r hover:bg-slate-200 transition"
            style={{ borderColor: "var(--color-slate-200)", backgroundColor: "var(--color-slate-50)" }}
          >
            <ChevronRight size={14} style={{ color: "var(--color-slate-500)" }} />
          </button>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
