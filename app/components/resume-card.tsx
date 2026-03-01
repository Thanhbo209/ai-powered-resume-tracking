import { Link } from "react-router";
import ScoreCircle from "~/components/score-circle";

const ResumeCard = ({
  resume: { id, jobTitle, companyName, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="text-black! font-bold brealk-words">{companyName}</h2>
          <div className="text-lg brealk-words text-gray-500">{jobTitle}</div>
        </div>
        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      <div className="gradient-border animate-in fade-in duration-1000">
        <div className="w-full h-full">
          <img
            src={imagePath}
            alt="resume"
            className="w-full h-87.5 max-sm:[200px] object-cover object-top"
          />
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
