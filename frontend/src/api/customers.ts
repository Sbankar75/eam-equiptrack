import { api } from "./client";
import type { Customer, MarketData } from "./types";

export const CustomersAPI = {
  list: (params?: Record<string, string>) =>
    api.get<Customer[]>("/customers/", { params }).then((r) => r.data),
  get: (id: string) => api.get<Customer>(`/customers/${id}/`).then((r) => r.data),
  create: (payload: Partial<Customer>) =>
    api.post<Customer>("/customers/", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Customer>) =>
    api.patch<Customer>(`/customers/${id}/`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/customers/${id}/`),
  report: () => api.get("/customers/report/").then((r) => r.data),
  addContact: (customerId: string, payload: any) =>
    api.post(`/customers/${customerId}/add_contact/`, payload).then((r) => r.data),
};

export const MarketDataAPI = {
  list: (params?: Record<string, string>) =>
    api.get<MarketData[]>("/market-data/", { params }).then((r) => r.data),
  get: (id: string) => api.get<MarketData>(`/market-data/${id}/`).then((r) => r.data),
  create: (payload: Partial<MarketData>) =>
    api.post<MarketData>("/market-data/", payload).then((r) => r.data),
  update: (id: string, payload: Partial<MarketData>) =>
    api.patch<MarketData>(`/market-data/${id}/`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/market-data/${id}/`),
};
