import uuid
from django.db import models


class Tenant(models.Model):
    """
    One row per client company you sell this platform to.
    Every business-data table across the app carries a tenant FK (directly
    or via the logged-in user) so one client can never see another's data.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company_name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, help_text="Used in URLs, e.g. app.yoursaas.com/t/<slug>")

    # Branding -- feeds letterheads, quotations, invoices
    logo = models.ImageField(upload_to="tenant_branding/logos/", blank=True, null=True)
    letterhead_primary_color = models.CharField(max_length=7, default="#1E293B")
    registered_address = models.TextField(blank=True)
    gstin = models.CharField(max_length=15, blank=True, help_text="Tax ID, e.g. GSTIN for India")
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)

    # Subscription (your own SaaS billing layer)
    PLAN_CHOICES = [
        ("trial", "Trial"),
        ("standard", "Standard"),
        ("premium", "Premium"),
    ]
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default="trial")
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name
