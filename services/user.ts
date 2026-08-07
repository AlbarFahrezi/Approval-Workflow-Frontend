import api from "@/lib/axios";

export async function getUsers() {
  const response = await api.get("/users");
  return response.data.data;
}

export async function getUser(id: number) {
  const response = await api.get(`/users/${id}`);
  return response.data.data;
}

export async function createUser(payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
}) {
  const response = await api.post("/users", payload);
  return response.data;
}

export async function updateUser(
  id: number,
  payload: {
    name: string;
    email: string;
    role: string;
  }
) {
  const response = await api.put(`/users/${id}`, payload);
  return response.data;
}

export async function deleteUser(id: number) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}