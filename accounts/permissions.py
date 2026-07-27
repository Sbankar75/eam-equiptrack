from rest_framework.permissions import BasePermission


class IsSameTenant(BasePermission):
    """
    Blanket object-level check: a user can only ever touch rows that
    belong to their own tenant. Combined with queryset filtering in each
    ViewSet's get_queryset(), this is the two-layer guard against
    cross-tenant data leaks (filter what you list AND check what you touch).
    """
    def has_object_permission(self, request, view, obj):
        return getattr(obj, "tenant_id", None) == request.user.tenant_id


class IsAdminOrOwner(BasePermission):
    """Gate for sensitive views: internal market data, payroll, etc."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ("owner", "admin")
