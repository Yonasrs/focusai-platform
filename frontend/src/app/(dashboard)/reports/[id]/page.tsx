"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Loader2, CheckCircle2, XCircle, Clock, Zap, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

type JobStatus = "queued" | "running" | "complete" | "failed";

interface JobState {
  job_id: string;
  status: JobStatus;
  message: string;
  upload?: {
    id: string;
    filename: string;
    content_type: string;
    file_size_bytes: number;
  };
}

const STATUS_CONFIG: Record<
  JobStatus,
  { icon: React.ElementType; color: string; bgColor: string; label: string }
> = {
  queued:   { icon: Clock,         color: "text-yellow-400",  bgColor: "bg-yellow-400/10",  label: "Queued"      },
  running:  { icon: Loader2,       color: "text-brand-primary", bgColor: "bg-brand-primary/10", label: "Analyzing"  },
  complete: { icon: CheckCircle2,  color: "text-green-400",   bgColor: "bg-green-400/10",   label: "Complete"    },
  failed:   { icon: XCircle,       color: "text-red-400",     bgColor: "bg-red-400/10",     label: "Failed"      },
};

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const [job, setJob] = useState<JobState | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function fetchJob() {
    try {
      const token = await getToken();
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const { data } = await axios.get<JobState>(
        `${apiBase}/api/uploads/jobs/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJob(data);
    } catch {
      setLoadError("Could not load job status. The job may not exist.");
    }
  }

  useEffect(() => {
    fetchJob();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll while queued or running
  useEffect(() => {
    if (!job || job.status === "complete" || job.status === "failed") return;
    const interval = setInterval(fetchJob, 4000);
    return () => clearInterval(interval);
  }, [job?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loadError) {
    return (
      <div className="p-8 max-w-2xl">
        <div className="card flex items-center gap-3 text-red-400">
          <XCircle size={20} />
          <p>{loadError}</p>
        </div>
        <Link href="/upload" className="btn-secondary mt-4 inline-flex items-center gap-2">
          ← Back to Upload
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 flex items-center gap-3 text-dark-muted">
        <Loader2 size={20} className="animate-spin" />
        <span>Loading job status…</span>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[job.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-dark-text mb-1">Analysis Report</h1>
      <p className="text-dark-muted mb-8">Job ID: <span className="font-mono text-xs">{job.job_id}</span></p>

      {/* Status card */}
      <div className={clsx("rounded-2xl border p-6 mb-6", cfg.bgColor, "border-white/5")}>
        <div className="flex items-center gap-3 mb-3">
          <div className={clsx("p-2 rounded-lg", cfg.bgColor)}>
            <StatusIcon
              size={22}
              className={clsx(cfg.color, job.status === "running" && "animate-spin")}
            />
          </div>
          <div>
            <p className={clsx("font-semibold", cfg.color)}>{cfg.label}</p>
            <p className="text-dark-muted text-sm">{job.message}</p>
          </div>
        </div>

        {(job.status === "queued" || job.status === "running") && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-dark-muted mb-1.5">
              <span>{job.status === "queued" ? "Waiting for analysis engine…" : "Running experts…"}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        )}
      </div>

      {/* Upload details */}
      {job.upload && (
        <div className="card mb-6">
          <p className="text-dark-muted text-xs font-semibold uppercase tracking-widest mb-3">Uploaded Content</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-brand-primary" />
            </div>
            <div>
              <p className="text-dark-text font-medium">{job.upload.filename}</p>
              <p className="text-dark-muted text-sm capitalize">
                {job.upload.content_type}&nbsp;·&nbsp;
                {(job.upload.file_size_bytes / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis coming soon notice */}
      {(job.status === "queued" || job.status === "running") && (
        <div className="bg-dark-card border border-white/5 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <Zap size={18} className="text-brand-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-dark-text text-sm font-semibold mb-1">Analysis Engine</p>
              <p className="text-dark-muted text-sm">
                Your content has been uploaded and queued. The AI analysis engine (Hook Expert,
                Retention Expert, Clarity Expert) will be wired in Milestone 2.
                This page will update automatically when results are ready.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/upload" className="btn-secondary flex items-center gap-2 text-sm">
          Upload Another
        </Link>
        <Link href="/dashboard" className="btn-secondary flex items-center gap-2 text-sm">
          Dashboard <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
