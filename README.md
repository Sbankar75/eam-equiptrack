# EquipTrack -- EAM Platform (v0.2)

Multi-tenant Equipment Asset Management platform built with Django + React.
All core modules are now implemented: Equipment, Customers, Workforce,
Billing, and Spares.

## What's working

| Module | Features |
|--------|----------|
| **Equipment** | Asset CRUD, photos, logbooks (usage/service/breakdown/repair/fuel/inspection) |
| **Customers** | Full CRUD, contacts, address, GST/PAN, credit limits, reports, admin-only market data |
| **Workforce** | Operator profiles, salary/payroll records, daily attendance tracking |
| **Billing** | Work orders, purchase orders, invoices (with line items), payment receipts (OCR placeholder) |
| **Spares** | Spare parts inventory, stock transactions, low-stock alerts, maintenance schedules |
| **Auth** | Multi-tenant JWT with role-based access (owner/admin/manager/operator/vendor) |
| **Admin** | Full Django admin interface for all models |

## Quick start

### Backend (Django)
```bash
# From the project root (equiptrack-eam-platform/):
python -m venv venv
venv\Scripts\activate            # Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate

# Seed demo data (creates login credentials):
# PowerShell:
Get-Content seed_demo_data.py | python manage.py shell
# Linux/Mac:
# python manage.py shell < seed_demo_data.py

python manage.py runserver 8000
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** and log in with:
- Username: `admin`
- Password: `admin12345`

The Django admin is at **http://localhost:8000/admin/** with the same login.

## Project structure
```
equiptrack-eam-platform/
├── eam_backend/        # Django project settings, root URL conf
├── tenants/            # Tenant model (company branding, subscription)
├── accounts/           # Custom User (tenant + role), JWT auth, permissions
├── customers/          # Customer, CustomerContact, MarketData
├── assets/             # Asset, AssetPhoto
├── logbooks/           # LogbookEntry (per-asset timeline)
├── workforce/          # Operator, SalaryRecord, Attendance
├── billing/            # WorkOrder, PurchaseOrder, Invoice, PaymentReceipt
├── spares/             # SparePartCategory, SparePart, StockTransaction, MaintenanceSchedule
├── requirements.txt    # Python dependencies
├── seed_demo_data.py   # Run once to get a working demo tenant
└── frontend/
    ├── package.json
    └── src/
        ├── api/        # Axios client + typed API modules (assets, customers, workforce, billing, spares)
        ├── context/    # AuthContext (JWT-derived user state)
        ├── components/ # Layout with full sidebar navigation
        └── pages/      # All module pages (13+ views)
```

## API endpoints (all under `/api/`)

| Endpoint | Module |
|----------|--------|
| `/api/auth/login/`, `/api/auth/refresh/`, `/api/auth/me/` | Auth |
| `/api/assets/`, `/api/asset-photos/`, `/api/logbook-entries/` | Equipment |
| `/api/customers/`, `/api/market-data/` | Customers |
| `/api/operators/`, `/api/salary-records/`, `/api/attendance/` | Workforce |
| `/api/work-orders/`, `/api/purchase-orders/`, `/api/invoices/`, `/api/payment-receipts/` | Billing |
| `/api/spare-categories/`, `/api/spare-parts/`, `/api/stock-transactions/`, `/api/maintenance-schedules/` | Spares |

## Architecture decisions
- **Multi-tenancy**: every business table carries a `tenant` FK. Every
  ViewSet filters querysets by `request.user.tenant` AND checks object-level
  permission (`IsSameTenant`) -- two layers, so a bug in one doesn't leak data.
- **Roles**: `owner / admin / manager / operator / vendor` on the User model.
  `IsAdminOrOwner` permission guards sensitive endpoints (e.g. Market Data).
- **JWT carries tenant_name/role/full_name** so the frontend renders instantly
  without an extra `/me/` call on every page load.
- **UUID primary keys** on all business models for secure, non-guessable URLs.

## Next steps
1. **Quotations** -- PDF template engine (5-10 formats), tied to Asset + Customer
2. **Company logo / letterhead** -- Tenant upload UI + PDF injection
3. **Vendor email** -- SMTP/SES integration, logged against PO/vendor record
4. **OCR for payment receipts** -- Tesseract or cloud OCR (Google Vision/AWS Textract)
5. **Production hardening** -- Postgres, env-based secrets, CORS allowlist, rate limiting, S3 storage

## Tech stack
- **Backend**: Django 6.0, Django REST Framework, SimpleJWT, django-filter
- **Frontend**: React 19, Vite, TypeScript, TailwindCSS, Axios, React Router
- **Database**: SQLite (dev), planned Postgres (prod)
- **Auth**: JWT with tenant/role claims
