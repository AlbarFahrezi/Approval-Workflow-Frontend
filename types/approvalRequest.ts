export type ApprovalRequestStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected";

export interface ApprovalRequest {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: ApprovalRequestStatus;
  submitted_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
  };
}
