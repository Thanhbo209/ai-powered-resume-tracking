import { Github, LogOut, Sparkles, UploadCloud } from "lucide-react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { auth } = usePuterStore();

  return (
    <nav className="navbar hover:border-indigo-500/20">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md group-hover:scale-110 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-300 transition duration-300 font-display">
            ATS<span className="text-gradient-purple font-extrabold">Engine</span>
          </span>
        </Link>
        <a
          href="https://github.com/Thanhbo209/ai-powered-resume-tracking"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition duration-300 max-sm:hidden"
          title="View GitHub Repository"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>

      <div className="flex items-center gap-4">
        {auth.isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300 max-md:hidden border-r border-white/10 pr-4">
              Hello,{" "}
              <span className="text-indigo-400 font-semibold">
                {auth.user?.username}
              </span>
            </span>
            <Link
              to="/upload"
              className="btn-primary !px-4 !py-2 text-sm max-sm:px-3"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="max-sm:hidden">Upload Resume</span>
            </Link>
            <button
              onClick={auth.signOut}
              className="p-2 rounded-full border border-white/5 bg-slate-900/60 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-slate-400 transition-all duration-300 cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link to="/auth" className="btn-primary !px-6 !py-2 text-sm">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
