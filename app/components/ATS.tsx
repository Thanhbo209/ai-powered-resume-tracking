import React from "react";
import { Server, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine standard SaaS gradients
  let glowBorder = "border-emerald-500/10";
  let glowBg = "bg-emerald-500/[0.02]";
  let scoreColor = "text-emerald-400";
  let statusTitle = "Optimal Compliance";

  if (score > 70) {
    glowBorder = "border-emerald-500/15";
    glowBg = "bg-emerald-500/[0.02]";
    scoreColor = "text-emerald-400";
    statusTitle = "Highly Optimized";
  } else if (score > 49) {
    glowBorder = "border-amber-500/15";
    glowBg = "bg-amber-500/[0.02]";
    scoreColor = "text-amber-400";
    statusTitle = "Partial Alignment";
  } else {
    glowBorder = "border-rose-500/15";
    glowBg = "bg-rose-500/[0.02]";
    scoreColor = "text-rose-400";
    statusTitle = "Action Required";
  }

  return (
    <div className={`glass-panel p-6 md:p-8 hover:border-indigo-500/10 transition-all duration-500 flex flex-col gap-6 relative overflow-hidden ${glowBorder} ${glowBg}`}>
      {/* Background soft ambient spot */}
      <div className="absolute top-[-30%] right-[-20%] w-60 h-60 rounded-full bg-indigo-500/5 blur-[50px] pointer-events-none" />

      {/* Top Header Card Info */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-4 text-left">
        <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shrink-0">
          <Server className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white font-display">
            ATS Engine Score
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compatibility rating for automated Applicant Tracking Systems.
          </p>
        </div>
        <div className="ml-auto text-right">
          <span className={`text-3xl font-extrabold font-display ${scoreColor}`}>
            {score}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block uppercase">
            /100
          </span>
        </div>
      </div>

      {/* Audit Checklist Section */}
      <div className="space-y-4 text-left">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 font-display">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            {statusTitle}
          </h3>
          <p className="text-xs text-slate-400">
            This review estimates how accurately parsed keywords, section structures,
            and layout details rank inside automated employer matching indices.
          </p>
        </div>

        {/* Suggestions cards layout */}
        <div className="grid grid-cols-1 gap-3 mt-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all duration-300 ${
                suggestion.type === "good"
                  ? "bg-emerald-500/[0.03] border-emerald-500/10 text-emerald-300"
                  : "bg-amber-500/[0.03] border-amber-500/10 text-amber-300"
              }`}
            >
              {suggestion.type === "good" ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-amber-400" />
              )}
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                  {suggestion.type === "good" ? "Compliant Item" : "Improvement Option"}
                </span>
                <p className="text-sm leading-relaxed text-slate-300 font-medium">
                  {suggestion.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ATS;
