from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Asset, AssetPhoto
from .serializers import AssetSerializer, AssetPhotoSerializer
from accounts.permissions import IsSameTenant


class AssetViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for assets, hard-scoped to the logged-in user's tenant.
    /api/assets/                 GET list, POST create
    /api/assets/<id>/            GET, PUT, PATCH, DELETE
    /api/assets/?status=active   filter
    /api/assets/?search=excav    search name/code/category
    """
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "category", "assigned_customer"]
    search_fields = ["asset_code", "name", "category", "make", "serial_number"]
    ordering_fields = ["created_at", "purchase_date", "name"]

    def get_queryset(self):
        return Asset.objects.filter(tenant=self.request.user.tenant)

    def get_serializer_context(self):
        return {"request": self.request}


class AssetPhotoViewSet(viewsets.ModelViewSet):
    serializer_class = AssetPhotoSerializer
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]

    def get_queryset(self):
        return AssetPhoto.objects.filter(tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)
