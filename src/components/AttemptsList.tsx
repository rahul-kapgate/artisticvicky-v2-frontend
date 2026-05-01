import { useEffect, useState } from "react";
import { apiClient } from "@/utils/axiosConfig";
import {
  Trophy,
  BookOpen,
  Calendar,
  Filter,
  ListChecks,
  AlertTriangle,
  ChevronRight,
  History,
  ClipboardCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* =========================
   Types
========================= */

interface Attempt {
  id: number;
  student_id: number;
  course_id?: number;
  paper_id?: number;
  answers: { question_id: number; selected_option_id: number }[];
  score: number;
  submitted_at: string;
  courses?: { course_name: string };
  pyq_papers?: { year: number; course_id: number };
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Attempt[];
}

interface AttemptsListProps {
  studentId: number;
  type: "mock" | "pyq";
}

/* =========================
   Score helpers
========================= */

function getScoreStyle(score: number, total: number) {
  const pct = total > 0 ? (score / total) * 100 : 0;
  if (pct >= 70)
    return {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    };
  if (pct >= 40)
    return {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    };
  return {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  };
}

/* =========================
   Skeleton row
========================= */

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-2/3 rounded bg-white/[0.07]" />
          <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
        </div>
        <div className="h-9 w-14 rounded-xl bg-white/[0.06]" />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <div className="h-3 w-4 rounded bg-white/[0.05]" />
        <div className="h-3 w-32 rounded bg-white/[0.05]" />
      </div>
    </div>
  );
}

/* =========================
   Attempt Card
========================= */

function AttemptCard({
  attempt,
  isPyq,
  navigateBase,
  index,
}: {
  attempt: Attempt;
  isPyq: boolean;
  navigateBase: string;
  index: number;
}) {
  const navigate = useNavigate();
  const total = attempt.answers.length;
  const scoreStyle = getScoreStyle(attempt.score, total);
  const pct = total > 0 ? Math.round((attempt.score / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      onClick={() => navigate(`${navigateBase}/${attempt.id}`)}
      className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-md
                 hover:border-cyan-400/25 hover:bg-white/[0.04] hover:-translate-y-0.5
                 transition-all duration-200 cursor-pointer overflow-hidden p-5"
    >
      {/* Hover accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent group-hover:via-cyan-400/40 transition-all duration-300" />

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-2 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">
              {isPyq
                ? `PYQ ${attempt.pyq_papers?.year || "Unknown"}`
                : "MAH AAC CET — Mock Test"}
            </span>
          </h3>
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-gray-600 shrink-0" />
            {new Date(attempt.submitted_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        {/* Score badge */}
        <div
          className={`shrink-0 flex flex-col items-center justify-center rounded-xl px-3 py-1.5 border ${scoreStyle.bg} ${scoreStyle.border}`}
        >
          <div className="flex items-center gap-1">
            <Trophy className={`w-3 h-3 ${scoreStyle.color}`} />
            <span
              className={`text-base font-bold tabular-nums ${scoreStyle.color}`}
            >
              {attempt.score}
            </span>
          </div>
          <span className="text-[10px] text-gray-500">{pct}%</span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <ListChecks className="w-3.5 h-3.5 text-emerald-500/70" />
          <span>{total} questions attempted</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
    </motion.div>
  );
}

/* =========================
   Filter Bar
========================= */

function FilterBar({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onFilter,
}: {
  startDate: string;
  endDate: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onFilter: (e: React.FormEvent) => void;
}) {
  return (
    <form
      onSubmit={onFilter}
      className="flex flex-wrap items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2"
    >
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartChange(e.target.value)}
        className="bg-transparent border border-white/[0.08] rounded-lg px-3 py-1.5 text-gray-300 text-xs focus:ring-1 focus:ring-cyan-400/40 outline-none w-36"
      />
      <span className="text-gray-600 text-xs">→</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndChange(e.target.value)}
        className="bg-transparent border border-white/[0.08] rounded-lg px-3 py-1.5 text-gray-300 text-xs focus:ring-1 focus:ring-purple-400/40 outline-none w-36"
      />
      <Button
        type="submit"
        size="sm"
        className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-xs px-3 py-1.5 h-auto font-medium"
      >
        <Filter className="w-3 h-3" />
        Filter
      </Button>
    </form>
  );
}

/* =========================
   Main Component
========================= */

export default function AttemptsList({ studentId, type }: AttemptsListProps) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const isPyq = type === "pyq";
  const endpoint = isPyq
    ? "/api/pyq-mock-test/attempts"
    : "/api/mock-test/attempts";
  const navigateBase = isPyq ? "/pyq-mock-test/result" : "/mock-test/result";

  const fetchAttempts = async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    try {
      let url = `${endpoint}/${studentId}`;
      const params: string[] = [];
      if (startDate) params.push(`start_date=${startDate}`);
      if (endDate) params.push(`end_date=${endDate}`);
      if (params.length) url += `?${params.join("&")}`;

      const res = await apiClient.get<ApiResponse>(url);
      if (res.data?.success && res.data.data) {
        setAttempts(res.data.data);
      } else {
        setError("No attempts found.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch attempts.";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Set default date range: last 10 days
  useEffect(() => {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 10);
    setStartDate(past.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    fetchAttempts();
  }, [studentId]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAttempts();
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-5">
          <div className="h-5 w-44 rounded bg-white/[0.07] animate-pulse" />
          <div className="h-8 w-64 rounded-xl bg-white/[0.04] animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 flex items-center gap-2 text-red-400 text-sm">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        {error}
      </div>
    );
  }

  if (attempts.length === 0) return null;

  const Icon = isPyq ? History : ClipboardCheck;
  const title = isPyq ? "PYQ Attempts" : "Mock Test Attempts";

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-semibold text-gray-100">{title}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-gray-400">
            {attempts.length}
          </span>
        </div>

        <FilterBar
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          onFilter={handleFilter}
        />
      </div>

      {/* Grid */}
      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {attempts.map((attempt, i) => (
            <AttemptCard
              key={attempt.id}
              attempt={attempt}
              isPyq={isPyq}
              navigateBase={navigateBase}
              index={i}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}

