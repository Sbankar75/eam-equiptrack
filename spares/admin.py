from django.contrib import admin
from .models import SparePartCategory, SparePart, StockTransaction, MaintenanceSchedule

admin.site.register(SparePartCategory)
admin.site.register(SparePart)
admin.site.register(StockTransaction)
admin.site.register(MaintenanceSchedule)
