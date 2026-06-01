import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, FileText, X, AlertTriangle } from "lucide-react";
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
  file: File | null;
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ file, onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileSelect?.(acceptedFiles[0] || null);
    },
    [onFileSelect],
  );

  const maxFileSize = 20 * 1024 * 1024; // 20 MB

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: maxFileSize,
    });

  return (
    <div className="w-full transition-all duration-300">
      {file ? (
        /* Selected File Card */
        <div className="uploader-selected-file animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {file.name}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatSize(file.size)}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="p-2.5 rounded-full border border-white/5 bg-slate-950/40 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all duration-300 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect?.(null);
            }}
            title="Remove File"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Interactive Drag and Drop Zone */
        <div
          {...getRootProps()}
          className={`uploader-drag-area group ${
            isDragActive
              ? "border-indigo-500 bg-indigo-500/5 glow-indigo scale-[1.01]"
              : "hover:scale-[1.005] hover:bg-slate-900/10"
          } ${
            isDragReject
              ? "border-rose-500 bg-rose-500/5 shadow-rose-500/5 glow-rose"
              : ""
          }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4">
            {isDragReject ? (
              <div className="p-4 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-8 h-8" />
              </div>
            ) : (
              <div
                className={`p-4 rounded-full border bg-slate-900/60 transition-all duration-500 ${
                  isDragActive
                    ? "border-indigo-500 text-indigo-400 bg-indigo-500/10 scale-110"
                    : "border-white/5 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/5 group-hover:scale-105"
                }`}
              >
                <FileUp className="w-8 h-8" />
              </div>
            )}

            <div className="space-y-1">
              {isDragReject ? (
                <p className="text-sm font-semibold text-rose-400">
                  Invalid file type. Please upload a PDF.
                </p>
              ) : isDragActive ? (
                <p className="text-sm font-semibold text-indigo-400">
                  Drop your resume here...
                </p>
              ) : (
                <p className="text-sm font-semibold text-white">
                  <span className="text-indigo-400 hover:underline">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
              )}
              <p className="text-xs text-slate-400">
                PDF only (up to {formatSize(maxFileSize)})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
