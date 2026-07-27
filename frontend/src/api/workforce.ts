import { api } from "./client";
import type { Operator, SalaryRecord, Attendance } from "./types";

export const OperatorsAPI = {
  list: (params?: Record<string, string>) =>
    api.get<Operator[]>("/operators/", { params }).then((r) => r.data),
  get: (id: string) => api.get<Operator>(`/operators/${id}/`).then((r) => r.data),
  create: (payload: Partial<Operator>) =>
    api.post<Operator>("/operators/", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Operator>) =>
    api.patch<Operator>(`/operators/${id}/`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/operators/${id}/`),
};

export const SalaryAPI = {
  list: (params?: Record<string, string>) =>
    api.get<SalaryRecord[]>("/salary-records/", { params }).then((r) => r.data),
  get: (id: string) => api.get<SalaryRecord>(`/salary-records/${id}/`).then((r) => r.data),
  create: (payload: Partial<SalaryRecord>) =>
    api.post<SalaryRecord>("/salary-records/", payload).then((r) => r.data),
  update: (id: string, payload: Partial<SalaryRecord>) =>
    api.patch<SalaryRecord>(`/salary-records/${id}/`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/salary-records/${id}/`),
};

export const AttendanceAPI = {
  list: (params?: Record<string, string>) =>
    api.get<Attendance[]>("/attendance/", { params }).then((r) => r.data),
  create: (payload: Partial<Attendance>) =>
    api.post<Attendance>("/attendance/", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Attendance>) =>
    api.patch<Attendance>(`/attendance/${id}/`, payload).then((r) => r.data),
  summary: (month?: string) =>
    api.get("/attendance/summary/", { params: { month } }).then((r) => r.data),
};
