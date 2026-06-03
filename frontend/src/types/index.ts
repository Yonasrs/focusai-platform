export type Plan = "free" | "pro";

export interface User {
  id: string;
  clerkId: string;
  email: string;
  plan: Plan;
  creditsRemaining: number;
  createdAt: string;
}

export type UploadStatus = "pending" | "processing" | "complete" | "failed";
export type ContentType = "video" | "image" | "text";

export interface Upload {
  id: string;
  userId: string;
  filename: string;
  contentType: ContentType;
  s3Key: string;
  durationSeconds?: number;
  fileSizeBytes: number;
  status: UploadStatus;
  createdAt: string;
}

export type JobStatus = "queued" | "running" | "complete" | "failed";

export interface AnalysisJob {
  id: string;
  uploadId: string;
  userId: string;
  status: JobStatus;
  creditsUsed: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface ExpertScore {
  score: number;
  strengths?: string[];
  weaknesses?: string[];
  risks?: string[];
  suggestions?: string[];
  issues?: string[];
  rawOutput: Record<string, unknown>;
}

export interface PersonaFeedback {
  personaName: string;
  sentiment: "positive" | "neutral" | "negative";
  feedback: string;
}

export interface FinalReport {
  id: string;
  jobId: string;
  userId: string;
  finalScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  topRecommendations: string[];
  topRisks: string[];
  hookAnalysis?: ExpertScore;
  retentionAnalysis?: ExpertScore;
  clarityAnalysis?: ExpertScore;
  personaFeedback: PersonaFeedback[];
  createdAt: string;
}

export interface FeatureFlags {
  PREPUBLISH: boolean;
  AUDIENCELAB: boolean;
  HOOK_EXPERT: boolean;
  RETENTION_EXPERT: boolean;
  CLARITY_EXPERT: boolean;
  PDF_REPORT: boolean;
}
