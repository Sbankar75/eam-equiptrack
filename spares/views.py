from django.db import models
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import SparePartCategory, SparePart, StockTransaction, MaintenanceSchedule
from .serializers import (
    SparePartCategorySerializer,
    SparePartSerializer, SparePartListSerializer,
    StockTransactionSerializer,
    MaintenanceScheduleSerializer, MaintenanceScheduleListSerializer,
)
from accounts.permissions import IsSameTenant


class SparePartCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = SparePartCategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]

    def get_queryset(self):
        return SparePartCategory.objects.filter(tenant=self.request.user.tenant)

    def get_serializer_context(self):
        return {"request": self.request}


class SparePartViewSet(viewsets.ModelViewSet):
    """Inventory management for spare parts."""
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["category", "is_critical", "storeroom"]
    search_fields = ["part_number", "name", "vendor_name", "description"]
    ordering_fields = ["name", "quantity_in_stock", "created_at"]

    def get_queryset(self):
        return SparePart.objects.filter(tenant=self.request.user.tenant).select_related("category")

    def get_serializer_class(self):
        if self.action == "list":
            return SparePartListSerializer
        return SparePartSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    @action(detail=False, methods=["get"])
    def low_stock(self, request):
        """Get all parts below minimum stock level."""
        qs = self.get_queryset().filter(quantity_in_stock__lt=models.F("minimum_stock_level"))
        serializer = SparePartListSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def adjust_stock(self, request, pk=None):
        """Quick stock adjustment (in/out)."""
        part = self.get_object()
        qty = request.data.get("quantity", 0)
        txn_type = request.data.get("type", "adjustment")
        notes = request.data.get("notes", "")

        if txn_type in ("receipt", "return"):
            part.quantity_in_stock += abs(float(qty))
        elif txn_type in ("issue",):
            part.quantity_in_stock -= abs(float(qty))
        part.save()

        StockTransaction.objects.create(
            tenant=request.user.tenant,
            spare_part=part,
            transaction_type=txn_type,
            quantity=qty,
            notes=notes,
            performed_by=request.user,
        )
        return Response(SparePartSerializer(part, context={"request": request}).data)


class StockTransactionViewSet(viewsets.ModelViewSet):
    """View stock movement history."""
    serializer_class = StockTransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["spare_part", "transaction_type"]
    ordering_fields = ["transaction_date"]

    def get_queryset(self):
        return StockTransaction.objects.filter(
            tenant=self.request.user.tenant
        ).select_related("spare_part", "performed_by")

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        txn = serializer.save()
        # Auto-update stock level
        part = txn.spare_part
        if txn.transaction_type in ("receipt", "return"):
            part.quantity_in_stock += txn.quantity
        elif txn.transaction_type == "issue":
            part.quantity_in_stock -= txn.quantity
        part.save()


class MaintenanceScheduleViewSet(viewsets.ModelViewSet):
    """Preventive maintenance scheduling."""
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["asset", "status", "frequency"]
    search_fields = ["title", "description"]
    ordering_fields = ["next_due", "created_at"]

    def get_queryset(self):
        return MaintenanceSchedule.objects.filter(
            tenant=self.request.user.tenant
        ).select_related("asset", "assigned_to")

    def get_serializer_class(self):
        if self.action == "list":
            return MaintenanceScheduleListSerializer
        return MaintenanceScheduleSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    @action(detail=False, methods=["get"])
    def overdue(self, request):
        """Get all overdue maintenance schedules."""
        from django.utils import timezone
        qs = self.get_queryset().filter(
            next_due__lt=timezone.now().date(),
            status="active",
        )
        serializer = MaintenanceScheduleListSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def mark_completed(self, request, pk=None):
        """Mark a maintenance task as completed and calculate next due date."""
        from django.utils import timezone
        from datetime import timedelta

        schedule = self.get_object()
        schedule.last_performed = timezone.now().date()

        # Calculate next due based on frequency
        freq_map = {
            "daily": timedelta(days=1),
            "weekly": timedelta(weeks=1),
            "biweekly": timedelta(weeks=2),
            "monthly": timedelta(days=30),
            "quarterly": timedelta(days=90),
            "half_yearly": timedelta(days=180),
            "yearly": timedelta(days=365),
        }
        delta = freq_map.get(schedule.frequency)
        if delta:
            schedule.next_due = schedule.last_performed + delta
        schedule.save()
        return Response(MaintenanceScheduleSerializer(schedule, context={"request": request}).data)
