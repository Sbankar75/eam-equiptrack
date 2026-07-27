import uuid
from django.db import models
from tenants.models import Tenant
from accounts.models import User
from assets.models import Asset


class LogbookEntry(models.Model):
    """
    One entry per usage/service/breakdown event for an asset.
    This is the operational history that quotations, maintenance
    planning, and billing all draw from.
    """
    ENTRY_TYPE_CHOICES = [
        ("usage", "Usage / Hours Run"),
        ("service", "Scheduled Service"),
        ("breakdown", "Breakdown"),
        ("repair", "Repair"),
        ("fuel", "Fuel / Consumable"),
        ("inspection", "Inspection"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="logbook_entries")
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="logbook_entries")
    entry_type = models.CharField(max_length=20, choices=ENTRY_TYPE_CHOICES)

    entry_date = models.DateField()
    hours_meter_reading = models.DecimalField(max_digits=10, decimal_places=1, null=True, blank=True)
    odometer_reading = models.DecimalField(max_digits=10, decimal_places=1, null=True, blank=True)

    description = models.TextField(blank=True)
    cost = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="logbook_entries")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-entry_date", "-created_at"]

    def __str__(self):
        return f"{self.asset.asset_code} - {self.entry_type} - {self.entry_date}"
