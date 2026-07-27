from django.contrib import admin
from .models import Customer, CustomerContact, MarketData

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ["name", "tenant", "customer_type", "status", "email", "phone", "city", "created_at"]
    list_filter = ["status", "customer_type", "city"]
    search_fields = ["name", "email", "phone", "gstin"]

@admin.register(CustomerContact)
class CustomerContactAdmin(admin.ModelAdmin):
    list_display = ["name", "customer", "designation", "email", "phone"]

@admin.register(MarketData)
class MarketDataAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "tenant", "created_by", "created_at"]
