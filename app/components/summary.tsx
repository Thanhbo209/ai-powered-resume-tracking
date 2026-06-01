import React from "react";
import { MessageSquareCode, FileEdit, Layers, Cpu, Compass } from "lucide-react";
import ScoreBadge from "~/components/score-badge";
import ScoreGauge from "~/components/score-gauge";

interface CategoryProps {
  title: string;
  score: number;
  icon: React.ReactNode;
}

const Category = ({ title, score, icon }: CategoryProps) => {
  let scoreColor = "text-emerald-400";
  if (score > 70) {
    scoreColor = "text-emerald-400";
  } else if (score > 49) {
    scoreColor = "text-amber-400";
  } else {
    scoreColor = "text-rose-400";
  }

  return (
    <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-indigo-500/10 hover:bg-slate-950/60 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5 text-indigo-400 group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-white tracking-wide">{title}</p>
          <div className="mt-1">
            <ScoreBadge score={score} />
          </div>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-2xl font-extrabold font-display ${scoreColor}`}>
          {score}
        </span>
        <span className="text-[10px] text-slate-500 font-semibold block uppercase">
          score
        </span>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="glass-panel p-6 md:p-8 hover:border-indigo-500/10 transition-all duration-500 flex flex-col gap-6">
      {/* Overall Score Section */}
      <div className="flex items-center gap-8 max-sm:flex-col max-sm:text-center pb-6 border-b border-white/5">
        <div className="shrink-0 animate-in zoom-in-95 duration-700">
          <ScoreGauge score={feedback.overallScore} />
        </div>

        <div className="space-y-2 text-left max-sm:text-center">
          <div className="flex items-center gap-2 max-sm:justify-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-white font-display">
              Resume Analysis Score
            </h2>
            <div className="animate-pulse">
              <ScoreBadge score={feedback.overallScore} />
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            This rating represents the aggregate evaluation across four essential
            dimensions: style alignment, detail density, design layout, and skills matching.
          </p>
        </div>
      </div>

      {/* Grid-based Breakdown metrics */}
      <div className="space-y-3 text-left">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          Core Metric Audit
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Category
            title="Tone & Style"
            score={feedback.toneAndStyle.score}
            icon={<MessageSquareCode className="w-4 h-4" />}
          />
          <Category
            title="Content Density"
            score={feedback.content.score}
            icon={<FileEdit className="w-4 h-4" />}
          />
          <Category
            title="Structure & Flow"
            score={feedback.structure.score}
            icon={<Layers className="w-4 h-4" />}
          />
          <Category
            title="Skills Align"
            score={feedback.skills.score}
            icon={<Cpu className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  );
};

export default Summary;
