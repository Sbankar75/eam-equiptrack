"""
Run with: python manage.py shell < seed_demo_data.py
Creates one demo tenant, one admin user, one customer, two assets, and
a couple of logbook entries -- so you can log in and see real data
on your very first run instead of an empty dashboard.
"""
import django, os, datetime
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "eam_backend.settings")
django.setup()

from tenants.models import Tenant
from accounts.models import User
from customers.models import Customer
from assets.models import Asset
from logbooks.models import LogbookEntry

tenant, _ = Tenant.objects.get_or_create(
    slug="demo-co",
    defaults=dict(company_name="Demo Equipment Co.", contact_email="admin@democo.test"),
)

if not User.objects.filter(username="admin").exists():
    admin = User.objects.create_superuser(username="admin", email="admin@democo.test", password="admin12345")
    admin.tenant = tenant
    admin.role = "owner"
    admin.save()
    print("Created superuser: admin / admin12345")

customer, _ = Customer.objects.get_or_create(
    tenant=tenant, name="Acme Construction Pvt Ltd",
    defaults=dict(email="procurement@acme.test", phone="9876543210"),
)

a1, created1 = Asset.objects.get_or_create(
    tenant=tenant, asset_code="EXC-001",
    defaults=dict(
        name="Hydraulic Excavator", category="Excavator", make="CAT", model_number="320D",
        serial_number="CAT320D-88213", status="active", assigned_customer=customer,
        current_location="Site B, Pune", purchase_date=datetime.date(2022, 3, 10),
    ),
)
a2, created2 = Asset.objects.get_or_create(
    tenant=tenant, asset_code="GEN-014",
    defaults=dict(
        name="Diesel Generator 125kVA", category="Generator", make="Cummins", model_number="C125D5",
        serial_number="CUM125-55210", status="under_maintenance", assigned_customer=customer,
        current_location="Warehouse", purchase_date=datetime.date(2021, 11, 2),
    ),
)

if created1:
    LogbookEntry.objects.create(
        tenant=tenant, asset=a1, entry_type="usage", entry_date=datetime.date(2026, 7, 20),
        hours_meter_reading=1450.5, description="Routine site operation, 8hr shift",
    )
    LogbookEntry.objects.create(
        tenant=tenant, asset=a1, entry_type="service", entry_date=datetime.date(2026, 7, 22),
        description="500-hour scheduled service, oil + filter change", cost=8500,
    )

print("Seed complete. Tenant:", tenant.company_name)
