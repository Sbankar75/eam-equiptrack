import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from tenants.models import Tenant


class User(AbstractUser):
    """
    Custom user so every login is scoped to a tenant with a role.
    Role drives what a person can see -- e.g. only 'admin' sees the
    internal "market data" notes, only 'admin'/'manager' see payroll.
    """
    ROLE_CHOICES = [
        ("owner", "Owner / Super Admin"),       # you or the client's top admin
        ("admin", "Admin"),                      # full access within tenant
        ("manager", "Manager"),                  # ops, billing, no payroll by default
        ("operator", "Operator / Field Staff"),  # logbooks, own attendance only
        ("vendor", "Vendor (external, limited)"),# restricted portal access
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="users", null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="operator")
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role} @ {self.tenant})"
