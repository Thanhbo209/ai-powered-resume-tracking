import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, Database, Trash2, ShieldAlert, Sparkles, Loader2 } from "lucide-react";
import { usePuterStore } from "~/lib/puter";
import AmbientBackground from "~/components/ui/AmbientBackground";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [isWiping, setIsWiping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadFiles = async () => {
    try {
      setLoadingFiles(true);
      const items = (await fs.readDir("./")) as FSItem[];
      if (items) {
        setFiles(items);
      }
    } catch (e) {
      console.error("Failed to read Puter FS files", e);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      loadFiles();
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

  const handleDelete = async () => {
    try {
      setIsWiping(true);
      setShowConfirm(false);

      // Delete all files in the directory
      const deletePromises = files.map((file) => fs.delete(file.path));
      await Promise.all(deletePromises);

      // Flush key value database storage
      await kv.flush();

      // Reload
      await loadFiles();
    } catch (e) {
      console.error("Failed to wipe application database/files", e);
    } finally {
      setIsWiping(false);
    }
  };

  if (isLoading || isWiping) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-dark relative p-6">
        <AmbientBackground />
        <div className="glass-panel p-8 max-w-sm w-full flex flex-col items-center justify-center gap-4 text-center z-10 animate-pulse">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-semibold text-white font-display">
            Wiping Cloud Assets...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-brand-dark min-h-screen relative overflow-hidden select-none p-6 md:p-12 flex items-center justify-center">
      <AmbientBackground />

      <div className="w-full max-w-3xl flex flex-col gap-8 relative z-10 animate-in fade-in duration-500 text-left">
        {/* Title block */}
        <div className="space-y-1.5 pl-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4" />
            Developer Terminal
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
            Console Data Management
          </h2>
          <p className="text-sm text-slate-400">
            Clear Puter.js serverless database, profile listings, and cloud storage files.
          </p>
        </div>

        {/* Warning Alert Banner */}
        <div className="w-full p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-4 shadow-lg shadow-rose-950/20">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white font-display tracking-tight">
              Destructive Wipe Actions Are Permanent
            </h4>
            <p className="text-xs text-rose-300/80 leading-relaxed">
              Clearing data will remove all PDF documents, PNG images, and evaluation feedback logs
              saved in your serverless storage. This cannot be undone.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left panel: File Browser */}
          <div className="md:col-span-7 glass-panel p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-display select-none">
              <Database className="w-4 h-4 text-indigo-400" />
              Cloud File Explorer
            </h3>

            {loadingFiles ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                <p className="text-xs text-slate-500">Scanning filesystem...</p>
              </div>
            ) : files.length > 0 ? (
              <div className="max-h-64 overflow-y-auto space-y-2 border border-white/5 bg-slate-950/30 rounded-xl p-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-white/5 text-slate-300 hover:text-white transition-colors"
                  >
                    <span className="text-xs truncate max-w-[200px] font-medium font-display">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">
                      {file.size ? `${(file.size / 1024).toFixed(1)} KB` : "0 KB"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-sm border border-dashed border-white/5 rounded-xl bg-slate-950/20 select-none">
                Filesystem is empty
              </div>
            )}
          </div>

          {/* Right panel: Danger Triggers */}
          <div className="md:col-span-5 glass-panel p-6 border-rose-500/10 bg-rose-500/[0.01] flex flex-col gap-4 text-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 justify-center font-display select-none">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Dangerous Actions
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed text-left">
              Clears auth profiles and resets database logs (`resume:*`) to factory defaults.
            </p>

            <div className="space-y-3 mt-2">
              {showConfirm ? (
                <div className="space-y-3 animate-in zoom-in-95 duration-200">
                  <p className="text-xs font-bold text-rose-400">Are you absolutely sure?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      className="btn-danger flex-1 !py-2.5 text-xs font-bold"
                    >
                      Yes, Wipe All
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="btn-secondary flex-1 !py-2.5 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="btn-danger w-full flex items-center justify-center gap-2 !py-3 text-sm font-bold cursor-pointer"
                  disabled={files.length === 0}
                >
                  <Trash2 className="w-4 h-4" />
                  Wipe Application
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-500 tracking-wide uppercase select-none">
              Authenticated: {auth.user?.username}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WipeApp;
