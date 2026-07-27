from rest_framework import serializers
from .models import Operator, SalaryRecord, Attendance


class OperatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operator
        fields = [
            "id", "user", "name", "phone", "email", "employee_id",
            "designation", "department", "skills", "license_number", "license_expiry",
            "status", "date_of_joining", "date_of_exit",
            "emergency_contact_name", "emergency_contact_phone",
            "photo", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["tenant"] = self.context["request"].user.tenant
        return super().create(validated_data)


class OperatorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operator
        fields = [
            "id", "name", "phone", "employee_id", "designation",
            "department", "status", "date_of_joining",
        ]


class SalaryRecordSerializer(serializers.ModelSerializer):
    operator_name = serializers.CharField(source="operator.name", read_only=True)

    class Meta:
        model = SalaryRecord
        fields = [
            "id", "operator", "operator_name", "month",
            "basic_salary", "overtime_amount", "deductions", "bonus", "net_payable",
            "payment_mode", "payment_date", "payment_reference", "status", "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        validated_data["tenant"] = self.context["request"].user.tenant
        return super().create(validated_data)


class AttendanceSerializer(serializers.ModelSerializer):
    operator_name = serializers.CharField(source="operator.name", read_only=True)

    class Meta:
        model = Attendance
        fields = [
            "id", "operator", "operator_name", "date", "status",
            "check_in", "check_out", "overtime_hours", "site_location",
            "notes", "marked_by", "created_at",
        ]
        read_only_fields = ["id", "created_at", "marked_by"]

    def create(self, validated_data):
        validated_data["tenant"] = self.context["request"].user.tenant
        validated_data["marked_by"] = self.context["request"].user
        return super().create(validated_data)
