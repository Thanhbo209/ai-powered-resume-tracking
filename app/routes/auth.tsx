import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { ShieldCheck, Sparkles, BrainCircuit, KeyRound } from "lucide-react";
import { usePuterStore } from "~/lib/puter";
import AmbientBackground from "~/components/ui/AmbientBackground";

export const meta = () => {
  return [
    { title: "ATS Engine | Connect" },
    { name: "description", content: "Authenticate with your secure cloud profile" },
  ];
};

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1] || "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(next);
    }
  }, [auth.isAuthenticated, next, navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-dark relative p-6 pt-0 select-none">
      {/* Background glowing effects */}
      <AmbientBackground />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 animate-in fade-in duration-700">
        {/* Left Side: Product Intro Block */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left max-lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <span className="font-bold text-lg text-indigo-400 font-display">
              AI Resume Auditor
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
            Optimize your application for the{" "}
            <span className="text-gradient-purple">perfect match.</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
            Evaluate your resumes against any target job description instantly.
            Get ATS-ready scores, structured design improvements, and detailed
            keyword mapping completely client-side.
          </p>

          {/* SaaS Core Features Checklist */}
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="flex items-start gap-3 bg-slate-900/40 border border-white/5 rounded-xl p-4">
              <BrainCircuit className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Claude AI Engine</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Powered by Claude-3.5-Sonnet
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/40 border border-white/5 rounded-xl p-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">100% Private</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct browser-to-AI audits
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Centered Glass Login Card */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="glass-panel w-full max-w-md p-8 md:p-10 text-center relative overflow-hidden group hover:border-indigo-500/10">
            {/* Glow border background */}
            <div className="absolute -top-[30%] -left-[30%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[50px] pointer-events-none" />

            <div className="flex flex-col gap-6 relative z-10">
              {/* Brand icon orb */}
              <div className="mx-auto p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5 w-fit">
                <KeyRound className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-white font-display">
                  Welcome to ATS Engine
                </h2>
                <p className="text-sm text-slate-400">
                  Connect via Puter Cloud for serverless file sync and analytics.
                </p>
              </div>

              <div className="mt-4">
                {isLoading ? (
                  <button
                    className="btn-primary w-full opacity-80 cursor-not-allowed !py-3.5"
                    disabled
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin mx-auto" />
                  </button>
                ) : (
                  <>
                    {auth.isAuthenticated ? (
                      <button
                        onClick={auth.signOut}
                        className="btn-danger w-full !py-3.5 text-base font-semibold"
                      >
                        Disconnect Account
                      </button>
                    ) : (
                      <button
                        onClick={auth.signIn}
                        className="btn-primary w-full !py-3.5 text-base font-semibold"
                      >
                        Connect via Puter
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Secure Trust note */}
              <p className="text-[10px] text-slate-500 tracking-wide uppercase mt-4">
                🔒 Secured by Puter.js protocol
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
