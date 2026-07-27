import uuid
from django.db import models
from tenants.models import Tenant
from accounts.models import User
from assets.models import Asset


class SparePartCategory(models.Model):
    """Categories for organizing spare parts inventory."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="spare_categories")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Spare part categories"

    def __str__(self):
        return self.name


class SparePart(models.Model):
    """Inventory items -- spare parts, consumables, tools."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="spare_parts")

    part_number = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    category = models.ForeignKey(SparePartCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="parts")
    description = models.TextField(blank=True)

    # Stock
    quantity_in_stock = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(max_length=20, default="nos", help_text="e.g. nos, kg, ltrs, meters")
    minimum_stock_level = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Alert when below this")
    maximum_stock_level = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    reorder_quantity = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Pricing
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    selling_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    # Location
    warehouse_location = models.CharField(max_length=100, blank=True, help_text="Rack/Bin/Shelf")
    storeroom = models.CharField(max_length=100, blank=True)

    # Linkage
    compatible_assets = models.ManyToManyField(Asset, blank=True, related_name="compatible_spares")
    vendor_name = models.CharField(max_length=255, blank=True)
    vendor_part_number = models.CharField(max_length=100, blank=True)

    is_critical = models.BooleanField(default=False, help_text="Critical spare -- needs immediate reorder")
    photo = models.ImageField(upload_to="spare_photos/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        unique_together = ("tenant", "part_number")

    def __str__(self):
        return f"{self.part_number} - {self.name}"

    @property
    def is_below_minimum(self):
        return self.quantity_in_stock < self.minimum_stock_level


class StockTransaction(models.Model):
    """Track all stock movements (in/out)."""
    TRANSACTION_TYPE_CHOICES = [
        ("receipt", "Stock Receipt (In)"),
        ("issue", "Stock Issue (Out)"),
        ("return", "Stock Return"),
        ("adjustment", "Adjustment"),
        ("transfer", "Transfer Between Stores"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="stock_transactions")
    spare_part = models.ForeignKey(SparePart, on_delete=models.CASCADE, related_name="transactions")

    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    reference = models.CharField(max_length=100, blank=True, help_text="PO number, WO number, etc.")
    notes = models.TextField(blank=True)

    # Linkage
    work_order = models.ForeignKey("billing.WorkOrder", on_delete=models.SET_NULL, null=True, blank=True)
    issued_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="stock_issues")

    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="stock_transactions")
    transaction_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-transaction_date"]

    def __str__(self):
        return f"{self.transaction_type} - {self.spare_part.name} x {self.quantity}"


class MaintenanceSchedule(models.Model):
    """Preventive maintenance schedules tied to assets."""
    FREQUENCY_CHOICES = [
        ("daily", "Daily"),
        ("weekly", "Weekly"),
        ("biweekly", "Bi-Weekly"),
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
        ("half_yearly", "Half Yearly"),
        ("yearly", "Yearly"),
        ("hours_based", "Hours Based"),
    ]
    STATUS_CHOICES = [
        ("active", "Active"),
        ("paused", "Paused"),
        ("completed", "Completed"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="maintenance_schedules")
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="maintenance_schedules")

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    trigger_hours = models.DecimalField(max_digits=10, decimal_places=1, null=True, blank=True, help_text="For hours-based triggers")

    last_performed = models.DateField(null=True, blank=True)
    next_due = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")

    # Checklist / procedure
    checklist = models.TextField(blank=True, help_text="JSON or newline-separated checklist items")
    estimated_duration_hours = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    # Parts needed
    required_spares = models.ManyToManyField(SparePart, blank=True, related_name="maintenance_schedules")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["next_due"]

    def __str__(self):
        return f"{self.title} - {self.asset.name} ({self.frequency})"
