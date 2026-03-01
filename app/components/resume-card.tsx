import { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "~/components/score-circle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, jobTitle, companyName, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };
    loadResume();
  }, [imagePath]);
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="text-black! font-bold brealk-words">
              {companyName}
            </h2>
          )}
          {jobTitle && (
            <div className="text-lg brealk-words text-gray-500">{jobTitle}</div>
          )}
          {!jobTitle && !companyName && (
            <h2 className="text-black! font-bold brealk-words">Resume</h2>
          )}
        </div>
        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-87.5 max-sm:[200px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
