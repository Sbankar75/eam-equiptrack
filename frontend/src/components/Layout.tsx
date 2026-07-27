import { type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_GROUPS = [
  {
    label: "Equipment",
    items: [
      { to: "/assets", label: "Asset Details", enabled: true },
      { to: "/quotations", label: "Quotations", enabled: false },
      { to: "/branding", label: "Logo & Letterheads", enabled: false },
    ],
  },
  {
    label: "Customer",
    items: [
      { to: "/customers", label: "Customers", enabled: true },
      { to: "/market-data", label: "Market Data (Admin)", enabled: true },
    ],
  },
  {
    label: "Workforce",
    items: [
      { to: "/operators", label: "Operator Details", enabled: true },
      { to: "/payroll", label: "Payment / Salary", enabled: true },
      { to: "/attendance", label: "Attendance", enabled: true },
    ],
  },
  {
    label: "Billing",
    items: [
      { to: "/work-orders", label: "Work Orders", enabled: true },
      { to: "/purchase-orders", label: "Purchase Orders", enabled: true },
      { to: "/invoices", label: "Invoicing", enabled: true },
      { to: "/receipts", label: "Payment Receipts (OCR)", enabled: true },
    ],
  },
  {
    label: "Spares",
    items: [
      { to: "/inventory", label: "Inventory", enabled: true },
      { to: "/maintenance", label: "Maintenance", enabled: true },
    ],
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--color-graphite-50)" }}>
      <aside className="w-64 shrink-0 flex flex-col" style={{ backgroundColor: "var(--color-graphite-950)" }}>
        <div className="px-5 py-5 flex items-center gap-2.5" style={{ borderBottom: "1px solid var(--color-graphite-800)" }}>
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: "var(--color-amber-500)" }}>
            <span className="font-display font-bold text-sm text-white">EA</span>
          </div>
          <span className="font-display font-semibold text-white text-sm">EquipTrack</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-wider uppercase" style={{ color: "var(--color-graphite-500)" }}>
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) =>
                  item.enabled ? (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-2.5 py-1.5 rounded-md text-sm transition ${isActive ? "text-white" : ""}`
                      }
                      style={({ isActive }: { isActive: boolean }) => ({
                        backgroundColor: isActive ? "var(--color-graphite-800)" : "transparent",
                        color: isActive ? "white" : "var(--color-graphite-400)",
                      })}
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <div
                      key={item.to}
                      className="px-2.5 py-1.5 rounded-md text-sm flex items-center justify-between cursor-default"
                      style={{ color: "var(--color-graphite-600)" }}
                      title="Not built yet in this preview"
                    >
                      <span>{item.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--color-graphite-800)" }}>soon</span>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-4" style={{ borderTop: "1px solid var(--color-graphite-800)" }}>
          <p className="text-xs text-white font-medium truncate">{user?.full_name}</p>
          <p className="text-[11px] truncate" style={{ color: "var(--color-graphite-500)" }}>{user?.tenant_name} &middot; {user?.role}</p>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="mt-2 text-xs"
            style={{ color: "var(--color-amber-500)" }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
