from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class TenantTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Login serializer -- embeds tenant + role in the JWT so the frontend
    knows immediately what to show without an extra round trip."""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["tenant_id"] = str(user.tenant_id) if user.tenant_id else None
        token["tenant_name"] = user.tenant.company_name if user.tenant else None
        token["role"] = user.role
        token["full_name"] = user.get_full_name() or user.username
        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role", "phone"]
        read_only_fields = ["id"]
