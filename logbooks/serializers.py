from rest_framework import serializers
from .models import LogbookEntry


class LogbookEntrySerializer(serializers.ModelSerializer):
    recorded_by_name = serializers.CharField(source="recorded_by.get_full_name", read_only=True)
    asset_code = serializers.CharField(source="asset.asset_code", read_only=True)

    class Meta:
        model = LogbookEntry
        fields = [
            "id", "asset", "asset_code", "entry_type", "entry_date",
            "hours_meter_reading", "odometer_reading", "description", "cost",
            "recorded_by", "recorded_by_name", "created_at",
        ]
        read_only_fields = ["id", "recorded_by", "created_at"]

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["tenant"] = request.user.tenant
        validated_data["recorded_by"] = request.user
        return super().create(validated_data)
