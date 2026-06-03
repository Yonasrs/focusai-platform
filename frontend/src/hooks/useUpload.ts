import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/nextjs";

export type UploadStatus = "idle" | "uploading" | "success" | "error";
export type ContentType = "video" | "image" | "text";

export interface UploadResult {
  uploadId: string;
  jobId: string;
}

export interface UseUploadReturn {
  status: UploadStatus;
  progress: number;
  error: string | null;
  result: UploadResult | null;
  upload: (
    file: File | null,
    textContent: string,
    contentType: ContentType,
    durationSeconds?: number
  ) => Promise<UploadResult | null>;
  reset: () => void;
}

export function useUpload(): UseUploadReturn {
  const { getToken } = useAuth();
  const [status, setStatus]     = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError]       = useState<string | null>(null);
  const [result, setResult]     = useState<UploadResult | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  const upload = useCallback(
    async (
      file: File | null,
      textContent: string,
      contentType: ContentType,
      durationSeconds?: number
    ): Promise<UploadResult | null> => {
      setStatus("uploading");
      setProgress(0);
      setError(null);

      try {
        const token = await getToken();
        const form = new FormData();
        form.append("content_type", contentType);

        if (contentType === "text") {
          form.append("text_content", textContent);
        } else {
          if (!file) throw new Error("No file selected.");
          form.append("file", file);
          if (durationSeconds !== undefined) {
            form.append("duration_seconds", String(Math.round(durationSeconds)));
          }
        }

        const apiBase =
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

        const response = await axios.post(
          `${apiBase}/api/uploads/`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
            onUploadProgress: (evt) => {
              if (evt.total) {
                setProgress(Math.round((evt.loaded / evt.total) * 100));
              }
            },
          }
        );

        const data = response.data;
        const uploadResult: UploadResult = {
          uploadId: data.upload.id,
          jobId: data.job.id,
        };
        setResult(uploadResult);
        setStatus("success");
        setProgress(100);
        return uploadResult;
      } catch (err) {
        const axErr = err as AxiosError<{ detail: string }>;
        const message =
          axErr.response?.data?.detail ??
          (err instanceof Error ? err.message : "Upload failed. Please try again.");
        setError(message);
        setStatus("error");
        return null;
      }
    },
    [getToken]
  );

  return { status, progress, error, result, upload, reset };
}
