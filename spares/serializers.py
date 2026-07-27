from rest_framework import serializers
from .models import SparePartCategory, SparePart, StockTransaction, MaintenanceSchedule


class SparePartCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SparePartCategory
        fields = ["id", "name", "description"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        validated_data["tenant"] = self.context["request"].user.tenant
        return super().create(validated_data)


class SparePartSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    is_below_minimum = serializers.BooleanField(read_only=True)

    class Meta:
        model = SparePart
        fields = [
            "id", "part_number", "name", "category", "category_name", "description",
            "quantity_in_stock", "unit", "minimum_stock_level", "maximum_stock_level", "reorder_quantity",
            "unit_cost", "selling_price", "warehouse_location", "storeroom",
            "compatible_assets", "vendor_name", "vendor_part_number",
            "is_critical", "is_below_minimum", "photo",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        compatible_assets = validated_data.pop("compatible_assets", [])
        validated_data["tenant"] = self.context["request"].user.tenant
        spare = super().create(validated_data)
        if compatible_assets:
            spare.compatible_assets.set(compatible_assets)
        return spare


class SparePartListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    is_below_minimum = serializers.BooleanField(read_only=True)

    class Meta:
        model = SparePart
        fields = [
            "id", "part_number", "name", "category_name",
            "quantity_in_stock", "unit", "minimum_stock_level",
            "unit_cost", "is_critical", "is_below_minimum", "storeroom",
        ]


class StockTransactionSerializer(serializers.ModelSerializer):
    spare_part_name = serializers.CharField(source="spare_part.name", read_only=True)
    performed_by_name = serializers.CharField(source="performed_by.get_full_name", read_only=True)

    class Meta:
        model = StockTransaction
        fields = [
            "id", "spare_part", "spare_part_name", "transaction_type",
            "quantity", "unit_cost", "reference", "notes",
            "work_order", "issued_to", "performed_by", "performed_by_name",
            "transaction_date",
        ]
        read_only_fields = ["id", "performed_by", "transaction_date"]

    def create(self, validated_data):
        validated_data["tenant"] = self.context["request"].user.tenant
        validated_data["performed_by"] = self.context["request"].user
        return super().create(validated_data)


class MaintenanceScheduleSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source="asset.name", read_only=True)
    assigned_to_name = serializers.CharField(source="assigned_to.get_full_name", read_only=True)

    class Meta:
        model = MaintenanceSchedule
        fields = [
            "id", "asset", "asset_name", "title", "description",
            "frequency", "trigger_hours", "last_performed", "next_due", "status",
            "checklist", "estimated_duration_hours",
            "assigned_to", "assigned_to_name", "required_spares",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        required_spares = validated_data.pop("required_spares", [])
        validated_data["tenant"] = self.context["request"].user.tenant
        schedule = super().create(validated_data)
        if required_spares:
            schedule.required_spares.set(required_spares)
        return schedule


class MaintenanceScheduleListSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source="asset.name", read_only=True)

    class Meta:
        model = MaintenanceSchedule
        fields = [
            "id", "asset_name", "title", "frequency",
            "last_performed", "next_due", "status",
        ]
