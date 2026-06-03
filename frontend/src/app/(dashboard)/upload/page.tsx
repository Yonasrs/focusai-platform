"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileVideo, ImageIcon, Type, UploadCloud, X,
  AlertCircle, ChevronRight, Zap, Loader2, CheckCircle2,
} from "lucide-react";
import { clsx } from "clsx";
import { useUpload, type ContentType } from "@/hooks/useUpload";

// ── Config ──────────────────────────────────────────────────────────────────

const TABS: {
  type: ContentType;
  label: string;
  icon: React.ElementType;
  accept: string;
  mime: string[];
}[] = [
  { type: "video", label: "Video", icon: FileVideo,  accept: ".mp4",           mime: ["video/mp4"] },
  { type: "image", label: "Image", icon: ImageIcon,  accept: ".jpg,.jpeg,.png", mime: ["image/jpeg", "image/png"] },
  { type: "text",  label: "Text",  icon: Type,       accept: "",                mime: [] },
];

const PLAN_LIMITS = {
  free: { label: "Free", maxMB: 100,  maxDurSec: 30,  maxDurLabel: "30 seconds", analyses: 3   },
  pro:  { label: "Pro",  maxMB: 1024, maxDurSec: 300, maxDurLabel: "5 minutes",  analyses: 100 },
};

const CURRENT_PLAN = "free" as keyof typeof PLAN_LIMITS;

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtMB(mb: number) {
  return mb >= 1024 ? `${mb / 1024} GB` : `${mb} MB`;
}

async function getVideoDuration(file: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(isFinite(video.duration) ? video.duration : undefined);
    };
    video.onerror = () => resolve(undefined);
    video.src = URL.createObjectURL(file);
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function UploadPage() {
  const router = useRouter();
  const { status, progress, error: uploadError, upload, reset } = useUpload();

  const [activeTab, setActiveTab]     = useState<ContentType>("video");
  const [file, setFile]               = useState<File | null>(null);
  const [textContent, setTextContent] = useState("");
  const [isDragging, setIsDragging]   = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const limits   = PLAN_LIMITS[CURRENT_PLAN];
  const activeTabDef = TABS.find((t) => t.type === activeTab)!;
  const isUploading = status === "uploading";
  const displayError = validationError ?? uploadError;

  // ── Validation ──────────────────────────────────────────────────────────
  function validateFile(f: File): string | null {
    if (!activeTabDef.mime.includes(f.type)) {
      const accepted = activeTabDef.accept.toUpperCase().replace(/\./g, "").split(",").join(", ");
      return `Invalid file type. Accepted formats: ${accepted}`;
    }
    const sizeMB = f.size / (1024 * 1024);
    if (sizeMB > limits.maxMB) {
      return `File too large. Your plan allows up to ${fmtMB(limits.maxMB)}.`;
    }
    return null;
  }

  function handleFile(f: File) {
    setValidationError(null);
    const err = validateFile(f);
    if (err) { setValidationError(err); return; }
    setFile(f);
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTab, limits]
  );

  function clearFile() {
    setFile(null);
    setValidationError(null);
    reset();
  }

  function switchTab(t: ContentType) {
    setActiveTab(t);
    setFile(null);
    setTextContent("");
    setValidationError(null);
    reset();
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setValidationError(null);

    let durationSeconds: number | undefined;
    if (activeTab === "video" && file) {
      durationSeconds = await getVideoDuration(file);
      if (durationSeconds !== undefined && durationSeconds > limits.maxDurSec) {
        const label = limits.maxDurSec < 60 ? `${limits.maxDurSec}s` : `${limits.maxDurSec / 60} min`;
        setValidationError(`Video is too long. Your plan allows up to ${label}.`);
        return;
      }
    }

    const result = await upload(file, textContent, activeTab, durationSeconds);
    if (result) {
      router.push(`/reports/${result.jobId}`);
    }
  }

  const canSubmit =
    !isUploading &&
    ((activeTab !== "text" && file !== null) ||
     (activeTab === "text" && textContent.trim().length >= 20));

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-dark-text mb-1">Upload Content</h1>
      <p className="text-dark-muted mb-8">
        Upload your content and our AI experts will analyze it before you publish.
      </p>

      {/* Plan limits banner */}
      <div className="bg-dark-card border border-white/5 rounded-xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-start gap-3">
          <Zap size={18} className="text-brand-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-dark-text text-sm font-semibold">{limits.label} plan limits</p>
            <p className="text-dark-muted text-xs mt-0.5">
              Videos up to {limits.maxDurLabel}&nbsp;·&nbsp;
              Max file size {fmtMB(limits.maxMB)}&nbsp;·&nbsp;
              {limits.analyses} analyses / month
            </p>
          </div>
        </div>
        {CURRENT_PLAN === "free" && (
          <a
            href="/pricing"
            className="flex items-center gap-1 text-brand-primary text-sm font-semibold hover:underline whitespace-nowrap"
          >
            Upgrade to Pro <ChevronRight size={14} />
          </a>
        )}
      </div>

      {/* Content type tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => switchTab(type)}
            disabled={isUploading}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50",
              activeTab === type
                ? "bg-brand-primary text-white"
                : "bg-dark-card text-dark-muted hover:text-dark-text border border-white/5"
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ── File / text input area ─────────────────────────────────────── */}
      {activeTab !== "text" ? (
        <div className="mb-6">
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => !isUploading && inputRef.current?.click()}
              className={clsx(
                "border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center transition-colors",
                isUploading ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                isDragging
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
              )}
            >
              <UploadCloud
                size={48}
                className={clsx("mb-4 transition-colors", isDragging ? "text-brand-primary" : "text-dark-muted")}
              />
              <p className="text-dark-text font-semibold mb-1">
                {isDragging ? "Drop it here" : `Drag & drop your ${activeTab} here`}
              </p>
              <p className="text-dark-muted text-sm mb-4">or click to browse files</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {activeTab === "video" && (
                  <>
                    <span className="bg-white/5 text-dark-muted text-xs px-3 py-1 rounded-full">MP4</span>
                    <span className="bg-white/5 text-dark-muted text-xs px-3 py-1 rounded-full">Max {limits.maxDurLabel}</span>
                    <span className="bg-white/5 text-dark-muted text-xs px-3 py-1 rounded-full">Up to {fmtMB(limits.maxMB)}</span>
                  </>
                )}
                {activeTab === "image" && (
                  <>
                    <span className="bg-white/5 text-dark-muted text-xs px-3 py-1 rounded-full">JPG</span>
                    <span className="bg-white/5 text-dark-muted text-xs px-3 py-1 rounded-full">PNG</span>
                    <span className="bg-white/5 text-dark-muted text-xs px-3 py-1 rounded-full">Up to {fmtMB(limits.maxMB)}</span>
                  </>
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                accept={activeTabDef.accept}
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
              />
            </div>
          ) : (
            /* Selected file card */
            <div className="bg-dark-card border border-white/5 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                <activeTabDef.icon size={22} className="text-brand-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-dark-text font-semibold truncate">{file.name}</p>
                <p className="text-dark-muted text-sm">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB&nbsp;·&nbsp;
                  {activeTab === "video" ? "MP4 video" : file.type === "image/jpeg" ? "JPG image" : "PNG image"}
                </p>
              </div>
              {!isUploading && (
                <button
                  onClick={clearFile}
                  className="p-2 rounded-lg hover:bg-white/5 text-dark-muted hover:text-dark-text transition-colors"
                  aria-label="Remove file"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Text input */
        <div className="mb-6">
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            disabled={isUploading}
            placeholder="Paste your script, caption, ad copy, or any text content you want to analyze…"
            rows={10}
            className="input resize-none leading-relaxed disabled:opacity-50"
          />
          <div className="flex justify-between mt-2">
            <p className="text-dark-muted text-xs">Minimum 20 characters</p>
            <p className={clsx("text-xs", textContent.length >= 20 ? "text-brand-primary" : "text-dark-muted")}>
              {textContent.length} characters
            </p>
          </div>
        </div>
      )}

      {/* Validation / upload error */}
      {displayError && (
        <div className="mb-6 flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          <AlertCircle size={16} className="shrink-0" />
          {displayError}
        </div>
      )}

      {/* Upload progress bar */}
      {isUploading && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-dark-muted mb-2">
            <span>Uploading…</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Plan comparison table */}
      <div className="bg-dark-card border border-white/5 rounded-xl overflow-hidden mb-8">
        <div className="grid grid-cols-3 text-xs font-semibold text-dark-muted uppercase tracking-widest px-4 py-3 border-b border-white/5">
          <span>Limit</span>
          <span className="text-center">Free</span>
          <span className="text-center text-brand-primary">Pro</span>
        </div>
        {[
          { label: "Analyses / mo",    free: "3",                    pro: "100"        },
          { label: "Max video length", free: "30 seconds",           pro: "5 minutes"  },
          { label: "Max file size",    free: "100 MB",               pro: "1 GB"       },
          { label: "Formats",          free: "MP4, JPG, PNG, Text",  pro: "MP4, JPG, PNG, Text" },
        ].map((row) => (
          <div key={row.label} className="grid grid-cols-3 px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <span className="text-dark-muted">{row.label}</span>
            <span className="text-center text-dark-text">{row.free}</span>
            <span className="text-center text-brand-primary font-medium">{row.pro}</span>
          </div>
        ))}
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
      >
        {isUploading ? (
          <><Loader2 size={18} className="animate-spin" /> Uploading…</>
        ) : (
          <><Zap size={18} /> Analyze Content</>
        )}
      </button>
      {!canSubmit && !isUploading && (
        <p className="text-dark-muted text-xs text-center mt-2">
          {activeTab === "text"
            ? "Enter at least 20 characters to continue"
            : `Select a ${activeTab} file to continue`}
        </p>
      )}
    </div>
  );
}
