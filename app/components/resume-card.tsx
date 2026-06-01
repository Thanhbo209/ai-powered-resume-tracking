import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Building, ChevronRight, Briefcase } from "lucide-react";
import ScoreCircle from "~/components/score-circle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, jobTitle, companyName, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const loadResume = async () => {
      try {
        const blob = await fs.read(imagePath);
        if (!blob || !active) return;
        const url = URL.createObjectURL(blob);
        setResumeUrl(url);
      } catch (e) {
        console.error("Failed to load resume image from Puter", e);
      }
    };
    loadResume();
    return () => {
      active = false;
    };
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card group animate-in fade-in slide-in-from-bottom-4 duration-500 hover:glow-indigo"
    >
      {/* Header Info Block */}
      <div className="resume-card-header">
        <div className="flex flex-col gap-1.5 text-left">
          {companyName ? (
            <h3 className="text-white font-bold text-lg leading-snug tracking-tight font-display break-words flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
              <Building className="w-4 h-4 text-indigo-400 shrink-0" />
              {companyName}
            </h3>
          ) : (
            <h3 className="text-white font-bold text-lg leading-snug tracking-tight font-display flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
              <Building className="w-4 h-4 text-indigo-400 shrink-0" />
              Unnamed Company
            </h3>
          )}

          {jobTitle ? (
            <div className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md flex items-center gap-1.5 w-fit">
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              {jobTitle}
            </div>
          ) : (
            <div className="text-xs text-slate-400">General Resume</div>
          )}
        </div>

        <div className="shrink-0 group-hover:scale-105 transition-transform duration-300">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      {/* Resume Document Preview Block */}
      {resumeUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 h-64 w-full flex items-start justify-center shadow-inner">
          {/* Subtle skeleton loader background while image is mounting */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-900/60 animate-pulse flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            </div>
          )}

          <img
            src={resumeUrl}
            alt="Resume Preview"
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-95 ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-98"
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Elegant overlay panel on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="text-xs font-bold text-white tracking-wide bg-indigo-600/90 border border-indigo-400/20 px-4 py-2 rounded-full shadow-lg flex items-center gap-1 scale-95 group-hover:scale-100 transition-all duration-300">
              View Detailed Audit
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 bg-slate-950/20 h-64 w-full flex items-center justify-center text-slate-500 text-sm">
          No Preview Available
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
