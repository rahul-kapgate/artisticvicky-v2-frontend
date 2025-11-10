import { useEffect, useState, useRef } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  Trophy,
  Clock,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertTriangle,
  ListChecks,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import CustomWarningDialog from "@/components/CustomWarningDialog";
import { useNavigate, useParams } from "react-router-dom";

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  paper_id: number;
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

export default function PYQMockTest() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [warningOpen, setWarningOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const paperId = params.id;

  // 🚨 Warn user on refresh / back button
  useEffect(() => {
    if (!testStarted || result) return;
    let refreshAttempted = false;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (refreshAttempted) return;
      e.preventDefault();
      e.returnValue = "";
      refreshAttempted = true;
      setWarningOpen(true);
      setTimeout(() => (refreshAttempted = false), 2000);
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

  // ✅ Fetch PYQ Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get<{ success: boolean; data: Question[] }>(
          `/api/pyq-mock-test/paper/${paperId}/questions`
        );
        if (data.success) {
          setQuestions(data.data);
          setFetchError(null);
        } else {
          setFetchError("Failed to load PYQ questions.");
        }
      } catch {
        setFetchError("Network error while loading PYQ questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [paperId]);

  // 🕒 Timer
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
    return () => clearInterval(timerRef.current!);
  }, [testStarted]);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSelect = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length === 0) {
      toast.warning("Please attempt at least one question.");
      return;
    }
    if (submitting) return;
    setSubmitting(true);

    try {
      const formattedAnswers: SubmitAnswer[] = Object.entries(answers).map(
        ([question_id, selected_option_id]) => ({
          question_id: Number(question_id),
          selected_option_id: Number(selected_option_id),
        })
      );

      const { data } = await apiClient.post<SubmitResponse>(
        "/api/pyq-mock-test/attempt/submit",
        { paper_id: paperId, answers: formattedAnswers }
      );

      setResult(data);
      clearInterval(timerRef.current!);
      toast.success("PYQ submitted successfully!");
    } catch {
      toast.error("Failed to submit PYQ test.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleScrollToQuestion = (index: number) => {
    setCurrentIndex(index);
    setTrackerOpen(false);
  };

  const timerColor =
    timeLeft <= 300
      ? "text-red-400"
      : timeLeft <= 900
        ? "text-yellow-400"
        : "text-cyan-300";

  // 🧾 Rules Page
  if (!testStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f1b3d] via-[#152a52] to-[#1a237e] text-gray-100 px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="fixed top-5 left-5 flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/20 hover:bg-white/20"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="max-w-2xl w-full bg-[#0f1b3d]/70 border border-white/10 rounded-2xl p-8 text-center">
          {loading ? (
            <Skeleton className="w-full h-40 bg-white/10 rounded-xl" />
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center py-8 text-red-400">
              <AlertTriangle className="w-8 h-8 mb-2" />
              <p>{fetchError}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-gradient-to-r from-pink-500 to-red-600 hover:opacity-90"
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-8 h-8 text-cyan-400" />
                <h1 className="text-3xl font-bold text-cyan-300">PYQ Test Rules</h1>
              </div>

              <ul className="list-disc list-inside space-y-3 text-gray-200 text-[15px] leading-relaxed mb-8 text-left">
                <li>You will have <strong>1 hour</strong> to complete the test.</li>
                <li>Each question carries equal marks.</li>
                <li>You can review and modify your answers anytime before submitting.</li>
                <li>Switching tabs or closing the window may lead to auto submission.</li>
                <li>Ensure you have a stable internet connection throughout the test.</li>
                <li>Click on <strong>Submit Test</strong> once you are done.</li>
              </ul>

              <Button
                onClick={() => setConfirmOpen(true)}
                disabled={loading || !!fetchError || questions.length === 0}
                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:opacity-90 rounded-xl px-8 py-3 text-lg text-white shadow-lg disabled:opacity-50"
              >
                Start Test 🚀
              </Button>
            </>
          )}
        </div>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="bg-[#0f1b3d]/95 text-gray-100 border border-white/10 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-cyan-300">
                Confirm Start
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Once started, the 1-hour timer will begin and cannot be paused.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setConfirmOpen(false);
                  setTestStarted(true);
                }}
                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:opacity-90 rounded-lg px-5"
              >
                Yes, Start Now
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Loading
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#10194f] to-[#1a237e]">
        <Loader2 className="w-10 h-10 text-cyan-300 animate-spin" />
      </div>
    );

  // ✅ After submission
  if (result)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-[#0f1b3d] via-[#152a52] to-[#1a237e] text-gray-100 px-4">
        <Trophy className="w-14 h-14 text-yellow-400 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2">🎯 PYQ Test Completed!</h1>
        <p className="text-lg mb-6">
          You scored{" "}
          <span className="text-cyan-300 font-semibold">{result.score}</span> /{" "}
          {result.totalQuestions}
        </p>
        <Button
          onClick={() => navigate(-2)}
          className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-700 hover:opacity-90 rounded-xl px-6 py-2"
        >
          Back
        </Button>
      </div>
    );

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-row-reverse bg-gradient-to-b from-[#10194f] via-[#132060] to-[#1a237e] text-gray-100 relative">
      {/* 🧭 Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-72 bg-[#0f1b3d]/70 backdrop-blur-md border-l border-white/10 p-5 sticky top-0 h-screen">
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-center text-cyan-300">
            Question Tracker
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-5 h-5" />
            <span className={`font-mono text-lg ${timerColor}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {questions.map((_, idx) => {
              const isAnswered = !!answers[questions[idx].id];
              const isActive = currentIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleScrollToQuestion(idx)}
                  className={`rounded-full w-10 h-10 text-sm font-semibold border transition-all duration-200 ${isActive
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                      : isAnswered
                        ? "bg-green-500/20 border-green-400 text-green-300"
                        : "bg-white/5 border-white/20 hover:border-cyan-400/40"
                    }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 hover:opacity-90 py-2 rounded-xl text-lg disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit ✨"}
        </Button>
      </aside>

      {/* 🕒 Mobile Timer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-center bg-[#0f1b3d]/90 backdrop-blur-md border-b border-white/10 py-4">
        <Clock className="w-5 h-5 text-cyan-300 mr-2" />
        <span className={`font-mono text-md ${timerColor}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* 📱 Floating Tracker Button */}
      <button
        onClick={() => setTrackerOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-30 bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-full shadow-lg text-white hover:opacity-90 transition"
      >
        <ListChecks className="w-6 h-6" />
      </button>

      {/* 📱 Tracker Drawer */}
      <AnimatePresence>
        {trackerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-72 h-full z-40 bg-[#0f1b3d]/95 backdrop-blur-md border-l border-white/10 flex flex-col"
          >
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-cyan-300">Question Tracker</h2>
              <button onClick={() => setTrackerOpen(false)}>
                <X className="w-5 h-5 text-gray-300 hover:text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="grid grid-cols-5 gap-3">
                {questions.map((_, idx) => {
                  const isAnswered = !!answers[questions[idx].id];
                  const isActive = currentIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleScrollToQuestion(idx)}
                      className={`rounded-full w-10 h-10 text-sm font-semibold border transition-all ${isActive
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                          : isAnswered
                            ? "bg-green-500/20 border-green-400 text-green-300"
                            : "bg-white/5 border-white/20 hover:border-cyan-400/40"
                        }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-5 border-t border-white/10 bg-[#0f1b3d]/90">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 hover:opacity-90 py-2 rounded-xl text-lg disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit ✨"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧠 Question Section */}
      <main className="flex-1 flex flex-col justify-between overflow-hidden p-6 lg:p-10 pt-16 lg:pt-10 pb-28 lg:pb-10">
        {/* Progress bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="flex-1 flex justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl"
            >
              <Card className="bg-gradient-to-br from-[#1b1335]/90 via-[#2c1e5c]/90 to-[#3a2780]/90 border border-violet-400/20 p-6 rounded-2xl shadow-lg">
                <p className="font-semibold mb-4 text-lg">
                  Q{currentIndex + 1}. {currentQuestion.question_text}
                </p>
                {currentQuestion.image_url && (
                  <img
                    src={currentQuestion.image_url}
                    alt="question"
                    className="w-full rounded-xl border border-white/10 mb-4"
                  />
                )}
                <div className="space-y-3">
                  {currentQuestion.options.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${answers[currentQuestion.id] === opt.id
                          ? "border-cyan-400 bg-cyan-500/10"
                          : "border-white/10 hover:border-cyan-400/30"
                        }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        checked={answers[currentQuestion.id] === opt.id}
                        onChange={() => handleSelect(currentQuestion.id, opt.id)}
                        className="accent-cyan-400 w-4 h-4"
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="bg-gray-700 hover:bg-gray-600 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 hover:opacity-90"
            >
              {submitting ? "Submitting..." : "Submit ✨"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 flex items-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </main>

      {/* ⚠️ Exit Warning Dialog */}
      <CustomWarningDialog
        open={warningOpen}
        onClose={() => {
          setWarningOpen(false);
          window.history.pushState(null, "", window.location.href);
        }}
        onConfirm={() => {
          setWarningOpen(false);
          handleSubmit();
          setTimeout(() => window.location.reload(), 800);
        }}
      />
    </div>
  );
}
