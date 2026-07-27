export interface AssetPhoto {
  id: string;
  image: string;
  caption: string;
  uploaded_at: string;
}

export interface Asset {
  id: string;
  asset_code: string;
  name: string;
  category: string;
  make: string;
  model_number: string;
  serial_number: string;
  purchase_date: string | null;
  purchase_cost: string | null;
  warranty_expiry: string | null;
  amc_expiry: string | null;
  current_location: string;
  assigned_customer: string | null;
  assigned_customer_name: string | null;
  assigned_operator: string | null;
  assigned_operator_name: string | null;
  status: "active" | "under_maintenance" | "idle" | "retired";
  notes: string;
  photos: AssetPhoto[];
  created_at: string;
  updated_at: string;
}

export interface LogbookEntry {
  id: string;
  asset: string;
  asset_code: string;
  entry_type: "usage" | "service" | "breakdown" | "repair" | "fuel" | "inspection";
  entry_date: string;
  hours_meter_reading: string | null;
  odometer_reading: string | null;
  description: string;
  cost: string | null;
  recorded_by: string | null;
  recorded_by_name: string | null;
  created_at: string;
}

// Customer types
export interface CustomerContact {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  is_primary: boolean;
}

export interface Customer {
  id: string;
  name: string;
  customer_type: "individual" | "company" | "government";
  status: "active" | "inactive" | "prospect";
  contact_person: string;
  email: string;
  secondary_email: string;
  phone: string;
  secondary_phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstin: string;
  pan: string;
  credit_limit: string | null;
  payment_terms_days: number;
  notes: string;
  contacts: CustomerContact[];
  asset_count: number;
  created_at: string;
  updated_at: string;
}

export interface MarketData {
  id: string;
  title: string;
  content: string;
  category: string;
  shared_with_all_admins: boolean;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

// Workforce types
export interface Operator {
  id: string;
  user: string | null;
  name: string;
  phone: string;
  email: string;
  employee_id: string;
  designation: string;
  department: string;
  skills: string;
  license_number: string;
  license_expiry: string | null;
  status: "active" | "on_leave" | "terminated" | "contract";
  date_of_joining: string | null;
  date_of_exit: string | null;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface SalaryRecord {
  id: string;
  operator: string;
  operator_name: string;
  month: string;
  basic_salary: string;
  overtime_amount: string;
  deductions: string;
  bonus: string;
  net_payable: string;
  payment_mode: string;
  payment_date: string | null;
  payment_reference: string;
  status: "pending" | "paid" | "partial" | "hold";
  notes: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  operator: string;
  operator_name: string;
  date: string;
  status: "present" | "absent" | "half_day" | "leave" | "holiday";
  check_in: string | null;
  check_out: string | null;
  overtime_hours: string;
  site_location: string;
  notes: string;
  marked_by: string | null;
  created_at: string;
}

// Billing types
export interface WorkOrder {
  id: string;
  wo_number: string;
  title: string;
  description: string;
  work_type: "preventive" | "corrective" | "breakdown" | "inspection" | "installation";
  asset: string | null;
  asset_name: string;
  customer: string | null;
  customer_name: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "draft" | "open" | "in_progress" | "on_hold" | "completed" | "cancelled";
  assigned_to: string | null;
  assigned_to_name: string;
  scheduled_date: string | null;
  due_date: string | null;
  completed_date: string | null;
  estimated_cost: string | null;
  actual_cost: string | null;
  labor_hours: string | null;
  notes: string;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  description: string;
  part_number: string;
  quantity: string;
  unit: string;
  unit_price: string;
  tax_percent: string;
  total: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string;
  vendor_address: string;
  work_order: string | null;
  status: "draft" | "sent" | "acknowledged" | "partial_received" | "received" | "cancelled";
  order_date: string | null;
  expected_delivery: string | null;
  delivery_date: string | null;
  subtotal: string;
  tax_amount: string;
  discount: string;
  total_amount: string;
  terms_and_conditions: string;
  notes: string;
  items: PurchaseOrderItem[];
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsn_sac_code: string;
  quantity: string;
  unit: string;
  unit_price: string;
  tax_percent: string;
  amount: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer: string | null;
  customer_name: string;
  work_order: string | null;
  invoice_date: string;
  due_date: string | null;
  status: "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled";
  subtotal: string;
  cgst: string;
  sgst: string;
  igst: string;
  total_tax: string;
  discount: string;
  grand_total: string;
  amount_paid: string;
  balance_due: string;
  notes: string;
  terms: string;
  items: InvoiceItem[];
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentReceipt {
  id: string;
  receipt_number: string;
  invoice: string | null;
  customer: string | null;
  customer_name: string;
  amount: string;
  payment_date: string;
  payment_mode: string;
  reference_number: string;
  receipt_image: string | null;
  ocr_extracted_text: string;
  ocr_processed: boolean;
  notes: string;
  recorded_by: string | null;
  created_at: string;
}

// Spares types
export interface SparePart {
  id: string;
  part_number: string;
  name: string;
  category: string | null;
  category_name: string;
  description: string;
  quantity_in_stock: string;
  unit: string;
  minimum_stock_level: string;
  maximum_stock_level: string | null;
  reorder_quantity: string | null;
  unit_cost: string | null;
  selling_price: string | null;
  warehouse_location: string;
  storeroom: string;
  vendor_name: string;
  vendor_part_number: string;
  is_critical: boolean;
  is_below_minimum: boolean;
  photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceSchedule {
  id: string;
  asset: string;
  asset_name: string;
  title: string;
  description: string;
  frequency: string;
  trigger_hours: string | null;
  last_performed: string | null;
  next_due: string | null;
  status: "active" | "paused" | "completed";
  checklist: string;
  estimated_duration_hours: string | null;
  assigned_to: string | null;
  assigned_to_name: string;
  created_at: string;
  updated_at: string;
}
