from rest_framework import serializers
from .models import (
    WorkOrder, PurchaseOrder, PurchaseOrderItem,
    Invoice, InvoiceItem, PaymentReceipt,
)


class WorkOrderSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source="asset.name", read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    assigned_to_name = serializers.CharField(source="assigned_to.get_full_name", read_only=True)
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)

    class Meta:
        model = WorkOrder
        fields = [
            "id", "wo_number", "title", "description", "work_type",
            "asset", "asset_name", "customer", "customer_name",
            "priority", "status", "assigned_to", "assigned_to_name",
            "scheduled_date", "due_date", "completed_date",
            "estimated_cost", "actual_cost", "labor_hours",
            "notes", "created_by", "created_by_name", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["tenant"] = self.context["request"].user.tenant
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


class WorkOrderListSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source="asset.name", read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)

    class Meta:
        model = WorkOrder
        fields = [
            "id", "wo_number", "title", "work_type", "asset_name",
            "customer_name", "priority", "status", "scheduled_date",
            "due_date", "created_at",
        ]


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = ["id", "description", "part_number", "quantity", "unit", "unit_price", "tax_percent", "total"]
        read_only_fields = ["id"]


class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = [
            "id", "po_number", "vendor_name", "vendor_email", "vendor_phone", "vendor_address",
            "work_order", "status", "order_date", "expected_delivery", "delivery_date",
            "subtotal", "tax_amount", "discount", "total_amount",
            "terms_and_conditions", "notes", "items",
            "created_by", "created_by_name", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["tenant"] = self.context["request"].user.tenant
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


class PurchaseOrderListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = [
            "id", "po_number", "vendor_name", "status",
            "order_date", "total_amount", "created_at",
        ]


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ["id", "description", "hsn_sac_code", "quantity", "unit", "unit_price", "tax_percent", "amount"]
        read_only_fields = ["id"]


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id", "invoice_number", "customer", "customer_name", "work_order",
            "invoice_date", "due_date", "status",
            "subtotal", "cgst", "sgst", "igst", "total_tax", "discount",
            "grand_total", "amount_paid", "balance_due",
            "notes", "terms", "items",
            "created_by", "created_by_name", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["tenant"] = self.context["request"].user.tenant
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


class InvoiceListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.name", read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id", "invoice_number", "customer_name", "invoice_date",
            "due_date", "status", "grand_total", "balance_due",
        ]


class PaymentReceiptSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.name", read_only=True)

    class Meta:
        model = PaymentReceipt
        fields = [
            "id", "receipt_number", "invoice", "customer", "customer_name",
            "amount", "payment_date", "payment_mode", "reference_number",
            "receipt_image", "ocr_extracted_text", "ocr_processed",
            "notes", "recorded_by", "created_at",
        ]
        read_only_fields = ["id", "recorded_by", "ocr_extracted_text", "ocr_processed", "created_at"]

    def create(self, validated_data):
        validated_data["tenant"] = self.context["request"].user.tenant
        validated_data["recorded_by"] = self.context["request"].user
        return super().create(validated_data)
