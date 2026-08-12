import api from "@/lib/axios";

export type BackendNotification = {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    approval_request_id?: number;
    title?: string;
    message?: string;
    status?: "draft" | "submitted" | "approved" | "rejected";
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

type NotificationResponse = {
  success: boolean;
  data: BackendNotification[];
};

export async function getNotifications() {
  const response =
    await api.get<NotificationResponse>(
      "/notifications"
    );

  return response.data.data;
}

export async function markNotificationAsRead(
  id: string
) {
  await api.post(`/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead() {
  await api.post("/notifications/read-all");
}