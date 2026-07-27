from django.contrib import admin
from .models import LogbookEntry

@admin.register(LogbookEntry)
class LogbookEntryAdmin(admin.ModelAdmin):
    list_display = ["asset", "entry_type", "entry_date", "hours_meter_reading", "cost", "recorded_by"]
    list_filter = ["entry_type", "tenant"]
