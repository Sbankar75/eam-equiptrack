from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, F

from assets.models import Asset
from customers.models import Customer
from billing.models import WorkOrder, Invoice
from spares.models import SparePart
from workforce.models import Operator


class DashboardStatsView(APIView):
    """Quick stats for the dashboard home page."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tenant = request.user.tenant
        assets = Asset.objects.filter(tenant=tenant)
        customers = Customer.objects.filter(tenant=tenant)
        work_orders = WorkOrder.objects.filter(tenant=tenant)
        invoices = Invoice.objects.filter(tenant=tenant)
        spares = SparePart.objects.filter(tenant=tenant)

        low_stock = spares.filter(quantity_in_stock__lt=F("minimum_stock_level")).count()

        return Response({
            "total_assets": assets.count(),
            "active_assets": assets.filter(status="active").count(),
            "maintenance_assets": assets.filter(status="under_maintenance").count(),
            "total_customers": customers.count(),
            "total_operators": Operator.objects.filter(tenant=tenant).count(),
            "open_work_orders": work_orders.filter(status__in=["open", "in_progress"]).count(),
            "pending_invoices": invoices.filter(status__in=["sent", "partial", "overdue"]).count(),
            "low_stock_items": low_stock,
        })


class DashboardReportsView(APIView):
    """Comprehensive report data for the Reports page."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tenant = request.user.tenant
        assets = Asset.objects.filter(tenant=tenant)
        customers = Customer.objects.filter(tenant=tenant)
        work_orders = WorkOrder.objects.filter(tenant=tenant)
        spares = SparePart.objects.filter(tenant=tenant)

        total_inventory_value = spares.aggregate(
            total=Sum(F("quantity_in_stock") * F("unit_cost"))
        )["total"] or 0

        return Response({
            "assets": {
                "total": assets.count(),
                "active": assets.filter(status="active").count(),
                "maintenance": assets.filter(status="under_maintenance").count(),
                "idle": assets.filter(status="idle").count(),
                "retired": assets.filter(status="retired").count(),
            },
            "customers": {
                "total": customers.count(),
                "active": customers.filter(status="active").count(),
                "inactive": customers.filter(status="inactive").count(),
                "prospects": customers.filter(status="prospect").count(),
            },
            "work_orders": {
                "total": work_orders.count(),
                "open": work_orders.filter(status="open").count(),
                "in_progress": work_orders.filter(status="in_progress").count(),
                "completed": work_orders.filter(status="completed").count(),
            },
            "inventory": {
                "total_parts": spares.count(),
                "low_stock": spares.filter(quantity_in_stock__lt=F("minimum_stock_level")).count(),
                "total_value": int(total_inventory_value),
            },
        })
