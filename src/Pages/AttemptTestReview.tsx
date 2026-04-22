import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "@/utils/axiosConfig";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Trophy,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  ListChecks,
  X,
  ArrowLeft,
  Target,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =========================
   Types
========================= */

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  question_text: string;
  options: Option[];
  correct_option_id: number;
  selected_option_id: number | null;
  is_correct: boolean;
  image_url?: string | null;
  difficulty?: string;
}

interface AttemptDetail {
  success: boolean;
  attempt_id: number;
  score: number;
  total_questions: number;
  submitted_at: string;
  data: Question[];
}

/* =========================
   Helpers
========================= */

function getScoreColor(pct: number) {
  if (pct >= 70) return { text: "text-emerald-400", ring: "#34d399", label: "Excellent" };
  if (pct >= 40) return { text: "text-amber-400", ring: "#fbbf24", label: "Average" };
  return { text: "text-red-400", ring: "#f87171", label: "Needs Work" };
}

/* =========================
   Skeleton
========================= */

function ReviewSkeleton() {
  return (
    <div className="min-h-screen bg-[#07090f] flex animate-pulse">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex flex-col w-72 bg-white/[0.02] border-r border-white/[0.06] p-6 h-screen sticky top-0 space-y-4">
        <div className="flex flex-col items-center gap-3 pt-16">
          <div className="w-20 h-20 rounded-full bg-white/[0.07]" />
          <div className="h-4 w-24 rounded bg-white/[0.06]" />
          <div className="h-3 w-32 rounded bg-white/[0.04]" />
        </div>
        <div className="grid grid-cols-5 gap-2 mt-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-white/[0.05]" />
          ))}
        </div>
      </aside>

      {/* Main skeleton */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="w-full max-w-3xl space-y-4">
          <div className="h-5 w-1/2 rounded bg-white/[0.07]" />
          <div className="h-3 w-1/3 rounded bg-white/[0.04]" />
          <div className="space-y-3 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-white/[0.04] border border-white/[0.06]" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================
   Score Ring
========================= */

function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const style = getScoreColor(pct);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
          <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
          <circle
            cx="44" cy="44" r={r}
            fill="none"
            stroke={style.ring}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold tabular-nums ${style.text}`}>{pct}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-lg tabular-nums">
          {score} <span className="text-gray-500 font-normal text-sm">/ {total}</span>
        </p>
        <p className={`text-xs font-medium ${style.text}`}>{style.label}</p>
      </div>
    </div>
  );
}

/* =========================
   Question Tracker Grid
========================= */

function TrackerGrid({
  questions,
  currentIndex,
  onJump,
}: {
  questions: Question[];
  currentIndex: number;
  onJump: (i: number) => void;
}) {
  const correct = questions.filter((q) => q.is_correct).length;
  const wrong = questions.length - correct;

  return (
    <div>
      {/* Stats row */}
      <div className="flex items-center justify-between text-[11px] mb-3 px-1">
        <span className="text-emerald-400 font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> {correct} correct
        </span>
        <span className="text-red-400 font-medium flex items-center gap-1">
          <XCircle className="w-3 h-3" /> {wrong} wrong
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const isActive = currentIndex === idx;
          return (
            <button
              key={q.id}
              onClick={() => onJump(idx)}
              className={`
                w-full aspect-square rounded-xl text-xs font-semibold border transition-all duration-150
                ${isActive
                  ? "border-cyan-400 bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30"
                  : q.is_correct
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20"
                  : q.selected_option_id !== null
                  ? "bg-red-500/10 border-red-500/25 text-red-400 hover:bg-red-500/20"
                  : "bg-white/[0.03] border-white/[0.08] text-gray-600"
                }
              `}
              aria-label={`Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================
   Sidebar content
========================= */

function SidebarContent({
  details,
  currentIndex,
  onJump,
  navigate,
  isPyq,
}: {
  details: AttemptDetail;
  currentIndex: number;
  onJump: (i: number) => void;
  navigate: ReturnType<typeof useNavigate>;
  isPyq: boolean;
}) {
  return (
    <div className="flex flex-col h-full pt-16">
      {/* Score */}
      <div className="px-4 pb-5 border-b border-white/[0.06] flex flex-col items-center gap-4 lg:mt-2">
        <ScoreRing score={details.score} total={details.total_questions} />

        {/* Stats pills */}
        <div className="flex gap-2 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-xs text-gray-400">
            <Clock className="w-3 h-3 text-gray-500" />
            {new Date(details.submitted_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-xs text-gray-400">
            <Target className="w-3 h-3 text-gray-500" />
            {details.total_questions}Q
          </div>
        </div>
      </div>

      {/* Tracker */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
          {isPyq ? "PYQ Review" : "Question Map"}
        </p>
        <TrackerGrid
          questions={details.data}
          currentIndex={currentIndex}
          onJump={onJump}
        />
      </div>

      {/* Back button */}
      <div className="px-4 pb-5 border-t border-white/[0.06] pt-4">
        <Button
          onClick={() => navigate(-1)}
          className="w-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-gray-300 rounded-xl py-2.5 font-medium flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Button>
      </div>
    </div>
  );
}

/* =========================
   Option Row
========================= */

function OptionRow({
  option,
  index,
  isSelected,
  isCorrect,
  skipped,
}: {
  option: Option;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  skipped: boolean;
}) {
  const labels = ["A", "B", "C", "D", "E", "F"];

  let containerClass = "border-white/[0.07] bg-white/[0.02] text-gray-400";
  let labelClass = "bg-white/[0.05] border-white/[0.08] text-gray-500";
  let indicator = null;

  if (isCorrect) {
    containerClass = "border-emerald-500/40 bg-emerald-500/[0.07] text-emerald-200";
    labelClass = "bg-emerald-500/20 border-emerald-400/30 text-emerald-300";
    indicator = <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />;
  } else if (isSelected) {
    containerClass = "border-red-500/40 bg-red-500/[0.07] text-red-200";
    labelClass = "bg-red-500/20 border-red-400/30 text-red-300";
    indicator = <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />;
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${containerClass}`}>
      <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${labelClass}`}>
        {labels[index] ?? index + 1}
      </span>
      <span className="leading-relaxed flex-1">{option.text}</span>
      {indicator}
    </div>
  );
}

/* =========================
   Main Component
========================= */

export default function AttemptTestReview() {
  const { attempt_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [details, setDetails] = useState<AttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isPyq = location.pathname.includes("pyq-mock-test");
  const baseUrl = isPyq ? "/api/pyq-mock-test" : "/api/mock-test";

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await apiClient.get(`${baseUrl}/attempt/${attempt_id}/details`);
        if (res.data?.success) setDetails(res.data);
        else toast.error("Unable to load attempt details.");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to fetch attempt details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [attempt_id, baseUrl]);

  if (loading) return <ReviewSkeleton />;

  if (!details) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#07090f] text-gray-300 gap-4">
        <AlertTriangle className="w-10 h-10 text-red-400" />
        <p className="text-sm">Attempt not found.</p>
        <Button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl px-5"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const currentQuestion = details.data[currentIndex];
  const skipped = currentQuestion.selected_option_id === null;
  const progress = ((currentIndex + 1) / details.total_questions) * 100;

  const handleJump = (i: number) => {
    setCurrentIndex(i);
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#07090f] text-gray-100 relative">

      {/* === Atmospheric background === */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 10% 0%, rgba(56,189,248,0.07), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 5%, rgba(168,85,247,0.06), transparent 55%)",
        }}
      />

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#07090f] border-r border-white/[0.06] sticky top-0 h-screen">
        <SidebarContent
          details={details}
          currentIndex={currentIndex}
          onJump={handleJump}
          navigate={navigate}
          isPyq={isPyq}
        />
      </aside>

      {/* ── Mobile FAB ── */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center hover:bg-cyan-400 transition"
        aria-label="Open question tracker"
      >
        <ListChecks className="w-5 h-5" />
      </button>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 w-[280px] h-full z-50 bg-[#0a0e1a] border-r border-white/[0.06] flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white">Review Map</h2>
                <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent
                  details={details}
                  currentIndex={currentIndex}
                  onJump={handleJump}
                  navigate={navigate}
                  isPyq={isPyq}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Area ── */}
      <main className="relative flex-1 flex flex-col min-h-screen">

        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-[#07090f]/90 backdrop-blur-sm border-b border-white/[0.05] px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3 max-w-3xl mx-auto">
            {/* Back on mobile */}
            <button
              onClick={() => navigate(-1)}
              className="lg:hidden flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <span className="text-xs text-gray-500">
              Q {currentIndex + 1}
              <span className="text-gray-700"> / {details.total_questions}</span>
            </span>

            {/* Correct/wrong mini stat */}
            <div className="hidden sm:flex items-center gap-3 text-[11px]">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {details.data.filter((q) => q.is_correct).length}
              </span>
              <span className="text-red-400 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {details.data.filter((q) => !q.is_correct).length}
              </span>
              <span className="flex items-center gap-1 text-gray-600">
                <BarChart3 className="w-3 h-3" />
                {Math.round((details.score / details.total_questions) * 100)}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="max-w-3xl mx-auto mt-2">
            <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  currentQuestion.is_correct
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
                    : currentQuestion.selected_option_id !== null
                    ? "bg-gradient-to-r from-red-500 to-rose-400"
                    : "bg-white/[0.15]"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl"
            >
              {/* Status banner */}
              <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg mb-4 w-fit ${
                currentQuestion.is_correct
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : skipped
                  ? "bg-white/[0.05] border border-white/[0.08] text-gray-500"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}>
                {currentQuestion.is_correct ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" /> Correct</>
                ) : skipped ? (
                  <><Clock className="w-3.5 h-3.5" /> Skipped</>
                ) : (
                  <><XCircle className="w-3.5 h-3.5" /> Incorrect</>
                )}
              </div>

              {/* Question text */}
              <h2 className="text-base sm:text-lg font-medium text-white leading-relaxed mb-6">
                <span className="text-cyan-500 font-semibold mr-2">Q{currentIndex + 1}.</span>
                {currentQuestion.question_text}
              </h2>

              {/* Image */}
              {currentQuestion.image_url && (
                <div className="flex justify-center mb-6">
                  <img
                    src={currentQuestion.image_url}
                    alt="Question illustration"
                    className="max-w-full sm:max-w-[60%] rounded-xl border border-white/[0.08]"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, i) => (
                  <OptionRow
                    key={opt.id}
                    option={opt}
                    index={i}
                    isSelected={opt.id === currentQuestion.selected_option_id}
                    isCorrect={opt.id === currentQuestion.correct_option_id}
                    skipped={skipped}
                  />
                ))}
              </div>

              {/* Skipped note */}
              {skipped && (
                <p className="text-xs text-gray-600 mt-4 text-center">
                  This question was not attempted.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation footer */}
        <div className="sticky bottom-0 bg-[#07090f]/90 backdrop-blur-sm border-t border-white/[0.05] px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3 max-w-3xl mx-auto">
            <Button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>

            <Button
              disabled={currentIndex === details.total_questions - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="bg-white/[0.07] hover:bg-white/[0.12] text-white rounded-xl px-6 disabled:opacity-30"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}