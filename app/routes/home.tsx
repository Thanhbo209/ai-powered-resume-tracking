import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FileText,
  Plus,
  Compass,
  LineChart,
  Award,
  Sparkles,
} from "lucide-react";
import Navbar from "~/components/navbar";
import ResumeCard from "~/components/resume-card";
import { usePuterStore } from "~/lib/puter";
import AmbientBackground from "~/components/ui/AmbientBackground";

export function meta() {
  return [
    { title: "ATS Engine | Dashboard" },
    { name: "description", content: "Manage and audit your resumes client-side" },
  ];
}

export default function Home() {
  const { auth, kv, isLoading: storeLoading } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    if (!storeLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated, storeLoading, navigate]);

  useEffect(() => {
    let active = true;
    const loadResumes = async () => {
      try {
        setLoadingResumes(true);
        const fetched = (await kv.list("resume:*", true)) as KVItem[];
        if (!active) return;

        if (fetched) {
          const parsedResumes = fetched.map(
            (item) => JSON.parse(item.value) as Resume,
          );
          setResumes(parsedResumes);
        }
      } catch (err) {
        console.error("Failed to load resumes from KV", err);
      } finally {
        if (active) setLoadingResumes(false);
      }
    };

    if (auth.isAuthenticated) {
      loadResumes();
    }
  }, [auth.isAuthenticated, kv]);

  // Compute live statistics for premium SaaS feel
  const totalResumes = resumes.length;
  const avgScore =
    totalResumes > 0
      ? Math.round(
          resumes.reduce(
            (acc, curr) => acc + (curr.feedback?.overallScore || 0),
            0,
          ) / totalResumes,
        )
      : 0;
  const strongMatches = resumes.filter(
    (r) => (r.feedback?.overallScore || 0) > 70,
  ).length;

  return (
    <main className="bg-brand-dark min-h-screen relative overflow-hidden select-none">
      {/* Glow animations */}
      <AmbientBackground />

      <Navbar />

      <section className="main-section relative z-10">
        {/* Welcome & Heading Section */}
        <div className="page-heading py-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            SaaS Console
          </div>
          <h1>
            Your Resume Audits, <span className="text-gradient-purple">Perfected.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mt-3">
            Track CV matches, examine detailed feedback reports, and polish
            your text to excel in automated recruiter screenings.
          </p>
        </div>

        {/* Dashboard Statistics summary widget */}
        {auth.isAuthenticated && !loadingResumes && totalResumes > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            {/* Stat Item 1 */}
            <div className="glass-panel p-6 flex items-center gap-4 hover:border-indigo-500/20">
              <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-extrabold text-white font-display">
                  {totalResumes}
                </p>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-0.5">
                  Total Resumes
                </p>
              </div>
            </div>

            {/* Stat Item 2 */}
            <div className="glass-panel p-6 flex items-center gap-4 hover:border-purple-500/20">
              <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <LineChart className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-extrabold text-white font-display">
                  {avgScore}%
                </p>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-0.5">
                  Average Match Score
                </p>
              </div>
            </div>

            {/* Stat Item 3 */}
            <div className="glass-panel p-6 flex items-center gap-4 hover:border-emerald-500/20">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-extrabold text-white font-display">
                  {strongMatches}
                </p>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-0.5">
                  Strong Match Targets
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content Zone */}
        {loadingResumes ? (
          /* High-end loading skeleton */
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="glass-panel p-6 h-96 flex flex-col gap-6 animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="h-6 w-32 bg-slate-800 rounded" />
                    <div className="h-4 w-20 bg-slate-800/60 rounded" />
                  </div>
                  <div className="w-14 h-14 bg-slate-800 rounded-full" />
                </div>
                <div className="flex-1 bg-slate-800/40 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : resumes.length > 0 ? (
          /* Cards Grid List */
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {resumes.map((resume: Resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        ) : (
          /* High-quality SaaS empty state design */
          <div className="glass-panel w-full max-w-2xl p-12 md:p-16 text-center flex flex-col items-center gap-6 mt-4 hover:border-indigo-500/10 transition-all duration-500 select-none animate-in zoom-in-95 duration-500">
            <div className="p-5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5 animate-bounce">
              <Compass className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white font-display">
                No resumes analyzed yet
              </h2>
              <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                Connect your first resume to review compatibility metrics, tone breakdowns,
                and precise matching checklists.
              </p>
            </div>

            <Link to="/upload" className="btn-primary mt-4">
              <Plus className="w-5 h-5" />
              Upload First Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
