import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AssetList from "./pages/AssetList";
import AssetDetail from "./pages/AssetDetail";
import AssetForm from "./pages/AssetForm";
import CustomerList from "./pages/CustomerList";
import CustomerDetail from "./pages/CustomerDetail";
import CustomerForm from "./pages/CustomerForm";
import MarketDataPage from "./pages/MarketDataPage";
import OperatorList from "./pages/OperatorList";
import OperatorForm from "./pages/OperatorForm";
import Payroll from "./pages/Payroll";
import AttendancePage from "./pages/AttendancePage";
import WorkOrderList from "./pages/WorkOrderList";
import WorkOrderForm from "./pages/WorkOrderForm";
import PurchaseOrderList from "./pages/PurchaseOrderList";
import InvoiceList from "./pages/InvoiceList";
import PaymentReceipts from "./pages/PaymentReceipts";
import InventoryList from "./pages/InventoryList";
import MaintenancePage from "./pages/MaintenancePage";
import ReportsPage from "./pages/ReportsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Assets */}
      <Route path="/assets" element={<ProtectedRoute><AssetList /></ProtectedRoute>} />
      <Route path="/assets/new" element={<ProtectedRoute><AssetForm /></ProtectedRoute>} />
      <Route path="/assets/:id" element={<ProtectedRoute><AssetDetail /></ProtectedRoute>} />

      {/* Work Management */}
      <Route path="/work-orders" element={<ProtectedRoute><WorkOrderList /></ProtectedRoute>} />
      <Route path="/work-orders/new" element={<ProtectedRoute><WorkOrderForm /></ProtectedRoute>} />
      <Route path="/work-orders/:id" element={<ProtectedRoute><WorkOrderForm /></ProtectedRoute>} />

      {/* Maintenance */}
      <Route path="/maintenance" element={<ProtectedRoute><MaintenancePage /></ProtectedRoute>} />

      {/* Billing */}
      <Route path="/invoices" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
      <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrderList /></ProtectedRoute>} />
      <Route path="/receipts" element={<ProtectedRoute><PaymentReceipts /></ProtectedRoute>} />

      {/* Workforce */}
      <Route path="/operators" element={<ProtectedRoute><OperatorList /></ProtectedRoute>} />
      <Route path="/operators/new" element={<ProtectedRoute><OperatorForm /></ProtectedRoute>} />
      <Route path="/operators/:id" element={<ProtectedRoute><OperatorForm /></ProtectedRoute>} />
      <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />

      {/* Inventory & Customers */}
      <Route path="/inventory" element={<ProtectedRoute><InventoryList /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
      <Route path="/customers/new" element={<ProtectedRoute><CustomerForm /></ProtectedRoute>} />
      <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
      <Route path="/customers/:id/edit" element={<ProtectedRoute><CustomerForm /></ProtectedRoute>} />
      <Route path="/market-data" element={<ProtectedRoute><MarketDataPage /></ProtectedRoute>} />

      {/* Reports */}
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
