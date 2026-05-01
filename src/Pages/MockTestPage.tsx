import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  Trophy,
  Clock,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  X,
  Info,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Zap,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  question_text: string;
  options: Option[];
  correct_option_id: number;
  difficulty: string;
  image_url: string | null;
}

interface SubmitAnswer {
  question_id: number;
  selected_option_id: number;
}

interface SubmitResponse {
  success: boolean;
  message: string;
  score: number;
  totalQuestions: number;
  data: any;
}

interface MockTestPageProps {
  type: "mock" | "pyq";
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function getTimerState(timeLeft: number) {
  if (timeLeft <= 300)
    return {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      pulse: true,
    };
  if (timeLeft <= 900)
    return {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      pulse: false,
    };
  return {
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    pulse: false,
  };
}

const WHATSAPP_NUMBER = "9325217691";

/* ------------------------------------------------------------------ */
/*  Timer display                                                      */
/* ------------------------------------------------------------------ */
function TimerDisplay({
  timeLeft,
  className = "",
}: {
  timeLeft: number;
  className?: string;
}) {
  const state = getTimerState(timeLeft);
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${state.bg} border ${state.border} ${className}`}
    >
      <Clock
        className={`w-3.5 h-3.5 ${state.color} ${state.pulse ? "animate-pulse" : ""}`}
      />
      <span
        className={`font-mono text-sm font-medium tabular-nums ${state.color}`}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Question tracker grid                                              */
/* ------------------------------------------------------------------ */
function TrackerGrid({
  questions,
  answers,
  currentIndex,
  onJump,
}: {
  questions: Question[];
  answers: Record<number, number>;
  currentIndex: number;
  onJump: (i: number) => void;
}) {
  const answered = useMemo(() => Object.keys(answers).length, [answers]);

  return (
    <div>
      {/* Stats */}
      <div className="flex items-center justify-between text-[11px] text-gray-500 mb-3 px-1">
        <span>
          <span className="text-emerald-400 font-medium">{answered}</span>{" "}
          answered
        </span>
        <span>
          <span className="text-gray-300 font-medium">
            {questions.length - answered}
          </span>{" "}
          remaining
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isActive = currentIndex === idx;
          return (
            <button
              key={q.id}
              onClick={() => onJump(idx)}
              className={`
                w-full aspect-square rounded-xl text-xs font-semibold
                border transition-all duration-150
                ${
                  isActive
                    ? "border-cyan-400 bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30"
                    : isAnswered
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-white/[0.03] border-white/[0.08] text-gray-500 hover:border-white/20 hover:text-gray-300"
                }
              `}
              aria-label={`Question ${idx + 1}${isAnswered ? " (answered)" : ""}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Option item                                                        */
/* ------------------------------------------------------------------ */
function OptionItem({
  option,
  index,
  selected,
  onSelect,
}: {
  option: Option;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const labels = ["A", "B", "C", "D", "E", "F"];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full flex items-center gap-3 p-3.5 rounded-xl border text-left
        transition-all duration-200
        ${
          selected
            ? "border-cyan-400/50 bg-cyan-500/[0.08] text-white"
            : "border-white/[0.07] bg-white/[0.02] text-gray-300 hover:border-white/[0.15] hover:bg-white/[0.04]"
        }
      `}
    >
      <span
        className={`
          shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
          transition-colors duration-200
          ${
            selected
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
              : "bg-white/[0.05] text-gray-500 border border-white/[0.08]"
          }
        `}
      >
        {labels[index] ?? index + 1}
      </span>
      <span className="text-sm leading-relaxed">{option.text}</span>
      {selected && (
        <CheckCircle2 className="w-4 h-4 text-cyan-400 ml-auto shrink-0" />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Warning dialog                                                     */
/* ------------------------------------------------------------------ */
function ExitWarningDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0c1020] text-gray-100 border border-red-500/15 rounded-2xl max-w-md shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="p-3 bg-red-500/10 rounded-full mb-3 border border-red-500/20">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <DialogTitle className="text-lg font-semibold text-red-400">
            Leave Test?
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-2 text-sm leading-relaxed">
            Leaving or refreshing will auto-submit your current answers and end
            the session. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-5">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/[0.06]"
          >
            Stay on Test
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-500/90 hover:bg-red-500 text-white px-5 rounded-xl"
          >
            Exit & Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Rules screen                                                       */
/* ------------------------------------------------------------------ */
function RulesScreen({
  type,
  loading,
  fetchError,
  questionCount,
  onStart,
  onBack,
}: {
  type: "mock" | "pyq";
  loading: boolean;
  fetchError: string | null;
  questionCount: number;
  onStart: () => void;
  onBack: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const label = type === "mock" ? "Mock Test" : "PYQ Test";

  const rules = [
    {
      icon: <Clock className="w-4 h-4 text-cyan-400" />,
      text: "You have 1 hour to complete the test.",
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-cyan-400" />,
      text: "Each question carries equal marks.",
    },
    {
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      text: "Review and modify answers anytime before submitting.",
    },
    {
      icon: <Shield className="w-4 h-4 text-cyan-400" />,
      text: "Switching tabs or closing may auto-submit the test.",
    },
    {
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      text: "Ensure a stable internet connection throughout.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090f] text-gray-100 px-4 py-10 relative">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-cyan-600/[0.04] blur-[100px]" />
      </div>

      <button
        onClick={onBack}
        className="fixed top-5 left-5 z-10 flex items-center gap-1.5 text-sm text-gray-400
                   hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="relative max-w-xl w-full">
        {loading ? (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 sm:p-8 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
              <div>
                <div className="h-5 w-32 rounded bg-white/[0.06] mb-2" />
                <div className="h-3 w-40 rounded bg-white/[0.04]" />
              </div>
            </div>
            {/* Rule rows skeleton */}
            <div className="space-y-3 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                >
                  <div className="w-4 h-4 rounded bg-white/[0.06] shrink-0" />
                  <div className="flex-1 h-3.5 rounded bg-white/[0.05]" />
                </div>
              ))}
            </div>
            {/* Button skeleton */}
            <div className="h-12 w-full rounded-xl bg-white/[0.06]" />
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center py-16 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
            <p className="text-sm text-red-400 mb-4">{fetchError}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-500/80 hover:bg-red-500 text-white rounded-xl px-5"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <Info className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {label}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {questionCount} questions · 60 minutes
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {rules.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                >
                  <span className="mt-0.5 shrink-0">{rule.icon}</span>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {rule.text}
                  </p>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={questionCount === 0}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600
                         hover:from-cyan-400 hover:to-blue-500
                         text-white rounded-xl py-3 text-base font-semibold
                         disabled:opacity-40 transition-all"
            >
              Start Test
            </Button>
          </div>
        )}
      </div>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-[#0c1020] text-gray-100 border border-white/[0.08] rounded-2xl max-w-sm shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg text-white">
              Ready to begin?
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              The 60-minute timer starts immediately and cannot be paused.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-5">
            <Button
              variant="ghost"
              onClick={() => setConfirmOpen(false)}
              className="text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                onStart();
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl px-5"
            >
              Start Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Result screen                                                      */
/* ------------------------------------------------------------------ */
function ResultScreen({
  type,
  result,
  showPromo,
  navigate,
}: {
  type: "mock" | "pyq";
  result: SubmitResponse;
  showPromo: boolean;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const pct = Math.round((result.score / result.totalQuestions) * 100);
  const label = type === "mock" ? "Mock" : "PYQ";

  const bfaMsg = encodeURIComponent(
    `Hi, I just completed the free mock test and scored ${result.score}/${result.totalQuestions}. I'm interested in joining the MAH AAC CET Entrance Exam Preparation Course. Please share the details.`,
  );
  const paidMsg = encodeURIComponent(
    `Hi, I just completed the free mock test and scored ${result.score}/${result.totalQuestions}. I'm interested in joining the Paid Mock Test for better evaluation. Please share the details.`,
  );
  const openWA = (msg: string) =>
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090f] text-gray-100 px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 sm:p-8 text-center">
          {/* Trophy */}
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {label} Test Completed!
          </h1>

          {/* Score ring */}
          <div className="relative w-28 h-28 mx-auto my-6">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={
                  pct >= 70 ? "#34d399" : pct >= 40 ? "#fbbf24" : "#f87171"
                }
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 264} 264`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{pct}%</span>
              <span className="text-[10px] text-gray-500">
                {result.score}/{result.totalQuestions}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            {pct >= 70
              ? "Excellent work! Keep it up."
              : pct >= 40
                ? "Good effort! Room to improve."
                : "Keep practicing, you'll get there!"}
          </p>

          {/* Promo block */}
          {showPromo && (
            <div className="text-left rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 mb-6">
              <p className="text-sm font-semibold text-white mb-2">
                Level up your prep
              </p>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Join our BFA Entrance Exam Preparation Course for live classes,
                video lectures, e-books, mock tests, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => openWA(bfaMsg)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs"
                >
                  Join Full Course
                </Button>
                <Button
                  onClick={() => openWA(paidMsg)}
                  variant="outline"
                  className="flex-1 rounded-xl border-white/[0.1] text-gray-300 hover:bg-white/[0.05] text-xs"
                >
                  Try Paid Mock Test
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate(-2)}
              variant="outline"
              className="flex-1 rounded-xl border-white/[0.1] text-gray-300 hover:bg-white/[0.05]"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Button>
            <Button
              onClick={() => navigate("/profile")}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function MockTestPage({ type }: MockTestPageProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [warningOpen, setWarningOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const id = params.id;

  const shouldShowFreeMockPromo =
    type === "mock" && location.state?.source === "free-mock";

  /* ── Fetch questions ─────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const endpoint =
          type === "mock"
            ? `/api/mock-test/${1}/questions`
            : `/api/pyq-mock-test/paper/${id}/questions`;
        const { data } = await apiClient.get<{
          success: boolean;
          data: Question[];
        }>(endpoint);
        if (cancelled) return;
        if (data.success) {
          setQuestions(data.data);
          setFetchError(null);
        } else {
          setFetchError("Failed to load questions.");
        }
      } catch {
        if (!cancelled) setFetchError("Network error while loading questions.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, type]);

  /* ── Warn on refresh/back ────────────────────────────────────── */
  useEffect(() => {
    if (!testStarted || result) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setWarningOpen(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [testStarted, result]);

  /* ── Timer ───────────────────────────────────────────────────── */
  useEffect(() => {
    if (!testStarted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testStarted]);

  /* ── Keyboard shortcuts ──────────────────────────────────────── */
  useEffect(() => {
    if (!testStarted || result) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentIndex < questions.length - 1) {
        e.preventDefault();
        setCurrentIndex((i) => i + 1);
      }
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex((i) => i - 1);
      }
      // Option shortcuts: 1-4
      const num = parseInt(e.key);
      if (num >= 1 && num <= currentQuestion?.options.length) {
        const opt = currentQuestion.options[num - 1];
        if (opt) handleSelect(currentQuestion.id, opt.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [testStarted, result, currentIndex, questions]);

  /* ── Handlers ────────────────────────────────────────────────── */
  const handleSelect = useCallback((questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    if (Object.keys(answers).length === 0) {
      toast.warning("Please attempt at least one question.");
      return;
    }
    setSubmitting(true);
    try {
      const formattedAnswers: SubmitAnswer[] = Object.entries(answers).map(
        ([qid, oid]) => ({
          question_id: Number(qid),
          selected_option_id: Number(oid),
        }),
      );
      const endpoint =
        type === "mock"
          ? "/api/mock-test/submit"
          : "/api/pyq-mock-test/attempt/submit";
      const payload =
        type === "mock"
          ? { course_id: 1, answers: formattedAnswers }
          : { paper_id: id, answers: formattedAnswers };

      const { data } = await apiClient.post<SubmitResponse>(endpoint, payload);
      setResult(data);
      if (timerRef.current) clearInterval(timerRef.current);
      toast.success(`${type === "mock" ? "Mock" : "PYQ"} Test Submitted!`);
    } catch {
      toast.error("Failed to submit test.");
    } finally {
      setSubmitting(false);
    }
  }, [answers, type, id, submitting]);

  const handleJump = useCallback((idx: number) => {
    setCurrentIndex(idx);
    setTrackerOpen(false);
  }, []);

  /* ── Derived ─────────────────────────────────────────────────── */
  const currentQuestion = questions[currentIndex];
  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  /* ── Render: Rules ───────────────────────────────────────────── */
  if (!testStarted) {
    return (
      <RulesScreen
        type={type}
        loading={loading}
        fetchError={fetchError}
        questionCount={questions.length}
        onStart={() => setTestStarted(true)}
        onBack={() => navigate(-1)}
      />
    );
  }

  /* ── Render: Loading ─────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#07090f] text-gray-100">
        {/* Sidebar skeleton — desktop only */}
        <aside className="hidden lg:flex flex-col w-72 bg-[#0a0e1a] border-r border-white/[0.06] h-screen animate-pulse">
          <div className="p-4 border-b border-white/[0.06]">
            <div className="h-4 w-32 rounded bg-white/[0.06] mb-3" />
            <div className="h-9 w-full rounded-xl bg-white/[0.05]" />
          </div>
          <div className="p-4 grid grid-cols-5 gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-white/[0.04]"
              />
            ))}
          </div>
        </aside>

        {/* Main area skeleton */}
        <main className="flex-1 flex flex-col animate-pulse">
          {/* Top bar */}
          <div className="border-b border-white/[0.05] px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className="h-3 w-16 rounded bg-white/[0.06]" />
              <div className="h-7 w-24 rounded-xl bg-white/[0.05] lg:hidden" />
              <div className="h-3 w-20 rounded bg-white/[0.05] hidden sm:block" />
            </div>
            <div className="max-w-3xl mx-auto mt-2">
              <div className="h-1 w-full rounded-full bg-white/[0.06]" />
            </div>
          </div>

          {/* Question skeleton */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
            <div className="w-full max-w-3xl">
              <div className="h-5 w-3/4 rounded bg-white/[0.06] mb-3" />
              <div className="h-4 w-1/2 rounded bg-white/[0.04] mb-6" />
              <div className="space-y-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.07]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05]" />
                    <div className="flex-1 h-3.5 rounded bg-white/[0.05]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer skeleton */}
          <div className="border-t border-white/[0.05] px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className="h-9 w-20 rounded-xl bg-white/[0.05]" />
              <div className="h-9 w-20 rounded-xl bg-white/[0.05]" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ── Render: Result ──────────────────────────────────────────── */
  if (result) {
    return (
      <ResultScreen
        type={type}
        result={result}
        showPromo={shouldShowFreeMockPromo}
        navigate={navigate}
      />
    );
  }

  /* ── Render: Test ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex bg-[#07090f] text-gray-100 relative">
      {/* ── Desktop sidebar ────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0a0e1a] border-r border-white/[0.06] sticky top-0 h-screen">
        <div className="p-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white mb-3">
            Question Tracker
          </h2>
          <TimerDisplay timeLeft={timeLeft} className="w-full justify-center" />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <TrackerGrid
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            onJump={handleJump}
          />
        </div>

        <div className="p-4 border-t border-white/[0.06]">
          <div className="text-[11px] text-gray-500 text-center mb-3">
            {answeredCount} of {questions.length} answered
          </div>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600
                       hover:from-cyan-400 hover:to-blue-500
                       text-white rounded-xl py-2.5 font-semibold disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting…
              </>
            ) : (
              "Submit Test"
            )}
          </Button>
        </div>
      </aside>

      {/* ── Mobile tracker FAB ─────────────────────────────────── */}
      <button
        onClick={() => setTrackerOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-30 w-12 h-12 rounded-full
                   bg-cyan-500 text-white shadow-lg shadow-cyan-500/20
                   flex items-center justify-center hover:bg-cyan-400 transition"
        aria-label="Open question tracker"
      >
        <ListChecks className="w-5 h-5" />
      </button>

      {/* ── Mobile tracker drawer ──────────────────────────────── */}
      <AnimatePresence>
        {trackerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setTrackerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-[280px] h-full z-50
                         bg-[#0a0e1a] border-l border-white/[0.06] flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white">Tracker</h2>
                <button
                  onClick={() => setTrackerOpen(false)}
                  className="text-gray-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-4 py-3 border-b border-white/[0.06]">
                <TimerDisplay
                  timeLeft={timeLeft}
                  className="w-full justify-center"
                />
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <TrackerGrid
                  questions={questions}
                  answers={answers}
                  currentIndex={currentIndex}
                  onJump={handleJump}
                />
              </div>

              <div className="p-4 border-t border-white/[0.06]">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl py-2.5 font-semibold disabled:opacity-40"
                >
                  {submitting ? "Submitting…" : "Submit Test"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Question area ──────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-[#07090f]/90 backdrop-blur-sm border-b border-white/[0.05] px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3 max-w-3xl mx-auto">
            <span className="text-xs text-gray-500">
              Q {currentIndex + 1}
              <span className="text-gray-600"> / {questions.length}</span>
            </span>

            {/* Mobile timer */}
            <TimerDisplay timeLeft={timeLeft} className="lg:hidden" />

            <span className="text-[11px] text-gray-600 hidden sm:block">
              {answeredCount} answered
            </span>
          </div>

          {/* Progress bar */}
          <div className="max-w-3xl mx-auto mt-2">
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-3xl"
              >
                {/* Question text */}
                <h2 className="text-base sm:text-lg font-medium text-white leading-relaxed mb-5">
                  <span className="text-cyan-500 font-semibold mr-2">
                    Q{currentIndex + 1}.
                  </span>
                  {currentQuestion.question_text}
                </h2>

                {/* Question image */}
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
                    <OptionItem
                      key={opt.id}
                      option={opt}
                      index={i}
                      selected={answers[currentQuestion.id] === opt.id}
                      onSelect={() => handleSelect(currentQuestion.id, opt.id)}
                    />
                  ))}
                </div>

                <p className="text-[10px] text-gray-600 mt-4 text-center">
                  Tip: Press 1–{currentQuestion.options.length} to select, ← →
                  to navigate
                </p>
              </motion.div>
            )}
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

            {currentIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl px-6 font-semibold disabled:opacity-40"
              >
                {submitting ? "Submitting…" : "Submit Test"}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-xl px-6"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Exit warning */}
      <ExitWarningDialog
        open={warningOpen}
        onClose={() => {
          setWarningOpen(false);
          window.history.pushState(null, "", window.location.href);
        }}
        onConfirm={() => {
          setWarningOpen(false);
          handleSubmit();
        }}
      />
    </div>
  );
}
