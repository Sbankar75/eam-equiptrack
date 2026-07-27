from django.contrib import admin
from .models import WorkOrder, PurchaseOrder, PurchaseOrderItem, Invoice, InvoiceItem, PaymentReceipt

admin.site.register(WorkOrder)
admin.site.register(PurchaseOrder)
admin.site.register(PurchaseOrderItem)
admin.site.register(Invoice)
admin.site.register(InvoiceItem)
admin.site.register(PaymentReceipt)
