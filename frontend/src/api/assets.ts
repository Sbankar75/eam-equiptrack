import { api } from "./client";
import type { Asset, LogbookEntry } from "./types";

export const AssetsAPI = {
  list: (params?: { search?: string; status?: string }) =>
    api.get<Asset[]>("/assets/", { params }).then((r) => r.data),
  get: (id: string) => api.get<Asset>(`/assets/${id}/`).then((r) => r.data),
  create: (payload: Partial<Asset>) => api.post<Asset>("/assets/", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Asset>) => api.patch<Asset>(`/assets/${id}/`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/assets/${id}/`),
};

export const LogbookAPI = {
  listForAsset: (assetId: string) =>
    api.get<LogbookEntry[]>("/logbook-entries/", { params: { asset: assetId } }).then((r) => r.data),
  create: (payload: Partial<LogbookEntry>) =>
    api.post<LogbookEntry>("/logbook-entries/", payload).then((r) => r.data),
};
