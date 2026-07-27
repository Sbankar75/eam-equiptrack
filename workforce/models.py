import uuid
from django.db import models
from tenants.models import Tenant
from accounts.models import User


class Operator(models.Model):
    """
    Extended operator profile -- links to the base User model but adds
    field-specific data: skills, certifications, license details.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="operators")
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="operator_profile", null=True, blank=True)

    # If not linked to a User (e.g. contract labor)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)

    # Professional
    employee_id = models.CharField(max_length=50, blank=True)
    designation = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100, blank=True)
    skills = models.TextField(blank=True, help_text="Comma-separated skills/certifications")
    license_number = models.CharField(max_length=100, blank=True)
    license_expiry = models.DateField(null=True, blank=True)

    # Employment
    STATUS_CHOICES = [
        ("active", "Active"),
        ("on_leave", "On Leave"),
        ("terminated", "Terminated"),
        ("contract", "Contract"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    date_of_joining = models.DateField(null=True, blank=True)
    date_of_exit = models.DateField(null=True, blank=True)

    # Emergency contact
    emergency_contact_name = models.CharField(max_length=255, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)

    photo = models.ImageField(upload_to="operator_photos/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.employee_id or 'no-id'})"


class SalaryRecord(models.Model):
    """Monthly salary/payment records for operators."""
    PAYMENT_MODE_CHOICES = [
        ("bank_transfer", "Bank Transfer"),
        ("cash", "Cash"),
        ("cheque", "Cheque"),
        ("upi", "UPI"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("partial", "Partially Paid"),
        ("hold", "On Hold"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="salary_records")
    operator = models.ForeignKey(Operator, on_delete=models.CASCADE, related_name="salary_records")

    month = models.DateField(help_text="First day of the salary month, e.g. 2025-07-01")
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2)
    overtime_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_payable = models.DecimalField(max_digits=12, decimal_places=2)

    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES, default="bank_transfer")
    payment_date = models.DateField(null=True, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True, help_text="Transaction ID / Cheque no.")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-month"]
        unique_together = ("operator", "month")

    def __str__(self):
        return f"{self.operator.name} - {self.month.strftime('%B %Y')}"


class Attendance(models.Model):
    """Daily attendance tracking for operators."""
    STATUS_CHOICES = [
        ("present", "Present"),
        ("absent", "Absent"),
        ("half_day", "Half Day"),
        ("leave", "On Leave"),
        ("holiday", "Holiday"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="attendance_records")
    operator = models.ForeignKey(Operator, on_delete=models.CASCADE, related_name="attendance_records")
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="present")
    check_in = models.TimeField(null=True, blank=True)
    check_out = models.TimeField(null=True, blank=True)
    overtime_hours = models.DecimalField(max_digits=4, decimal_places=1, default=0)
    site_location = models.CharField(max_length=255, blank=True, help_text="Where they worked that day")
    notes = models.TextField(blank=True)
    marked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        unique_together = ("operator", "date")

    def __str__(self):
        return f"{self.operator.name} - {self.date} - {self.status}"
