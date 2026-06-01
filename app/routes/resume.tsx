import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ChevronLeft, Sparkles, FileText, Download, Loader2 } from "lucide-react";
import ATS from "~/components/ATS";
import Details from "~/components/details";
import Summary from "~/components/summary";
import { usePuterStore } from "~/lib/puter";
import AmbientBackground from "~/components/ui/AmbientBackground";

export const meta = () => {
  return [
    { title: "ATS Engine | Report" },
    { name: "description", content: "Comprehensive resume audit metrics" },
  ];
};

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [auth.isAuthenticated, isLoading, id, navigate]);

  useEffect(() => {
    let active = true;
    const loadResume = async () => {
      try {
        const resume = await kv.get(`resume:${id}`);
        if (!resume || !active) return;
        const data = JSON.parse(resume);

        const resumeBlob = await fs.read(data.resumePath);
        if (!resumeBlob || !active) return;
        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
        const resumeUrl = URL.createObjectURL(pdfBlob);

        const imageBlob = await fs.read(data.imagePath);
        if (!imageBlob || !active) return;
        const imageUrl = URL.createObjectURL(imageBlob);

        if (active) {
          setResumeUrl(resumeUrl);
          setImageUrl(imageUrl);
          setFeedback(data.feedback);
          setDataLoaded(true);
        }
      } catch (e) {
        console.error("Failed to load CV and preview from Puter FS/KV", e);
      }
    };

    if (auth.isAuthenticated && id) {
      loadResume();
    }

    return () => {
      active = false;
    };
  }, [id, auth.isAuthenticated]);

  return (
    <main className="bg-brand-dark min-h-screen relative overflow-hidden select-none pt-0!">
      <AmbientBackground />

      {/* Floating navigation header */}
      <nav className="resume-nav">
        <Link to="/" className="back-button group">
          <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <span>Back to Console</span>
        </Link>
        {resumeUrl && (
          <a
            href={resumeUrl}
            download="resume.pdf"
            className="btn-secondary !px-4 !py-2 text-xs gap-1.5 ml-auto"
            title="Download original PDF"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </a>
        )}
      </nav>

      {/* Split layout view container */}
      <div className="flex w-full max-lg:flex-col-reverse relative z-10">
        {/* Left Side Column: Interactive Sticky Document Preview */}
        <section className="w-full lg:w-1/2 p-6 md:p-8 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] flex items-center justify-center">
          {imageUrl ? (
            <div className="glass-panel p-3.5 w-full max-w-lg h-[85%] max-lg:h-[500px] flex items-center justify-center relative group hover:border-indigo-500/20 shadow-2xl transition-all duration-500 animate-in fade-in duration-700">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full h-full rounded-xl overflow-hidden block bg-slate-950/20"
                title="Click to view full PDF document"
              >
                <img
                  src={imageUrl}
                  alt="Resume Preview"
                  className="object-contain w-full h-full rounded-xl transition-all duration-700 group-hover:scale-[1.01] group-hover:brightness-95"
                />

                {/* Cover hovering guide */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-xs font-bold text-white bg-indigo-600/90 border border-indigo-400/20 px-4 py-2.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    Open PDF in New Tab
                  </span>
                </div>
              </a>
            </div>
          ) : (
            /* Premium layout skeleton spinner */
            <div className="glass-panel p-6 w-full max-w-lg h-[80%] max-lg:h-[450px] flex flex-col items-center justify-center gap-4 animate-pulse">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-500">
                Retrieving CV assets...
              </p>
            </div>
          )}
        </section>

        {/* Right Side Column: Evaluation Report Dashboard */}
        <section className="feedback-section lg:border-l lg:border-white/5 lg:h-[calc(100vh-80px)] lg:overflow-y-auto pb-16">
          <div className="flex flex-col gap-8 text-left animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Audited Title Block */}
            <div className="space-y-1.5 pl-1 select-none">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                Audited Report
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
                CV Compatibility Audit
              </h2>
              <p className="text-sm text-slate-400">
                Detailed matching analytics, score assessments, and recommendations.
              </p>
            </div>

            {feedback ? (
              <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                {/* Visual overall summary */}
                <Summary feedback={feedback} />

                {/* ATS Compliance checklists */}
                <ATS
                  score={feedback.ATS?.score || 0}
                  suggestions={feedback.ATS?.tips || []}
                />

                {/* Subcategory details accordions */}
                <Details feedback={feedback} />
              </div>
            ) : (
              /* Scanning/Resolving Loader */
              <div className="glass-panel p-8 flex flex-col items-center justify-center gap-4 py-20">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <div className="space-y-1 text-center select-none">
                  <p className="text-sm font-semibold text-white font-display">
                    Resolving Feedback Matrix
                  </p>
                  <p className="text-xs text-slate-400">
                    Compiling subcategories and parsing suggestions...
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Resume;
