import React from "react";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeClasses = "";
  let badgeText = "";

  if (score > 70) {
    badgeClasses = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.05)]";
    badgeText = "Strong Match";
  } else if (score > 49) {
    badgeClasses = "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.05)]";
    badgeText = "Good Start";
  } else {
    badgeClasses = "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_12px_rgba(239,68,68,0.05)]";
    badgeText = "Needs Work";
  }

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${badgeClasses}`}>
      {badgeText}
    </div>
  );
};

export default ScoreBadge;
