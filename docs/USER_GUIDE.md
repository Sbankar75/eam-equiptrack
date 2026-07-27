# EquipTrack EAM Platform — User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Login & Authentication](#login--authentication)
3. [Dashboard Navigation](#dashboard-navigation)
4. [Equipment Module](#equipment-module)
5. [Customer Module](#customer-module)
6. [Workforce Module](#workforce-module)
7. [Billing Module](#billing-module)
8. [Spares & Maintenance Module](#spares--maintenance-module)
9. [Admin Panel](#admin-panel)
10. [Roles & Permissions](#roles--permissions)
11. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites
- Python 3.10+ (with pip)
- Node.js 18+ (with npm)
- Git (optional)

### Installation

**Step 1: Open terminal in the project root folder** (`equiptrack-eam-platform/`)

**Step 2: Set up backend**
```powershell
# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Seed demo data (REQUIRED for first login)
Get-Content seed_demo_data.py | python manage.py shell

# Start backend server
python manage.py runserver 8000
```

**Step 3: Set up frontend** (new terminal, same project root)
```powershell
cd frontend
npm install
npm run dev
```

**Step 4: Open the app**
- Frontend: http://localhost:5173
- Django Admin: http://localhost:8000/admin/

### Demo Credentials
| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin12345` |
| Role | Owner (full access) |
| Tenant | Demo Equipment Co. |

---

## Login & Authentication

1. Open http://localhost:5173
2. Enter username and password
3. Click **Login**

The system uses JWT (JSON Web Token) authentication:
- Tokens carry your tenant, role, and name
- Sessions auto-refresh in the background
- If your session expires, you'll be redirected to login

---

## Dashboard Navigation

The left sidebar organizes all modules into groups:

| Group | Pages |
|-------|-------|
| **Equipment** | Asset Details |
| **Customer** | Customers, Market Data (Admin) |
| **Workforce** | Operator Details, Payment/Salary, Attendance |
| **Billing** | Work Orders, Purchase Orders, Invoicing, Payment Receipts |
| **Spares** | Inventory, Maintenance |

Click any item in the sidebar to navigate to that module.

---

## Equipment Module

### Asset Details (`/assets`)
View all equipment/assets registered in the system.

**Features:**
- **Search** — Find assets by name, code, or serial number
- **Filter** — Filter by status (Active, Under Maintenance, Idle, Retired)
- **Add Asset** — Click "+ Add Asset" button to register new equipment
- **View Detail** — Click any asset name to see full details + logbook history

**Asset Fields:**
- Asset Code (unique identifier, e.g. EXC-001)
- Name, Category, Make, Model, Serial Number
- Purchase Date, Cost, Warranty/AMC Expiry
- Current Location
- Assigned Customer & Operator
- Status
- Photos (multiple)

### Logbook
Each asset has a timeline of entries:
- **Usage** — daily operation logs with hour/odometer readings
- **Service** — scheduled/unscheduled maintenance
- **Breakdown** — equipment failure records
- **Repair** — fix details and costs
- **Fuel** — fuel consumption tracking
- **Inspection** — regulatory or safety inspections

---

## Customer Module

### Customer List (`/customers`)
Full customer relationship management.

**Features:**
- **Search** — by name, email, phone, GSTIN
- **Filter** — by status (Active, Inactive, Prospect) or type
- **Add Customer** — complete form with business details
- **View Detail** — click name for full profile

**Customer Types:**
- Individual
- Company
- Government

**Customer Fields:**
- Name, Contact Person, Type, Status
- Primary & Secondary Email/Phone
- Full Address (line 1, line 2, city, state, pincode, country)
- GSTIN, PAN (tax identification)
- Credit Limit, Payment Terms (days)
- Notes
- Additional Contacts (name, designation, email, phone)

### Customer Report
Available via the API: `/api/customers/report/`  
Returns summary statistics — total, active/inactive/prospect counts, breakdown by type and city.

### Market Data (`/market-data`)
**Admin/Owner only** — Internal market intelligence notes.

- Add entries with title, category, and content
- Categories: pricing, competitor, trend, etc.
- Not visible to operators or vendors
- Delete entries when no longer relevant

---

## Workforce Module

### Operator Details (`/operators`)
Manage your field workforce — operators, technicians, drivers.

**Features:**
- Grid/card view of all operators
- Color-coded status badges
- Search and filter by status
- Add/edit operator profiles

**Operator Fields:**
- Name, Employee ID, Phone, Email
- Designation, Department
- Skills/Certifications (comma-separated)
- License Number & Expiry
- Status (Active, On Leave, Contract, Terminated)
- Date of Joining/Exit
- Emergency Contact
- Photo

### Payment / Salary (`/payroll`)
Track monthly salary payments for operators.

**How to use:**
1. Click "+ Add Salary Record"
2. Select operator from dropdown
3. Enter month, basic salary, overtime, deductions, bonus
4. Net payable auto-calculates
5. Set payment mode and status
6. Save

**Salary Status:**
- Pending — not yet paid
- Paid — payment completed
- Partial — partial payment made
- Hold — payment on hold

### Attendance (`/attendance`)
Daily attendance marking and tracking.

**How to use:**
1. Select date using the date picker (defaults to today)
2. Click "+ Mark Attendance"
3. Select operator, set status, optionally add check-in/out times
4. Add site location and overtime hours if applicable
5. Save

**Attendance Status:**
- Present, Absent, Half Day, Leave, Holiday

---

## Billing Module

### Work Orders (`/work-orders`)
Track maintenance and service jobs from creation to completion.

**How to use:**
1. Click "+ New Work Order"
2. Fill in WO number (auto-generated), title, work type
3. Link to an asset and/or customer
4. Set priority and due date
5. Add cost estimates
6. Save

**Work Order Lifecycle:**
Draft → Open → In Progress → Completed (or On Hold / Cancelled)

**Work Types:**
- Preventive Maintenance
- Corrective Maintenance
- Breakdown Repair
- Inspection
- Installation

**Priority Levels:** Low, Medium, High, Critical

### Purchase Orders (`/purchase-orders`)
Create and manage purchase orders for parts and services.

**Features:**
- Create POs linked to work orders
- Add vendor details (name, email, phone, address)
- Track PO status from draft to received
- Line items with quantity, unit price, tax

**PO Lifecycle:**
Draft → Sent → Acknowledged → Partial Received → Received (or Cancelled)

### Invoicing (`/invoices`)
Generate and manage customer invoices.

**Features:**
- Create invoices linked to customers and work orders
- Line items with HSN/SAC codes
- GST calculation (CGST, SGST, IGST)
- Track payment status and balance due
- Filter by status

**Invoice Lifecycle:**
Draft → Sent → Paid (or Partial / Overdue / Cancelled)

### Payment Receipts (`/receipts`)
Record payments received from customers.

**Features:**
- Record receipt with amount, date, mode, reference number
- Link to customer and invoice
- OCR support (placeholder) for receipt image scanning
- Multiple payment modes: Bank Transfer, Cash, Cheque, UPI, Card

---

## Spares & Maintenance Module

### Inventory (`/inventory`)
Track spare parts stock levels and manage procurement.

**Features:**
- Full parts catalog with part numbers
- Real-time stock levels vs. minimum thresholds
- **Low Stock Alert** — one-click filter for items below minimum
- Category organization
- Vendor information per part
- Location tracking (warehouse, rack, bin)

**Key Fields:**
- Part Number, Name, Category
- Quantity in Stock, Unit (nos/kg/ltrs/meters)
- Min/Max stock levels, Reorder quantity
- Unit Cost, Selling Price
- Warehouse Location, Storeroom
- Compatible Assets (linked)
- Critical flag

**Stock Status Indicators:**
- 🟢 **OK** — above minimum level
- 🟡 **Critical** — flagged as critical spare
- 🔴 **Low Stock** — below minimum stock level

### Maintenance Schedules (`/maintenance`)
Plan and track preventive maintenance.

**Features:**
- Schedule recurring maintenance for assets
- Frequency-based (daily, weekly, monthly, quarterly, yearly, custom hours)
- Track last performed date and next due date
- **Overdue filter** — see all overdue maintenance at a glance
- **Mark Done** — complete a maintenance task (auto-updates next due)

---

## Admin Panel

Access at: http://localhost:8000/admin/

The Django admin provides direct database access for power users:
- View/edit all records across all modules
- Bulk operations
- Advanced filtering
- Useful for data corrections and initial setup

**Registered Models:**
- Tenants, Users
- Customers, Customer Contacts, Market Data
- Assets, Asset Photos
- Logbook Entries
- Operators, Salary Records, Attendance
- Work Orders, Purchase Orders, PO Items, Invoices, Invoice Items, Payment Receipts
- Spare Part Categories, Spare Parts, Stock Transactions, Maintenance Schedules

---

## Roles & Permissions

| Role | Access Level |
|------|-------------|
| **Owner** | Full access to everything including Market Data and settings |
| **Admin** | Full access to all operational modules and Market Data |
| **Manager** | Can manage assets, customers, workforce, billing, spares |
| **Operator** | Limited to assigned assets, own attendance, basic views |
| **Vendor** | View POs and invoices related to them only |

**Data Isolation:**
- All data is scoped to your tenant (company)
- Users can never see data from other tenants
- Market Data is restricted to Admin/Owner roles only

---

## Troubleshooting

### "Cannot find path" when running commands
You're already in the project root. Don't `cd eam-platform` — just run commands directly:
```powershell
# ✅ Correct (from equiptrack-eam-platform/):
python manage.py runserver 8000
cd frontend && npm run dev

# ❌ Wrong:
cd eam-platform
```

### Login fails / "No active account"
The seed script hasn't been run. Execute:
```powershell
Get-Content seed_demo_data.py | python manage.py shell
```
Then log in with `admin` / `admin12345`.

### "npm error ENOENT package.json"
You need to be in the `frontend/` subfolder for npm commands:
```powershell
cd frontend
npm install
```

### Backend won't start / import errors
Make sure virtual environment is active and dependencies are installed:
```powershell
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
```

### Frontend shows blank page / API errors
1. Make sure the backend is running on port 8000
2. Check browser console for errors
3. If CORS error: backend CORS is set to allow all in dev mode

### Port already in use
```powershell
# Find and kill process on port 8000:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use a different port:
python manage.py runserver 8001
```

---

## API Quick Reference

Base URL: `http://127.0.0.1:8000/api/`

All endpoints require a Bearer token in the Authorization header (handled automatically by the frontend).

### Auth
```
POST /api/auth/login/        → { username, password } → { access, refresh }
POST /api/auth/refresh/      → { refresh } → { access }
GET  /api/auth/me/           → user profile
```

### CRUD Pattern
All resource endpoints follow standard REST:
```
GET    /api/{resource}/          → List all (with ?search=, ?status=, etc.)
POST   /api/{resource}/          → Create new
GET    /api/{resource}/{id}/     → Get detail
PATCH  /api/{resource}/{id}/     → Update
DELETE /api/{resource}/{id}/     → Delete
```

### Resources
| Resource | Endpoint |
|----------|----------|
| Assets | `/api/assets/` |
| Asset Photos | `/api/asset-photos/` |
| Logbook Entries | `/api/logbook-entries/` |
| Customers | `/api/customers/` |
| Market Data | `/api/market-data/` |
| Operators | `/api/operators/` |
| Salary Records | `/api/salary-records/` |
| Attendance | `/api/attendance/` |
| Work Orders | `/api/work-orders/` |
| Purchase Orders | `/api/purchase-orders/` |
| Invoices | `/api/invoices/` |
| Payment Receipts | `/api/payment-receipts/` |
| Spare Categories | `/api/spare-categories/` |
| Spare Parts | `/api/spare-parts/` |
| Stock Transactions | `/api/stock-transactions/` |
| Maintenance Schedules | `/api/maintenance-schedules/` |
