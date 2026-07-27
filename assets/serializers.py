from rest_framework import serializers
from .models import Asset, AssetPhoto


class AssetPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetPhoto
        fields = ["id", "image", "caption", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]


class AssetSerializer(serializers.ModelSerializer):
    photos = AssetPhotoSerializer(many=True, read_only=True)
    assigned_customer_name = serializers.CharField(source="assigned_customer.name", read_only=True)
    assigned_operator_name = serializers.CharField(source="assigned_operator.get_full_name", read_only=True)

    class Meta:
        model = Asset
        fields = [
            "id", "asset_code", "name", "category", "make", "model_number", "serial_number",
            "purchase_date", "purchase_cost", "warranty_expiry", "amc_expiry",
            "current_location", "assigned_customer", "assigned_customer_name",
            "assigned_operator", "assigned_operator_name", "status", "notes",
            "photos", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        # tenant is injected by the view from request.user, never trusted from client input
        validated_data["tenant"] = self.context["request"].user.tenant
        return super().create(validated_data)
