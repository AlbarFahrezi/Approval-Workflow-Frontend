import api from "@/lib/axios";
import type { ApprovalRequest } from "@/types/approvalRequest";

interface ApprovalRequestResponse {
  success?: boolean;
  message?: string;
  data:
    | ApprovalRequest[]
    | {
        data: ApprovalRequest[];
        current_page?: number;
        last_page?: number;
        total?: number;
      };
}

export async function getApprovalRequests(): Promise<
  ApprovalRequest[]
> {
  const response =
    await api.get<ApprovalRequestResponse>(
      "/approval-requests"
    );

  const data = response.data.data;

  if (Array.isArray(data)) {
    return data;
  }

  return data.data;
}

export async function getApprovalRequest(
  id: number
): Promise<ApprovalRequest> {
  const response = await api.get<{
    success?: boolean;
    message?: string;
    data: ApprovalRequest;
  }>(`/approval-requests/${id}`);

  return response.data.data;
}

export async function createApprovalRequest(payload: {
  title: string;
  description: string;
}) {
  const response = await api.post(
    "/approval-requests",
    payload
  );

  return response.data;
}

export async function updateApprovalRequest(
  id: number,
  payload: {
    title: string;
    description: string;
  }
) {
  const response = await api.put(
    `/approval-requests/${id}`,
    payload
  );

  return response.data;
}

export async function deleteApprovalRequest(
  id: number
) {
  const response = await api.delete(
    `/approval-requests/${id}`
  );

  return response.data;
}

export async function submitApprovalRequest(
  id: number
) {
  const response = await api.post(
    `/approval-requests/${id}/submit`
  );

  return response.data;
}


