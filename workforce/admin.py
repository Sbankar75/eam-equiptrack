from django.contrib import admin
from .models import Operator, SalaryRecord, Attendance

admin.site.register(Operator)
admin.site.register(SalaryRecord)
admin.site.register(Attendance)
