from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Operator, SalaryRecord, Attendance
from .serializers import (
    OperatorSerializer, OperatorListSerializer,
    SalaryRecordSerializer, AttendanceSerializer,
)
from accounts.permissions import IsSameTenant, IsAdminOrOwner


class OperatorViewSet(viewsets.ModelViewSet):
    """CRUD for operator profiles."""
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "department", "designation"]
    search_fields = ["name", "employee_id", "phone", "skills"]
    ordering_fields = ["name", "date_of_joining", "created_at"]

    def get_queryset(self):
        return Operator.objects.filter(tenant=self.request.user.tenant)

    def get_serializer_class(self):
        if self.action == "list":
            return OperatorListSerializer
        return OperatorSerializer

    def get_serializer_context(self):
        return {"request": self.request}


class SalaryRecordViewSet(viewsets.ModelViewSet):
    """Payroll management -- restricted to admin/owner."""
    serializer_class = SalaryRecordSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["operator", "status", "month"]
    ordering_fields = ["month", "net_payable"]

    def get_queryset(self):
        return SalaryRecord.objects.filter(tenant=self.request.user.tenant).select_related("operator")

    def get_serializer_context(self):
        return {"request": self.request}


class AttendanceViewSet(viewsets.ModelViewSet):
    """Daily attendance records."""
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["operator", "status", "date"]
    ordering_fields = ["date"]

    def get_queryset(self):
        return Attendance.objects.filter(tenant=self.request.user.tenant).select_related("operator")

    def get_serializer_context(self):
        return {"request": self.request}

    @action(detail=False, methods=["get"])
    def summary(self, request):
        """Monthly attendance summary for all operators."""
        from django.db.models import Count, Q
        month = request.query_params.get("month")  # YYYY-MM-DD format
        qs = self.get_queryset()
        if month:
            qs = qs.filter(date__month=int(month.split("-")[1]), date__year=int(month.split("-")[0]))
        summary = qs.values("operator__name", "operator__id").annotate(
            present=Count("id", filter=Q(status="present")),
            absent=Count("id", filter=Q(status="absent")),
            half_day=Count("id", filter=Q(status="half_day")),
            leave=Count("id", filter=Q(status="leave")),
        )
        return Response(list(summary))
