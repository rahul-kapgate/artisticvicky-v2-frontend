import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@/utils/axiosConfig";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  CalendarDays,
  TimerReset,
  Radio,
  Hourglass,
  Wifi,
  WifiOff,
} from "lucide-react";

/* =========================
   Types
========================= */

type PublicLiveTestItem = {
  id: number;
  title: string;
  description?: string | null;
  course_id: number;
  duration_minutes: number;
  total_questions: number;
  published_at?: string | null;
  start_at?: string | null;
  end_at?: string | null;
};

type PublicLiveTestListResponse = {
  success: boolean;
  message?: string;
  data: PublicLiveTestItem[];
};

type WindowState = "upcoming" | "live" | "ended";

/* =========================
   Helpers
========================= */

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

function formatTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function getCountdownUrgency(sec: number, state: WindowState) {
  if (state === "live") {
    if (sec <= 300)
      return {
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        pulse: true,
      };
    if (sec <= 900)
      return {
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        pulse: false,
      };
    return {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      pulse: false,
    };
  }
  // upcoming: cool cyan
  if (sec <= 3600)
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

/* =========================
   Skeleton Card
========================= */
function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 animate-pulse space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded bg-white/[0.06]" />
          <div className="h-3 w-full rounded bg-white/[0.04]" />
          <div className="h-3 w-2/3 rounded bg-white/[0.04]" />
        </div>
        <div className="h-5 w-16 rounded-full bg-white/[0.06]" />
      </div>
      <div className="space-y-3 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white/[0.06]" />
            <div className="h-3 w-40 rounded bg-white/[0.05]" />
          </div>
        ))}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 mt-1">
          <div className="h-3 w-16 rounded bg-white/[0.05] mb-2" />
          <div className="h-6 w-28 rounded bg-white/[0.06]" />
        </div>
      </div>
      <div className="h-11 w-full rounded-xl bg-white/[0.06]" />
    </div>
  );
}

/* =========================
   Live Badge
========================= */
function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-400/30 font-semibold uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Live Now
    </span>
  );
}

function UpcomingBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border bg-cyan-500/10 text-cyan-300 border-cyan-400/30 font-semibold uppercase tracking-wider">
      <Hourglass className="w-2.5 h-2.5" />
      Upcoming
    </span>
  );
}

/* =========================
   Live Test Card
========================= */
function LiveTestCard({
  test,
  nowMs,
  index,
}: {
  test: PublicLiveTestItem;
  nowMs: number;
  index: number;
}) {
  const navigate = useNavigate();

  const getWindowState = (t: PublicLiveTestItem): WindowState => {
    const start = t.start_at ? new Date(t.start_at).getTime() : null;
    const end = t.end_at ? new Date(t.end_at).getTime() : null;
    if (end && nowMs >= end) return "ended";
    if (start && nowMs < start) return "upcoming";
    return "live";
  };

  const getRemainingSeconds = (t: PublicLiveTestItem) => {
    const state = getWindowState(t);
    const start = t.start_at ? new Date(t.start_at).getTime() : null;
    const end = t.end_at ? new Date(t.end_at).getTime() : null;
    if (state === "upcoming" && start)
      return Math.max(0, Math.floor((start - nowMs) / 1000));
    if (state === "live" && end)
      return Math.max(0, Math.floor((end - nowMs) / 1000));
    return 0;
  };

  const state = getWindowState(test);
  const remainingSeconds = getRemainingSeconds(test);
  const urgency = getCountdownUrgency(remainingSeconds, state);
  const isLive = state === "live";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className={`
        relative rounded-3xl border overflow-hidden
        backdrop-blur-md transition-all duration-300 group
        ${
          isLive
            ? "border-emerald-500/20 bg-gradient-to-br from-emerald-600/[0.07] via-white/[0.02] to-transparent shadow-[0_0_40px_-10px_rgba(52,211,153,0.15)]"
            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14]"
        }
      `}
    >
      {/* Glow accent for live tests */}
      {isLive && (
        <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 rounded-full bg-emerald-500/[0.08] blur-3xl -translate-y-1/2 translate-x-1/2" />
      )}

      {/* Live pulse line at top */}
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isLive ? <LiveBadge /> : <UpcomingBadge />}
            </div>
            <h2 className="text-lg font-semibold text-white mt-2 leading-snug">
              {test.title}
            </h2>
            {test.description && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {test.description}
              </p>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="space-y-2.5 text-sm text-gray-400 mb-5">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-cyan-400/70 shrink-0" />
            <span>
              Duration:{" "}
              <span className="text-gray-200">{test.duration_minutes} min</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-4 h-4 text-cyan-400/70 shrink-0" />
            <span>
              Starts:{" "}
              <span className="text-gray-200">
                {test.start_at
                  ? formatDateTime(test.start_at)
                  : "Not scheduled"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <TimerReset className="w-4 h-4 text-cyan-400/70 shrink-0" />
            <span>
              Ends:{" "}
              <span className="text-gray-200">
                {test.end_at ? formatDateTime(test.end_at) : "Not scheduled"}
              </span>
            </span>
          </div>
        </div>

        {/* Countdown box */}
        <div
          className={`rounded-2xl border px-4 py-3 mb-5 ${urgency.bg} ${urgency.border}`}
        >
          <p className="text-[11px] text-gray-500 mb-1 uppercase tracking-wider font-medium">
            {isLive ? "Ends In" : "Starts In"}
          </p>
          <p
            className={`text-2xl font-mono font-semibold tabular-nums ${urgency.color} ${urgency.pulse ? "animate-pulse" : ""}`}
          >
            {formatTime(remainingSeconds)}
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate(`/live-test/${test.id}`)}
          disabled={!isLive}
          className={`
            w-full rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2
            transition-all duration-200
            ${
              isLive
                ? "bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:-translate-y-0.5"
                : "bg-white/[0.04] border border-white/[0.08] text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {isLive ? (
            <>
              <Radio className="w-4 h-4" />
              Enter Live Test
            </>
          ) : (
            <>
              <Hourglass className="w-4 h-4" />
              Starts Soon
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

/* =========================
   Empty state
========================= */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-5">
        <WifiOff className="w-7 h-7 text-gray-600" />
      </div>
      <p className="text-gray-300 font-medium mb-2">No Live Tests Right Now</p>
      <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
        Check back when a test is scheduled. You'll see a live countdown here
        once one is published.
      </p>
    </motion.div>
  );
}

/* =========================
   Main Page
========================= */
export default function CourseLiveTestsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const courseId = Number(id);

  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<PublicLiveTestItem[]>([]);
  const [nowMs, setNowMs] = useState(Date.now());

  // Real-time clock tick
  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch
  useEffect(() => {
    if (!courseId) return;
    const fetchLiveTests = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get<PublicLiveTestListResponse>(
          "/api/live-test/public",
        );
        if (!data?.success) {
          toast.error(data?.message || "Failed to fetch live tests");
          return;
        }
        const filtered = (data.data || []).filter(
          (item) => Number(item.course_id) === courseId,
        );
        setTests(filtered);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch live tests",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLiveTests();
  }, [courseId]);

  const getWindowState = useCallback(
    (test: PublicLiveTestItem): WindowState => {
      const start = test.start_at ? new Date(test.start_at).getTime() : null;
      const end = test.end_at ? new Date(test.end_at).getTime() : null;
      if (end && nowMs >= end) return "ended";
      if (start && nowMs < start) return "upcoming";
      return "live";
    },
    [nowMs],
  );

  const visibleTests = useMemo(
    () => tests.filter((t) => getWindowState(t) !== "ended"),
    [tests, getWindowState],
  );

  const liveCount = useMemo(
    () => visibleTests.filter((t) => getWindowState(t) === "live").length,
    [visibleTests, getWindowState],
  );

  const gridClassName = useMemo(() => {
    if (visibleTests.length === 1)
      return "grid grid-cols-1 gap-6 max-w-md mx-auto";
    if (visibleTests.length === 2)
      return "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto";
    return "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6";
  }, [visibleTests.length]);

  return (
    <section className="relative min-h-screen bg-[#07090f] text-gray-100 pt-24 pb-20 px-6 overflow-hidden">
      {/* === Atmospheric background (borrowed from CourseLearning) === */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 15% 0%, rgba(56,189,248,0.08), transparent 55%), radial-gradient(ellipse 50% 40% at 85% 10%, rgba(52,211,153,0.06), transparent 55%), radial-gradient(ellipse 100% 60% at 50% 100%, rgba(20,30,90,0.4), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-300 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/[0.1] group-hover:border-cyan-400/40 group-hover:bg-cyan-400/5 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back</span>
          </button>
        </motion.div>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-center mb-12"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/5 mb-4">
            <Wifi className="w-3 h-3 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
              Live Tests
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-tight">
            Live Exams
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Scheduled live tests appear here when published. A real-time
            countdown is shown before start. Join the test only while the live
            window is open.
          </p>

          {/* Live count pill */}
          {!loading && liveCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/25 text-emerald-300 text-xs font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {liveCount} test{liveCount > 1 ? "s" : ""} live right now
            </motion.div>
          )}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : visibleTests.length === 0 ? (
            <EmptyState key="empty" />
          ) : (
            <motion.div
              key="tests"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={gridClassName}
            >
              {visibleTests.map((test, i) => (
                <LiveTestCard
                  key={test.id}
                  test={test}
                  nowMs={nowMs}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
