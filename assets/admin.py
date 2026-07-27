from django.contrib import admin
from .models import Asset, AssetPhoto

class AssetPhotoInline(admin.TabularInline):
    model = AssetPhoto
    extra = 1

@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ["asset_code", "name", "tenant", "category", "status", "assigned_customer"]
    list_filter = ["status", "category", "tenant"]
    search_fields = ["asset_code", "name", "serial_number"]
    inlines = [AssetPhotoInline]
