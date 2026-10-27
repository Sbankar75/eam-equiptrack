from django.contrib import admin
from .models import SparePartCategory, SparePart, StockTransaction, MaintenanceSchedule


@admin.register(SparePartCategory)
class SparePartCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "tenant"]
    search_fields = ["name"]


@admin.register(SparePart)
class SparePartAdmin(admin.ModelAdmin):
    list_display = ["part_number", "name", "category", "quantity_in_stock", "minimum_stock_level", "unit_cost", "is_critical", "tenant"]
    list_filter = ["is_critical", "category", "tenant"]
    search_fields = ["part_number", "name", "vendor_name"]
    readonly_fields = ["id", "created_at", "updated_at"]


@admin.register(StockTransaction)
class StockTransactionAdmin(admin.ModelAdmin):
    list_display = ["spare_part", "transaction_type", "quantity", "transaction_date", "tenant"]
    list_filter = ["transaction_type", "tenant"]
    search_fields = ["spare_part__name", "spare_part__part_number"]


@admin.register(MaintenanceSchedule)
class MaintenanceScheduleAdmin(admin.ModelAdmin):
    list_display = ["title", "asset", "frequency", "status", "last_performed", "next_due", "tenant"]
    list_filter = ["status", "frequency", "tenant"]
    search_fields = ["title", "asset__name"]
