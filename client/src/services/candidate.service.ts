import { api, API_BASE_URL } from "@/lib/api";
import type {
  Candidate,
  CandidateInput,
  DashboardStats,
  Report,
} from "@/types";

export async function getDashboardStats() {
  const response = await api.get<{
    success: boolean;
    stats: DashboardStats;
  }>("/dashboard/stats");
  return response.data.stats;
}

export async function getCandidates() {
  const response = await api.get<{
    success: boolean;
    candidates: Candidate[];
  }>("/candidates");
  return response.data.candidates;
}

export async function getCandidate(id: string) {
  const response = await api.get<{
    success: boolean;
    candidate: Candidate;
  }>(`/candidates/${id}`);
  return response.data.candidate;
}

export async function createCandidate(
  data: CandidateInput
) {
  const response = await api.post<{
    success: boolean;
    candidate: Candidate;
    message: string;
  }>("/candidates", data);
  return response.data;
}

export async function updateCandidate(
  id: string,
  data: Partial<CandidateInput>
) {
  const response = await api.put<{
    success: boolean;
    candidate: Candidate;
    message: string;
  }>(`/candidates/${id}`, data);
  return response.data;
}

export async function deleteCandidate(id: string) {
  const response = await api.delete<{
    success: boolean;
    message: string;
  }>(`/candidates/${id}`);
  return response.data;
}

export async function startVerification(id: string) {
  const response = await api.post<{
    success: boolean;
    message: string;
  }>(`/verifications/${id}/start`);
  return response.data;
}

export async function getReport(id: string) {
  const response = await api.get<{
    success: boolean;
    report: Report;
  }>(`/reports/${id}`);
  return response.data.report;
}

export async function downloadReportPDF(id: string) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("verisure_token")
      : null;

  const response = await fetch(
    `${API_BASE_URL}/reports/${id}/pdf`,
    {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to download report");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `verification-report-${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
