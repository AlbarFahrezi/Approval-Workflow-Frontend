import api from "@/lib/axios";

export interface DashboardSummary {
  total_requests: number;
  draft_requests: number;
  submitted_requests: number;
  approved_requests: number;
  rejected_requests: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get("/dashboard");

  return response.data.data;
}