import uuid
from django.db import models
from tenants.models import Tenant


class Customer(models.Model):
    """
    Full Customer model with contacts, address, categorization,
    and linkage to assets/work orders/quotations.
    """
    CUSTOMER_TYPE_CHOICES = [
        ("individual", "Individual"),
        ("company", "Company"),
        ("government", "Government"),
    ]
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("prospect", "Prospect"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="customers")

    name = models.CharField(max_length=255)
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPE_CHOICES, default="company")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")

    # Primary contact
    contact_person = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    secondary_email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    secondary_phone = models.CharField(max_length=20, blank=True)

    # Address
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    country = models.CharField(max_length=100, default="India", blank=True)

    # Tax / legal
    gstin = models.CharField(max_length=15, blank=True, help_text="GST Number")
    pan = models.CharField(max_length=10, blank=True)

    # Business
    credit_limit = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    payment_terms_days = models.PositiveIntegerField(default=30)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class CustomerContact(models.Model):
    """Additional contacts for a customer (multiple people at same company)."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="contacts")
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.customer.name})"

class MarketData(models.Model):
    """
    Admin-only internal market intelligence notes.
    Not to be disclosed to customers or operators.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="market_data")
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=100, blank=True, help_text="e.g. pricing, competitor, trend")
    shared_with_all_admins = models.BooleanField(default=True)
    created_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Market data"

    def __str__(self):
        return self.title
