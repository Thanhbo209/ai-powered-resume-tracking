import { Github } from "lucide-react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="flex items-center gap-4 ">
        <Link to="/" className="font-bold text-2xl text-gradient">
          Review Your Resume
        </Link>
        <Link
          to="https://github.com/Thanhbo209/ai-powered-resume-tracking"
          target="_blank"
          className="text-white  bg-black p-2 rounded-full hover:text-gray-200 transition"
        >
          <Github className="w-5 h-5 mx-auto object-center" />
        </Link>
      </div>
      <Link to="/upload" className="primary-button w-fit">
        Upload Resume
      </Link>
    </nav>
  );
};

export default Navbar;
