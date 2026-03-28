import { useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  Clock,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  X,
  Info,
  AlertTriangle,
  ArrowLeftSquare,
  CheckCircle2,
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
  question_text: string;
  options: Option[];
  difficulty?: string;
  image_url: string | null;
}

interface SubmitAnswer {
  question_id: number;
  selected_option_id: number;
}

interface PublicLiveTestItem {
  id: number;
  title: string;
  description?: string | null;
  course_id: number;
  duration_minutes: number;
  total_questions: number;
  published_at?: string | null;
  start_at?: string | null;
  end_at?: string | null;
}

interface PublicLiveTestListResponse {
  success: boolean;
  message?: string;
  data: PublicLiveTestItem[];
}

interface LiveTestSessionData {
  attempt_id: number;
  server_now: string;
  started_at: string;
  expires_at: string;
  remaining_seconds: number;
  status: "in_progress" | "submitted" | "auto_submitted" | "expired";
  answers?: SubmitAnswer[];
  test: {
    id: number;
    title: string;
    description?: string | null;
    duration_minutes: number;
    total_questions: number;
    start_at?: string | null;
    end_at?: string | null;
    questions: Question[];
  };
}

interface LiveTestSessionResponse {
  success: boolean;
  message: string;
  data: LiveTestSessionData;
}

interface SubmitLiveTestResponse {
  success: boolean;
  message: string;
  data?: {
    attempt_id: number;
    submitted_at: string;
  };
}

type IntroState = "upcoming" | "live" | "ended";

export default function LiveTestPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [meta, setMeta] = useState<PublicLiveTestItem | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(
    "Your response has been submitted successfully.",
  );

  const [timeLeft, setTimeLeft] = useState(0);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [serverOffsetMs, setServerOffsetMs] = useState(0);
  const [introNowMs, setIntroNowMs] = useState(Date.now());

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSubmitTriggeredRef = useRef(false);
  const answersRef = useRef<Record<number, number>>({});

  const attemptedCount = useMemo(() => Object.keys(answers).length, [answers]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const applySessionData = (session: LiveTestSessionData) => {
    setQuestions(session.test.questions || []);
    setMeta({
      id: session.test.id,
      title: session.test.title,
      description: session.test.description,
      duration_minutes: session.test.duration_minutes,
      total_questions: session.test.total_questions,
      start_at: session.test.start_at,
      end_at: session.test.end_at,
      course_id: 0,
    });

    const restoredAnswers: Record<number, number> = {};
    (session.answers || []).forEach((item) => {
      restoredAnswers[item.question_id] = item.selected_option_id;
    });

    setAnswers(restoredAnswers);
    answersRef.current = restoredAnswers;

    setExpiresAt(session.expires_at);
    setTimeLeft(session.remaining_seconds || 0);
    setServerOffsetMs(
      new Date(session.server_now).getTime() - new Date().getTime(),
    );
  };

  const fetchPublicMeta = async () => {
    if (!id) return;

    const { data } = await apiClient.get<PublicLiveTestListResponse>(
      "/api/live-test/public",
    );

    if (!data?.success) {
      throw new Error(data?.message || "Failed to load live test");
    }

    const found = (data.data || []).find(
      (item) => Number(item.id) === Number(id),
    );

    if (!found) {
      throw new Error("Live test not found");
    }

    setMeta(found);
  };

  useEffect(() => {
    const fetchInitialState = async () => {
      if (!id) {
        setFetchError("Invalid live test id.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        try {
          const { data } = await apiClient.get<LiveTestSessionResponse>(
            `/api/live-test/${id}/session`,
          );

          if (data?.success) {
            applySessionData(data.data);

            if (
              data.data.status === "submitted" ||
              data.data.status === "auto_submitted"
            ) {
              setSubmitted(true);
              setSubmitMessage(
                "You have already submitted this live test. Results will be announced shortly.",
              );
            } else if (data.data.status === "expired") {
              setSubmitted(true);
              setSubmitMessage(
                "This live test session has expired. Results will be announced shortly.",
              );
            } else {
              setTestStarted(true);
            }

            setFetchError(null);
            setLoading(false);
            return;
          }
        } catch (error: any) {
          const status = error?.response?.status;
          if (status !== 404) throw error;
        }

        await fetchPublicMeta();
        setFetchError(null);
      } catch (error: any) {
        console.error(error);
        setFetchError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load live test.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInitialState();
  }, [id]);

  useEffect(() => {
    if (testStarted || submitted || !meta) return;

    const interval = setInterval(() => {
      setIntroNowMs(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [testStarted, submitted, meta]);

  useEffect(() => {
    if (!testStarted || !expiresAt || submitted) return;

    const tick = () => {
      const serverNow = Date.now() + serverOffsetMs;
      const diff = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - serverNow) / 1000),
      );

      setTimeLeft(diff);

      if (diff <= 0 && !autoSubmitTriggeredRef.current) {
        autoSubmitTriggeredRef.current = true;
        handleSubmit(true);
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testStarted, expiresAt, serverOffsetMs, submitted]);

  useEffect(() => {
    if (!testStarted || submitted) return;

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
  }, [testStarted, submitted]);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Format date/time nicely for UI
  function formatDateTime(dateString?: string | null) {
    if (!dateString) return "--";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "--";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${day}/${month}/${year}, ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  }

  const startAtMs = meta?.start_at ? new Date(meta.start_at).getTime() : null;
  const endAtMs = meta?.end_at ? new Date(meta.end_at).getTime() : null;

  const introState: IntroState = useMemo(() => {
    if (endAtMs && introNowMs >= endAtMs) return "ended";
    if (startAtMs && introNowMs < startAtMs) return "upcoming";
    return "live";
  }, [startAtMs, endAtMs, introNowMs]);

  const introCountdownSeconds = useMemo(() => {
    if (introState === "upcoming" && startAtMs) {
      return Math.max(0, Math.floor((startAtMs - introNowMs) / 1000));
    }

    if (introState === "live" && endAtMs) {
      return Math.max(0, Math.floor((endAtMs - introNowMs) / 1000));
    }

    return 0;
  }, [introState, startAtMs, endAtMs, introNowMs]);

  const handleSelect = (questionId: number, optionId: number) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: optionId };
      answersRef.current = next;
      return next;
    });
  };

  const handleScrollToQuestion = (index: number) => {
    setCurrentIndex(index);
    setTrackerOpen(false);
  };

  const handleStartTest = async () => {
    if (!id) return;

    try {
      setStarting(true);

      const { data } = await apiClient.post<LiveTestSessionResponse>(
        `/api/live-test/${id}/start`,
      );

      if (!data?.success) {
        toast.error(data?.message || "Failed to start live test");
        return;
      }

      applySessionData(data.data);
      setTestStarted(true);
      setConfirmOpen(false);
      setCurrentIndex(0);
      autoSubmitTriggeredRef.current = false;
      toast.success("Live test started successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to start live test",
      );
    } finally {
      setStarting(false);
    }
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!id || submitting) return;

    setSubmitting(true);

    try {
      const formattedAnswers: SubmitAnswer[] = Object.entries(
        answersRef.current,
      ).map(([question_id, selected_option_id]) => ({
        question_id: Number(question_id),
        selected_option_id: Number(selected_option_id),
      }));

      const { data } = await apiClient.post<SubmitLiveTestResponse>(
        `/api/live-test/${id}/submit`,
        { answers: formattedAnswers },
      );

      if (!data?.success) {
        toast.error(data?.message || "Failed to submit live test");
        return;
      }

      if (timerRef.current) clearInterval(timerRef.current);

      setSubmitted(true);
      setTestStarted(false);
      setSubmitMessage(
        data.message ||
          (isAutoSubmit
            ? "Time expired. Your live test was auto-submitted."
            : "Your live test has been submitted successfully."),
      );

      toast.success(
        isAutoSubmit ? "Time expired. Auto-submitted." : "Live test submitted!",
      );
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to submit live test.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const timerColor =
    timeLeft <= 300
      ? "text-red-400"
      : timeLeft <= 900
        ? "text-yellow-400"
        : "text-cyan-300";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f1b3d] via-[#152a52] to-[#1a237e] px-4">
        <Loader2 className="w-10 h-10 text-cyan-300 animate-spin mb-4" />
        <p className="text-gray-300">Loading live test...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f1b3d] via-[#152a52] to-[#1a237e] text-gray-100 px-4 py-10">
        <div className="max-w-xl w-full bg-[#0f1b3d]/70 border border-white/10 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h1 className="text-2xl font-semibold mb-2">
            Unable to load live test
          </h1>
          <p className="text-gray-300 mb-6">{fetchError}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate(-1)}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Go Back
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:opacity-90"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-[#0f1b3d] via-[#152a52] to-[#1a237e] text-gray-100 px-4">
        <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
        <h1 className="text-3xl font-bold mb-3">Live Test Submitted</h1>
        <p className="text-lg text-gray-200 max-w-2xl mb-2">{submitMessage}</p>
        <p className="text-sm text-gray-400 mb-8">
          Results will be announced shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md mx-auto">
          <Button
            onClick={() => navigate(-1)}
            className="flex-1 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-700 hover:opacity-90 rounded-xl px-6 py-3 text-sm sm:text-base"
          >
            <ArrowLeftSquare />
            Back
          </Button>

          <Button
            onClick={() => navigate("/")}
            className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:opacity-90 rounded-xl px-6 py-3 text-sm sm:text-base"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f1b3d] via-[#152a52] to-[#1a237e] text-gray-100 px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="fixed top-5 left-5 flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/20 hover:bg-white/20"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="max-w-3xl w-full bg-[#0f1b3d]/70 border border-white/10 rounded-2xl p-8">
          {!meta ? (
            <Skeleton className="w-full h-56 bg-white/10 rounded-xl" />
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Info className="w-8 h-8 text-cyan-400" />
                    <h1 className="text-3xl font-bold text-cyan-300">
                      {meta.title}
                    </h1>
                  </div>
                  <p className="text-gray-300">
                    {meta.description || "Live test instructions and schedule."}
                  </p>
                </div>
              </div>

              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-gray-400 mb-1">
                  {introState === "upcoming"
                    ? "Starts In"
                    : introState === "live"
                      ? "Ends In"
                      : "Status"}
                </p>

                {introState === "ended" ? (
                  <p className="text-lg font-semibold text-red-300">
                    This live test has already ended.
                  </p>
                ) : (
                  <p className="text-2xl font-mono text-cyan-300">
                    {formatTime(introCountdownSeconds)}
                  </p>
                )}
              </div>

              <ul className="list-disc list-inside space-y-3 text-gray-200 text-[15px] leading-relaxed mb-8">
                <li>
                  The timer is controlled by the <strong>server</strong>.
                </li>
                <li>You cannot start before the scheduled start time.</li>
                <li>
                  The test automatically closes at the scheduled end time.
                </li>
                <li>
                  Your test can auto-submit when the server-side time expires.
                </li>
                <li>
                  Results will be announced shortly <strong>shortly</strong>.
                </li>
              </ul>

              {introState === "upcoming" && (
                <div className="mb-6 rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-4 py-3 text-yellow-200 text-sm">
                  This live test has not started yet. Start time:{" "}
                  <span className="font-semibold">
                    {formatDateTime(meta.start_at)}
                  </span>
                </div>
              )}

              {introState === "live" && (
                <div className="mb-6 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-green-200 text-sm">
                  This live test is now active. You can start it before{" "}
                  <span className="font-semibold">
                    {formatDateTime(meta.end_at)}
                  </span>
                  .
                </div>
              )}

              <Button
                onClick={() => setConfirmOpen(true)}
                disabled={starting || introState !== "live"}
                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:opacity-90 rounded-xl px-8 py-3 text-lg text-white shadow-lg disabled:opacity-50"
              >
                {starting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : introState === "upcoming" ? (
                  "Starts Soon"
                ) : introState === "ended" ? (
                  "Live Test Ended"
                ) : (
                  "Start Live Test 🚀"
                )}
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
                Once started, the server timer cannot be paused and the test
                will close at the scheduled end time.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleStartTest}
                disabled={starting}
                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:opacity-90 rounded-lg px-5"
              >
                {starting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Yes, Start Now"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#10194f] to-[#1a237e]">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-yellow-300 mx-auto mb-3" />
          <p className="text-gray-200">
            No questions available for this live test.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-row-reverse bg-gradient-to-b from-[#10194f] via-[#132060] to-[#1a237e] text-gray-100 relative">
      <aside className="hidden lg:flex flex-col justify-between w-72 bg-[#0f1b3d]/70 backdrop-blur-md border-l border-white/10 p-5 sticky top-0 h-screen">
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-center text-cyan-300">
            Question Tracker
          </h2>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5" />
            <span className={`font-mono text-lg ${timerColor}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <p className="text-center text-xs text-gray-400 mb-6">
            Attempted: {attemptedCount} / {questions.length}
          </p>

          <div className="grid grid-cols-5 gap-3">
            {questions.map((_, idx) => {
              const isAnswered = !!answers[questions[idx].id];
              const isActive = currentIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleScrollToQuestion(idx)}
                  className={`rounded-full w-10 h-10 text-sm font-semibold border transition-all duration-200 ${
                    isActive
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
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="mt-6 w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 hover:opacity-90 py-2 rounded-xl text-lg disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit ✨"}
        </Button>
      </aside>

      <button
        onClick={() => setTrackerOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-30 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 rounded-full shadow-lg text-white hover:opacity-90 transition flex items-center gap-2"
      >
        <ListChecks className="w-5 h-5" />
      </button>

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
              <h2 className="text-xl font-semibold text-cyan-300">
                Question Tracker
              </h2>
              <button onClick={() => setTrackerOpen(false)}>
                <X className="w-5 h-5 text-gray-300 hover:text-white" />
              </button>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className={`font-mono text-lg ${timerColor}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {attemptedCount}/{questions.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-5 gap-3">
                {questions.map((_, idx) => {
                  const isAnswered = !!answers[questions[idx].id];
                  const isActive = currentIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleScrollToQuestion(idx)}
                      className={`rounded-full w-10 h-10 text-sm font-semibold border transition-all ${
                        isActive
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
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 hover:opacity-90 py-2 rounded-xl text-lg disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit ✨"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col justify-between overflow-hidden p-6 lg:p-10 pt-16 lg:pt-10 pb-28 lg:pb-10">
        <div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between mb-4 lg:hidden">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className={`font-mono text-base ${timerColor}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {attemptedCount}/{questions.length} answered
            </span>
          </div>
        </div>

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
                <div className="flex items-start justify-between gap-4 mb-4">
                  <p className="font-semibold text-lg">
                    Q {currentIndex + 1}. {currentQuestion.question_text}
                  </p>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-200 border border-cyan-400/20 whitespace-nowrap">
                    {currentIndex + 1}/{questions.length}
                  </span>
                </div>

                {currentQuestion.image_url && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={currentQuestion.image_url}
                      alt="question"
                      className="lg:w-[50%] rounded-xl border border-white/10"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  {currentQuestion.options.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        answers[currentQuestion.id] === opt.id
                          ? "border-cyan-400 bg-cyan-500/10"
                          : "border-white/10 hover:border-cyan-400/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        checked={answers[currentQuestion.id] === opt.id}
                        onChange={() =>
                          handleSelect(currentQuestion.id, opt.id)
                        }
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
              onClick={() => handleSubmit(false)}
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

      <CustomWarningDialog
        open={warningOpen}
        onClose={() => {
          setWarningOpen(false);
          window.history.pushState(null, "", window.location.href);
        }}
        onConfirm={() => {
          setWarningOpen(false);
          handleSubmit(false);
        }}
      />
    </div>
  );
}
