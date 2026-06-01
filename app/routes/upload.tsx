import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import {
  Sparkles,
  FileSearch,
  CheckCircle2,
  Building,
  Briefcase,
  FileText,
  Loader2,
} from "lucide-react";
import Navbar from "~/components/navbar";
import FileUploader from "~/components/file-uploader";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";
import AmbientBackground from "~/components/ui/AmbientBackground";

const Upload = () => {
  const { auth, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorText, setErrorText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const stepsList = [
    { id: 1, label: "Uploading PDF document" },
    { id: 2, label: "Converting document for preview" },
    { id: 3, label: "Uploading generated image preview" },
    { id: 4, label: "Auditing compatibility via Claude-3.5" },
    { id: 5, label: "Structuring analytics & redirecting" },
  ];

  const handleFileSelect = (file: File | null) => {
    setFile(file);
    setErrorText("");
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);
      setErrorText("");

      // Step 1: Uploading PDF document
      setCurrentStep(1);
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) {
        throw new Error("Failed to upload PDF file to Puter filesystem");
      }

      // Step 2: Converting PDF to image
      setCurrentStep(2);
      const imageFile = await convertPdfToImage(file);
      if (!imageFile?.file) {
        console.error("PDF convert error:", imageFile?.error);
        throw new Error("Failed to render PDF page to PNG preview");
      }

      // Step 3: Uploading generated image preview
      setCurrentStep(3);
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) {
        throw new Error("Failed to upload generated PNG preview to Puter");
      }

      const uuid = generateUUID();
      const data: any = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };

      // Set initial state in database
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      // Step 4: Auditing compatibility via Claude-3.5
      setCurrentStep(4);
      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobTitle, jobDescription }),
      );

      if (!feedback) {
        throw new Error("AI analysis did not return a valid response");
      }

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content?.[0]?.text;

      let parsed;
      try {
        parsed = JSON.parse(feedbackText);
      } catch (e) {
        console.error("AI returned invalid JSON:", feedbackText);
        throw new Error("Claude AI did not return a valid structured JSON report");
      }

      // Step 5: Structuring analytics & redirecting
      setCurrentStep(5);
      data.feedback = parsed;
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      // Delay briefly to allow user to visually see completion
      setTimeout(() => {
        navigate(`/resume/${uuid}`);
      }, 1000);
    } catch (err) {
      console.error("ANALYZE ERROR:", err);
      setErrorText(
        err instanceof Error ? err.message : "Something went wrong during CV auditing"
      );
      setIsProcessing(false);
      setCurrentStep(0);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setErrorText("Please upload a PDF resume file");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-brand-dark min-h-screen relative overflow-hidden select-none">
      <AmbientBackground />

      <Navbar />

      <section className="main-section relative z-10">
        <div className="page-heading py-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Audit Center
          </div>
          <h1>
            Auditing CV for{" "}
            <span className="text-gradient-purple">Your Dream Job.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mt-3">
            Provide the company details, target role, and job description to get
            tailored matching advice.
          </p>
        </div>

        {/* Audit Pipeline Page Layout */}
        <div className="w-full max-w-3xl glass-panel p-8 md:p-10 hover:border-indigo-500/10 transition-all duration-500">
          {isProcessing ? (
            /* Premium Processing step indicators list */
            <div className="flex flex-col items-center gap-8 py-8 animate-in zoom-in-98 duration-500 select-none">
              <div className="flex items-center justify-center p-6 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5 mb-2 relative">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <div className="absolute inset-0 w-full h-full rounded-2xl bg-indigo-500/10 blur-[8px] -z-10 animate-pulse" />
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="text-xl font-bold text-white font-display">
                  Auditing CV Compatibility
                </h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  Running calculations and resolving matching indicators in real-time...
                </p>
              </div>

              {/* Steps progression visualizer */}
              <div className="w-full max-w-md bg-slate-950/40 border border-white/5 rounded-2xl p-6 space-y-4 text-left">
                {stepsList.map((step) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3.5 transition-all duration-300 ${
                        isActive
                          ? "text-indigo-400 scale-[1.01]"
                          : isCompleted
                            ? "text-emerald-400"
                            : "text-slate-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                      ) : isActive ? (
                        <div className="w-5 h-5 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {step.id}
                        </div>
                      )}
                      <span className={`text-sm font-medium ${isActive ? "font-bold text-white" : ""}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Upload Audit Request Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full text-left">
              {errorText && (
                <div className="w-full p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  {errorText}
                </div>
              )}

              {/* Form Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="form-div">
                  <label htmlFor="company-name" className="flex items-center gap-2 text-slate-300">
                    <Building className="w-4 h-4 text-indigo-400" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company-name"
                    placeholder="e.g. Google, Stripe"
                    id="company-name"
                    className="glass-input"
                    required
                  />
                </div>
                <div className="form-div">
                  <label htmlFor="job-title" className="flex items-center gap-2 text-slate-300">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="job-title"
                    placeholder="e.g. Senior Frontend Engineer"
                    id="job-title"
                    className="glass-input"
                    required
                  />
                </div>
              </div>

              <div className="form-div">
                <label htmlFor="job-description" className="flex items-center gap-2 text-slate-300">
                  <FileSearch className="w-4 h-4 text-indigo-400" />
                  Job Description
                </label>
                <textarea
                  rows={6}
                  name="job-description"
                  placeholder="Paste the target job description here..."
                  id="job-description"
                  className="glass-input resize-none"
                  required
                />
              </div>

              <div className="form-div">
                <label htmlFor="uploader" className="flex items-center gap-2 text-slate-300">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Upload PDF Resume
                </label>
                <FileUploader file={file} onFileSelect={handleFileSelect} />
              </div>

              <button className="btn-primary w-full mt-4 font-bold text-base !py-3.5" type="submit">
                Analyze Resume Match
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
