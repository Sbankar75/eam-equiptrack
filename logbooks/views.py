from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import LogbookEntry
from .serializers import LogbookEntrySerializer
from accounts.permissions import IsSameTenant


class LogbookEntryViewSet(viewsets.ModelViewSet):
    """
    /api/logbook-entries/?asset=<asset_id>   -- full history for one asset
    /api/logbook-entries/?entry_type=breakdown
    """
    serializer_class = LogbookEntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["asset", "entry_type"]
    ordering_fields = ["entry_date", "created_at"]

    def get_queryset(self):
        return LogbookEntry.objects.filter(tenant=self.request.user.tenant)

    def get_serializer_context(self):
        return {"request": self.request}
