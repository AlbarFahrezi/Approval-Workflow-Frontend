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

export async function getApprovalRequests(): Promise<ApprovalRequest[]> {
  try {
    console.log("REQUEST KE API...");

    const response = await api.get<ApprovalRequestResponse>(
      "/approval-requests"
    );

    console.log("========== API RESPONSE ==========");
    console.log(response);

    console.log("========== DATA ==========");
    console.log(response.data);

    const result = response.data.data;

    if (Array.isArray(result)) {
      console.log("ARRAY LANGSUNG");
      return result;
    }

    console.log("ARRAY PAGINATION");
    return result.data;
  } catch (error: any) {
    console.log("========== ERROR ==========");
    console.log(error);

    console.log("MESSAGE:");
    console.log(error.message);

    console.log("RESPONSE:");
    console.log(error.response);

    console.log("DATA:");
    console.log(error.response?.data);

    throw error;
  }
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
  const response = await api.post("/approval-requests", payload);

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

export async function deleteApprovalRequest(id: number) {
  const response = await api.delete(
    `/approval-requests/${id}`
  );

  return response.data;
}

export async function submitApprovalRequest(id: number) {
  const response = await api.post(
    `/approval-requests/${id}/submit`
  );

  return response.data;
}

export async function approveApprovalRequest(
  id: number
) {
  const response = await api.post(
    `/approval-requests/${id}/approve`
  );

  console.log("APPROVE REQUEST");
  console.log(response.data);

  return response.data;
}

export async function rejectApprovalRequest(
  id: number,
  comment?: string
) {
  const response = await api.post(
    `/approval-requests/${id}/reject`,
    {
      comment,
    }
  );

  console.log("REJECT REQUEST");
  console.log(response.data);

  return response.data;
}