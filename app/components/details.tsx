import React from "react";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./accordion";

const CustomScoreBadge = ({ score }: { score: number }) => {
  let badgeClasses = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  if (score > 70) {
    badgeClasses = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  } else if (score > 49) {
    badgeClasses = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  } else {
    badgeClasses = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  }

  return (
    <div className={cn("px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide uppercase shrink-0", badgeClasses)}>
      {score}/100
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-left w-full pr-4 select-none">
      <p className="text-base font-bold text-white font-display tracking-tight group-hover:text-indigo-400 transition-colors">
        {title}
      </p>
      <CustomScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Dynamic Summary Tags Box */}
      <div className="bg-slate-950/40 border border-white/5 w-full rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 select-none">
        {tips.map((tip, index) => (
          <div className="flex items-center gap-2.5 text-slate-300 font-medium" key={index}>
            {tip.type === "good" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <p className="text-xs truncate font-display">{tip.tip}</p>
          </div>
        ))}
      </div>

      {/* Detailed Cards Checklist */}
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-2 rounded-xl p-4 border transition-all duration-300",
              tip.type === "good"
                ? "bg-emerald-500/[0.02] border-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.02)]"
                : "bg-amber-500/[0.02] border-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.02)]"
            )}
          >
            <div className="flex items-center gap-2.5 border-b border-white/5 pb-2">
              {tip.type === "good" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <p className="text-sm font-bold text-white font-display tracking-tight">
                {tip.tip}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-slate-300 mt-1">
              {tip.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="flex flex-col gap-4 w-full text-left">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1 select-none">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        Detailed Review Dimension Breakdown
      </div>

      <Accordion allowMultiple>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style Alignment"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content density & Relevancy"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Layout & Structural Flow"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Target Skills Alignment"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
