import { api } from "./client";
import type { SparePart, MaintenanceSchedule } from "./types";

export const SparePartsAPI = {
  list: (params?: Record<string, string>) =>
    api.get<SparePart[]>("/spare-parts/", { params }).then((r) => r.data),
  get: (id: string) => api.get<SparePart>(`/spare-parts/${id}/`).then((r) => r.data),
  create: (payload: Partial<SparePart>) =>
    api.post<SparePart>("/spare-parts/", payload).then((r) => r.data),
  update: (id: string, payload: Partial<SparePart>) =>
    api.patch<SparePart>(`/spare-parts/${id}/`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/spare-parts/${id}/`),
  lowStock: () => api.get<SparePart[]>("/spare-parts/low_stock/").then((r) => r.data),
  adjustStock: (id: string, data: { quantity: number; type: string; notes?: string }) =>
    api.post(`/spare-parts/${id}/adjust_stock/`, data).then((r) => r.data),
};

export const MaintenanceAPI = {
  list: (params?: Record<string, string>) =>
    api.get<MaintenanceSchedule[]>("/maintenance-schedules/", { params }).then((r) => r.data),
  get: (id: string) => api.get<MaintenanceSchedule>(`/maintenance-schedules/${id}/`).then((r) => r.data),
  create: (payload: Partial<MaintenanceSchedule>) =>
    api.post<MaintenanceSchedule>("/maintenance-schedules/", payload).then((r) => r.data),
  update: (id: string, payload: Partial<MaintenanceSchedule>) =>
    api.patch<MaintenanceSchedule>(`/maintenance-schedules/${id}/`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/maintenance-schedules/${id}/`),
  overdue: () => api.get<MaintenanceSchedule[]>("/maintenance-schedules/overdue/").then((r) => r.data),
  markCompleted: (id: string) =>
    api.post(`/maintenance-schedules/${id}/mark_completed/`).then((r) => r.data),
};
