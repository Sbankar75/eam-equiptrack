from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import TenantTokenObtainPairView, MeView
from assets.views import AssetViewSet, AssetPhotoViewSet
from logbooks.views import LogbookEntryViewSet
from customers.views import CustomerViewSet, MarketDataViewSet
from workforce.views import OperatorViewSet, SalaryRecordViewSet, AttendanceViewSet
from billing.views import WorkOrderViewSet, PurchaseOrderViewSet, InvoiceViewSet, PaymentReceiptViewSet
from spares.views import SparePartCategoryViewSet, SparePartViewSet, StockTransactionViewSet, MaintenanceScheduleViewSet

router = DefaultRouter()
router.register(r"assets", AssetViewSet, basename="asset")
router.register(r"asset-photos", AssetPhotoViewSet, basename="asset-photo")
router.register(r"logbook-entries", LogbookEntryViewSet, basename="logbook-entry")
router.register(r"customers", CustomerViewSet, basename="customer")
router.register(r"market-data", MarketDataViewSet, basename="market-data")
router.register(r"operators", OperatorViewSet, basename="operator")
router.register(r"salary-records", SalaryRecordViewSet, basename="salary-record")
router.register(r"attendance", AttendanceViewSet, basename="attendance")
router.register(r"work-orders", WorkOrderViewSet, basename="work-order")
router.register(r"purchase-orders", PurchaseOrderViewSet, basename="purchase-order")
router.register(r"invoices", InvoiceViewSet, basename="invoice")
router.register(r"payment-receipts", PaymentReceiptViewSet, basename="payment-receipt")
router.register(r"spare-categories", SparePartCategoryViewSet, basename="spare-category")
router.register(r"spare-parts", SparePartViewSet, basename="spare-part")
router.register(r"stock-transactions", StockTransactionViewSet, basename="stock-transaction")
router.register(r"maintenance-schedules", MaintenanceScheduleViewSet, basename="maintenance-schedule")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", TenantTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", MeView.as_view(), name="me"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
