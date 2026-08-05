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

  console.log("========== API RESPONSE ==========");
  console.log(response.data);

  const result = response.data.data;

  console.log("========== RESULT ==========");
  console.log(result);

  if (Array.isArray(result)) {
    console.log("ARRAY LANGSUNG");
    console.log(result);

    return result;
  }

  console.log("ARRAY PAGINATION");
  console.log(result.data);

  return result.data;
}

export async function getApprovalRequest(
  id: number
): Promise<ApprovalRequest> {
  const response = await api.get<{
    success?: boolean;
    message?: string;
    data: ApprovalRequest;
  }>(`/approval-requests/${id}`);

  console.log("DETAIL REQUEST");
  console.log(response.data);

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

  console.log("CREATE REQUEST");
  console.log(response.data);

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

  console.log("UPDATE REQUEST");
  console.log(response.data);

  return response.data;
}

export async function deleteApprovalRequest(
  id: number
) {
  const response = await api.delete(
    `/approval-requests/${id}`
  );

  console.log("DELETE REQUEST");
  console.log(response.data);

  return response.data;
}

export async function submitApprovalRequest(
  id: number
) {
  const response = await api.post(
    `/approval-requests/${id}/submit`
  );

  console.log("SUBMIT REQUEST");
  console.log(response.data);

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