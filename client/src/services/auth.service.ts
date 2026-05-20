import { api } from "@/lib/api";
import type { AuthResponse, User } from "@/types";

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const response =
    await api.post<AuthResponse>(
      "/auth/login",
      data
    );
  return response.data;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await api.post<{
    success: boolean;
    message: string;
    user: User;
  }>("/auth/register", data);
  return response.data;
}
