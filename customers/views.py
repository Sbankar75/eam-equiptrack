from django.db import models
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Customer, CustomerContact, MarketData
from .serializers import (
    CustomerSerializer, CustomerListSerializer,
    CustomerContactSerializer, MarketDataSerializer,
)
from accounts.permissions import IsSameTenant, IsAdminOrOwner


class CustomerViewSet(viewsets.ModelViewSet):
    """Full CRUD for customers, tenant-scoped."""
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "customer_type", "city", "state"]
    search_fields = ["name", "contact_person", "email", "phone", "gstin"]
    ordering_fields = ["created_at", "name", "city"]

    def get_queryset(self):
        return Customer.objects.filter(tenant=self.request.user.tenant).prefetch_related("contacts", "assets")

    def get_serializer_class(self):
        if self.action == "list":
            return CustomerListSerializer
        return CustomerSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    @action(detail=True, methods=["post"])
    def add_contact(self, request, pk=None):
        customer = self.get_object()
        serializer = CustomerContactSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(customer=customer)
        return Response(serializer.data, status=201)

    @action(detail=False, methods=["get"])
    def report(self, request):
        """Summary report of all customers."""
        qs = self.get_queryset()
        total = qs.count()
        active = qs.filter(status="active").count()
        inactive = qs.filter(status="inactive").count()
        prospects = qs.filter(status="prospect").count()
        by_type = {
            "individual": qs.filter(customer_type="individual").count(),
            "company": qs.filter(customer_type="company").count(),
            "government": qs.filter(customer_type="government").count(),
        }
        by_city = list(
            qs.values("city").annotate(count=models.Count("id")).order_by("-count")[:10]
        )
        return Response({
            "total": total,
            "active": active,
            "inactive": inactive,
            "prospects": prospects,
            "by_type": by_type,
            "by_city": by_city,
        })


class MarketDataViewSet(viewsets.ModelViewSet):
    """Admin-only internal market intelligence."""
    serializer_class = MarketDataSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]
    filter_backends = [SearchFilter]
    search_fields = ["title", "content", "category"]

    def get_queryset(self):
        return MarketData.objects.filter(tenant=self.request.user.tenant)

    def get_serializer_context(self):
        return {"request": self.request}
