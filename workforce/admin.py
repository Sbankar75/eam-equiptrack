from django.contrib import admin
from .models import Operator, SalaryRecord, Attendance


@admin.register(Operator)
class OperatorAdmin(admin.ModelAdmin):
    list_display = ["name", "employee_id", "designation", "department", "status", "tenant"]
    list_filter = ["status", "department", "tenant"]
    search_fields = ["name", "phone", "email", "employee_id"]
    readonly_fields = ["id", "created_at", "updated_at"]


@admin.register(SalaryRecord)
class SalaryRecordAdmin(admin.ModelAdmin):
    list_display = ["operator", "month", "basic_salary", "net_payable", "status", "tenant"]
    list_filter = ["status", "month", "tenant"]
    search_fields = ["operator__name"]


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ["operator", "date", "status", "site_location", "tenant"]
    list_filter = ["status", "date", "tenant"]
    search_fields = ["operator__name", "site_location"]
