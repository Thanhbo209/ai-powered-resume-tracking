import React, { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
    // Delay to let the mount transition trigger smoothly
    const timer = setTimeout(() => {
      setAnimatedPercent(score / 100);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  // Determine standard SaaS gradients
  let startColor = "#818CF8"; // Violet 400
  let endColor = "#EC4899"; // Pink 500
  let glowColor = "rgba(139, 92, 246, 0.25)";

  if (score > 75) {
    startColor = "#34D399"; // Emerald 400
    endColor = "#10B981"; // Emerald 500
    glowColor = "rgba(16, 185, 129, 0.25)";
  } else if (score < 50) {
    startColor = "#F87171"; // Red 400
    endColor = "#EF4444"; // Red 500
    glowColor = "rgba(239, 68, 68, 0.25)";
  }

  const gaugeId = `gaugeGrad-${score}`;

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative w-44 h-24">
        <svg
          viewBox="0 0 100 50"
          className="w-full h-full filter drop-shadow-[0_4px_16px_var(--glow)]"
          style={{ "--glow": glowColor } as React.CSSProperties}
        >
          <defs>
            <linearGradient id={gaugeId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>

          {/* Background track arc */}
          <path
            d="M10,45 A40,40 0 0,1 90,45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Foreground progress arc */}
          <path
            ref={pathRef}
            d="M10,45 A40,40 0 0,1 90,45"
            fill="none"
            stroke={`url(#${gaugeId})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - animatedPercent)}
            className="transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1)"
          />
        </svg>

        {/* Dynamic Center Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-3xl font-extrabold tracking-tight text-white font-display">
            {score}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mb-1">
            Overall Match
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
