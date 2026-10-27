from django.contrib import admin
from .models import WorkOrder, PurchaseOrder, PurchaseOrderItem, Invoice, InvoiceItem, PaymentReceipt


class PurchaseOrderItemInline(admin.TabularInline):
    model = PurchaseOrderItem
    extra = 0


class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 0


@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ["wo_number", "title", "work_type", "priority", "status", "asset", "customer", "tenant"]
    list_filter = ["status", "priority", "work_type", "tenant"]
    search_fields = ["wo_number", "title", "description"]
    readonly_fields = ["id", "created_at", "updated_at"]
    date_hierarchy = "created_at"


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ["po_number", "vendor_name", "order_date", "total_amount", "status", "tenant"]
    list_filter = ["status", "tenant"]
    search_fields = ["po_number", "vendor_name"]
    inlines = [PurchaseOrderItemInline]


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ["invoice_number", "customer", "invoice_date", "grand_total", "balance_due", "status", "tenant"]
    list_filter = ["status", "tenant"]
    search_fields = ["invoice_number", "customer__name"]
    inlines = [InvoiceItemInline]
    date_hierarchy = "invoice_date"


@admin.register(PaymentReceipt)
class PaymentReceiptAdmin(admin.ModelAdmin):
    list_display = ["receipt_number", "customer", "amount", "payment_date", "payment_mode", "tenant"]
    list_filter = ["payment_mode", "tenant"]
    search_fields = ["receipt_number", "customer__name", "reference_number"]
