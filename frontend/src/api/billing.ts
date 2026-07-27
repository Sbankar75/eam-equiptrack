import { api } from "./client";
import type { WorkOrder, PurchaseOrder, Invoice, PaymentReceipt } from "./types";

export const WorkOrdersAPI = {
  list: (params?: Record<string, string>) =>
    api.get<WorkOrder[]>("/work-orders/", { params }).then((r) => r.data),
  get: (id: string) => api.get<WorkOrder>(`/work-orders/${id}/`).then((r) => r.data),
  create: (payload: Partial<WorkOrder>) =>
    api.post<WorkOrder>("/work-orders/", payload).then((r) => r.data),
  update: (id: string, payload: Partial<WorkOrder>) =>
    api.patch<WorkOrder>(`/work-orders/${id}/`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/work-orders/${id}/`),
  changeStatus: (id: string, status: string) =>
    api.post(`/work-orders/${id}/change_status/`, { status }).then((r) => r.data),
};

export const PurchaseOrdersAPI = {
  list: (params?: Record<string, string>) =>
    api.get<PurchaseOrder[]>("/purchase-orders/", { params }).then((r) => r.data),
  get: (id: string) => api.get<PurchaseOrder>(`/purchase-orders/${id}/`).then((r) => r.data),
  create: (payload: Partial<PurchaseOrder>) =>
    api.post<PurchaseOrder>("/purchase-orders/", payload).then((r) => r.data),
  update: (id: string, payload: Partial<PurchaseOrder>) =>
    api.patch<PurchaseOrder>(`/purchase-orders/${id}/`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/purchase-orders/${id}/`),
  addItem: (id: string, item: any) =>
    api.post(`/purchase-orders/${id}/add_item/`, item).then((r) => r.data),
  sendToVendor: (id: string) =>
    api.post(`/purchase-orders/${id}/send_to_vendor/`).then((r) => r.data),
};

export const InvoicesAPI = {
  list: (params?: Record<string, string>) =>
    api.get<Invoice[]>("/invoices/", { params }).then((r) => r.data),
  get: (id: string) => api.get<Invoice>(`/invoices/${id}/`).then((r) => r.data),
  create: (payload: Partial<Invoice>) =>
    api.post<Invoice>("/invoices/", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Invoice>) =>
    api.patch<Invoice>(`/invoices/${id}/`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/invoices/${id}/`),
  addItem: (id: string, item: any) =>
    api.post(`/invoices/${id}/add_item/`, item).then((r) => r.data),
};

export const PaymentReceiptsAPI = {
  list: (params?: Record<string, string>) =>
    api.get<PaymentReceipt[]>("/payment-receipts/", { params }).then((r) => r.data),
  get: (id: string) => api.get<PaymentReceipt>(`/payment-receipts/${id}/`).then((r) => r.data),
  create: (payload: FormData | Partial<PaymentReceipt>) =>
    api.post<PaymentReceipt>("/payment-receipts/", payload).then((r) => r.data),
  processOcr: (id: string) =>
    api.post(`/payment-receipts/${id}/process_ocr/`).then((r) => r.data),
};
