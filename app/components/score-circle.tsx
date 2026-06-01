import React, { useEffect, useState } from "react";

const ScoreCircle = ({ score = 75 }: { score: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  const progress = animatedScore / 100;
  const strokeDashoffset = circumference * (1 - progress);

  // Determine gradient color based on the score to add high visual value
  let gradientId = `grad-${score}`;
  let startColor = "#6366F1"; // Indigo
  let endColor = "#8B5CF6"; // Purple

  if (score > 75) {
    startColor = "#34D399"; // Emerald
    endColor = "#059669";
  } else if (score < 50) {
    startColor = "#F87171"; // Rose/Red
    endColor = "#DC2626";
  }

  return (
    <div className="relative w-20 h-20 group transition-all duration-300">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(99,102,241,0.15)] group-hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all duration-500"
      >
        {/* Background track circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={stroke}
          fill="transparent"
        />

        {/* Linear gradient definitions */}
        <defs>
          <linearGradient id={gradientId} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>

        {/* Foreground animated score progress circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Internal score numbers */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-sm tracking-tight text-white font-display">
          {score}
        </span>
        <span className="text-[10px] text-slate-500 font-medium">score</span>
      </div>
    </div>
  );
};

export default ScoreCircle;
