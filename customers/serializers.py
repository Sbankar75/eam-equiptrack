from rest_framework import serializers
from .models import Customer, CustomerContact, MarketData


class CustomerContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerContact
        fields = ["id", "name", "designation", "email", "phone", "is_primary"]
        read_only_fields = ["id"]


class CustomerSerializer(serializers.ModelSerializer):
    contacts = CustomerContactSerializer(many=True, read_only=True)
    asset_count = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = [
            "id", "name", "customer_type", "status", "contact_person",
            "email", "secondary_email", "phone", "secondary_phone",
            "address_line1", "address_line2", "city", "state", "pincode", "country",
            "gstin", "pan", "credit_limit", "payment_terms_days", "notes",
            "contacts", "asset_count", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_asset_count(self, obj):
        return obj.assets.count()

    def create(self, validated_data):
        validated_data["tenant"] = self.context["request"].user.tenant
        return super().create(validated_data)


class CustomerListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    asset_count = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = [
            "id", "name", "customer_type", "status", "contact_person",
            "email", "phone", "city", "state", "asset_count", "created_at",
        ]

    def get_asset_count(self, obj):
        return obj.assets.count()


class MarketDataSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)

    class Meta:
        model = MarketData
        fields = [
            "id", "title", "content", "category", "shared_with_all_admins",
            "created_by", "created_by_name", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["tenant"] = self.context["request"].user.tenant
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)
