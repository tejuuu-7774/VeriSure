export type VerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "FAILED"
  | "PARTIAL";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  token: string;
  user: User;
};

export type Candidate = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  panNumber: string;
  dob: string;
  address: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
  verificationLogs?: VerificationLog[];
};

export type VerificationLog = {
  id: string;
  candidateId: string;
  verificationType: "AADHAAR" | "PAN";
  requestPayload: Record<string, unknown>;
  responsePayload: Record<string, unknown>;
  verificationStatus: VerificationStatus;
  verifiedAt: string;
};

export type CandidateInput = {
  fullName: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  panNumber: string;
  dob: string;
  address: string;
};

export type DashboardStats = {
  totalCandidates: number;
  verified: number;
  pending: number;
  failed: number;
  partial: number;
};

export type Report = {
  reportId: string;
  candidate: Candidate;
  verificationSummary: {
    overallStatus: VerificationStatus;
    verifiedAt: string;
  };
  checks: {
    aadhaar: VerificationLog | null;
    pan: VerificationLog | null;
  };
  timeline: VerificationLog[];
  generatedAt: string;
};
