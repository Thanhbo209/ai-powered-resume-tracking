import React from "react";

const AmbientBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dynamic Blurred Blob 1 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] animate-blob-pulse" />

      {/* Dynamic Blurred Blob 2 */}
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[150px] animate-blob-pulse [animation-delay:4s]" />

      {/* Dynamic Blurred Blob 3 */}
      <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-pink-500/5 blur-[100px] animate-blob-pulse [animation-delay:8s]" />

      {/* Grid overlay for standard SaaS style */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
};

export default AmbientBackground;
