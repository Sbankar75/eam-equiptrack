import uuid
from django.db import models
from tenants.models import Tenant
from accounts.models import User


class TenantScopedModel(models.Model):
    """Base class -- every business table inherits this for automatic isolation."""
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Asset(TenantScopedModel):
    """Core equipment/asset record -- the spine of the whole EAM system."""
    STATUS_CHOICES = [
        ("active", "Active"),
        ("under_maintenance", "Under Maintenance"),
        ("idle", "Idle"),
        ("retired", "Retired"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    asset_code = models.CharField(max_length=50, help_text="Internal ID, also encoded in QR tag")
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, help_text="e.g. Excavator, Generator, Crane")
    make = models.CharField(max_length=100, blank=True)
    model_number = models.CharField(max_length=100, blank=True)
    serial_number = models.CharField(max_length=100, blank=True)

    purchase_date = models.DateField(null=True, blank=True)
    purchase_cost = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    warranty_expiry = models.DateField(null=True, blank=True)
    amc_expiry = models.DateField(null=True, blank=True, help_text="Annual Maintenance Contract expiry")

    current_location = models.CharField(max_length=255, blank=True)
    assigned_customer = models.ForeignKey(
        "customers.Customer", null=True, blank=True, on_delete=models.SET_NULL, related_name="assets"
    )
    assigned_operator = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_assets"
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("tenant", "asset_code")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.asset_code} - {self.name}"


class AssetPhoto(TenantScopedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="asset_photos/%Y/%m/")
    caption = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
