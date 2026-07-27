from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import (
    WorkOrder, PurchaseOrder, PurchaseOrderItem,
    Invoice, InvoiceItem, PaymentReceipt,
)
from .serializers import (
    WorkOrderSerializer, WorkOrderListSerializer,
    PurchaseOrderSerializer, PurchaseOrderListSerializer, PurchaseOrderItemSerializer,
    InvoiceSerializer, InvoiceListSerializer, InvoiceItemSerializer,
    PaymentReceiptSerializer,
)
from accounts.permissions import IsSameTenant


class WorkOrderViewSet(viewsets.ModelViewSet):
    """Full lifecycle management for work orders."""
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "priority", "work_type", "asset", "customer", "assigned_to"]
    search_fields = ["wo_number", "title", "description"]
    ordering_fields = ["created_at", "due_date", "priority"]

    def get_queryset(self):
        return WorkOrder.objects.filter(
            tenant=self.request.user.tenant
        ).select_related("asset", "customer", "assigned_to", "created_by")

    def get_serializer_class(self):
        if self.action == "list":
            return WorkOrderListSerializer
        return WorkOrderSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    @action(detail=True, methods=["post"])
    def change_status(self, request, pk=None):
        wo = self.get_object()
        new_status = request.data.get("status")
        if new_status not in dict(WorkOrder.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        wo.status = new_status
        if new_status == "completed":
            from django.utils import timezone
            wo.completed_date = timezone.now().date()
        wo.save()
        return Response(WorkOrderSerializer(wo, context={"request": request}).data)


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    """Purchase order management with line items."""
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "vendor_name"]
    search_fields = ["po_number", "vendor_name"]
    ordering_fields = ["created_at", "order_date", "total_amount"]

    def get_queryset(self):
        return PurchaseOrder.objects.filter(
            tenant=self.request.user.tenant
        ).prefetch_related("items").select_related("created_by")

    def get_serializer_class(self):
        if self.action == "list":
            return PurchaseOrderListSerializer
        return PurchaseOrderSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    @action(detail=True, methods=["post"])
    def add_item(self, request, pk=None):
        po = self.get_object()
        serializer = PurchaseOrderItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(purchase_order=po)
        # Recalculate totals
        items = po.items.all()
        po.subtotal = sum(item.total for item in items)
        po.tax_amount = sum(item.total * item.tax_percent / 100 for item in items)
        po.total_amount = po.subtotal + po.tax_amount - po.discount
        po.save()
        return Response(PurchaseOrderSerializer(po, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def send_to_vendor(self, request, pk=None):
        """Mark PO as sent and optionally email the vendor."""
        po = self.get_object()
        po.status = "sent"
        po.save()
        # TODO: Integrate email sending via SMTP/SES
        return Response({"status": "sent", "message": "PO marked as sent to vendor."})


class InvoiceViewSet(viewsets.ModelViewSet):
    """Invoice/bill management."""
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "customer"]
    search_fields = ["invoice_number", "customer__name"]
    ordering_fields = ["invoice_date", "due_date", "grand_total"]

    def get_queryset(self):
        return Invoice.objects.filter(
            tenant=self.request.user.tenant
        ).prefetch_related("items").select_related("customer", "created_by")

    def get_serializer_class(self):
        if self.action == "list":
            return InvoiceListSerializer
        return InvoiceSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    @action(detail=True, methods=["post"])
    def add_item(self, request, pk=None):
        invoice = self.get_object()
        serializer = InvoiceItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(invoice=invoice)
        # Recalculate totals
        items = invoice.items.all()
        invoice.subtotal = sum(item.amount for item in items)
        invoice.total_tax = sum(item.amount * item.tax_percent / 100 for item in items)
        invoice.grand_total = invoice.subtotal + invoice.total_tax - invoice.discount
        invoice.balance_due = invoice.grand_total - invoice.amount_paid
        invoice.save()
        return Response(InvoiceSerializer(invoice, context={"request": request}).data)


class PaymentReceiptViewSet(viewsets.ModelViewSet):
    """Payment receipt tracking with OCR support."""
    serializer_class = PaymentReceiptSerializer
    permission_classes = [permissions.IsAuthenticated, IsSameTenant]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["customer", "payment_mode", "invoice"]
    ordering_fields = ["payment_date", "amount"]

    def get_queryset(self):
        return PaymentReceipt.objects.filter(
            tenant=self.request.user.tenant
        ).select_related("customer", "invoice")

    def get_serializer_context(self):
        return {"request": self.request}

    @action(detail=True, methods=["post"])
    def process_ocr(self, request, pk=None):
        """Trigger OCR on uploaded receipt image."""
        receipt = self.get_object()
        if not receipt.receipt_image:
            return Response({"error": "No image uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        # TODO: Integrate Tesseract or cloud OCR (Google Vision / AWS Textract)
        # For now, mark as processed with placeholder
        receipt.ocr_processed = True
        receipt.ocr_extracted_text = "[OCR processing will be integrated - upload successful]"
        receipt.save()
        return Response(PaymentReceiptSerializer(receipt, context={"request": request}).data)
