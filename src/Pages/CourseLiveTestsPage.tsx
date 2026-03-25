import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@/utils/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
  CalendarDays,
  TimerReset,
  AlertCircle,
  PlayCircle,
} from "lucide-react";

/* =========================
   Types
========================= */

// Single live test item coming from public API
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

// API response shape
type PublicLiveTestListResponse = {
  success: boolean;
  message?: string;
  data: PublicLiveTestItem[];
};

// State of a live test based on current time
type WindowState = "upcoming" | "live" | "ended";


export default function CourseLiveTestsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Current course id from route: /my-courses/:id/live-test
  const courseId = Number(id);

  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<PublicLiveTestItem[]>([]);

  // Used for real-time countdown updates
  const [nowMs, setNowMs] = useState(Date.now());

  /* =========================
     Timer tick for countdowns
     Updates every second so
     "Starts In" / "Ends In"
     stays live on screen
  ========================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     Fetch public live tests
     - only published tests come from backend
     - then filter by course_id on frontend
  ========================= */
  useEffect(() => {
    const fetchLiveTests = async () => {
      try {
        setLoading(true);

        const { data } = await apiClient.get<PublicLiveTestListResponse>(
          "/api/live-test/public"
        );

        if (!data?.success) {
          toast.error(data?.message || "Failed to fetch live tests");
          return;
        }

        // Keep only tests for current course
        const filtered = (data.data || []).filter(
          (item) => Number(item.course_id) === Number(courseId)
        );

        setTests(filtered);
      } catch (error: any) {
        console.error(error);
        toast.error(
          error?.response?.data?.message || "Failed to fetch live tests"
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchLiveTests();
    }
  }, [courseId]);

  /* =========================
     Helpers
  ========================= */

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


  // Format seconds into HH:MM:SS
  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Decide whether test is upcoming, live, or ended
  const getWindowState = (test: PublicLiveTestItem): WindowState => {
    const start = test.start_at ? new Date(test.start_at).getTime() : null;
    const end = test.end_at ? new Date(test.end_at).getTime() : null;

    if (end && nowMs >= end) return "ended";
    if (start && nowMs < start) return "upcoming";
    return "live";
  };

  // Returns countdown seconds:
  // - upcoming => time until start
  // - live => time until end
  const getRemainingSeconds = (test: PublicLiveTestItem) => {
    const state = getWindowState(test);
    const start = test.start_at ? new Date(test.start_at).getTime() : null;
    const end = test.end_at ? new Date(test.end_at).getTime() : null;

    if (state === "upcoming" && start) {
      return Math.max(0, Math.floor((start - nowMs) / 1000));
    }

    if (state === "live" && end) {
      return Math.max(0, Math.floor((end - nowMs) / 1000));
    }

    return 0;
  };

  /* =========================
     Hide ended tests from UI
     Backend should already hide them,
     but this gives extra safety
  ========================= */
  const visibleTests = useMemo(
    () => tests.filter((test) => getWindowState(test) !== "ended"),
    [tests, nowMs]
  );

  /* =========================
     Dynamic grid classes
     - 1 card => center in middle
     - 2 cards => center in middle
     - 3+ cards => normal 3-column layout
  ========================= */
  const gridClassName = useMemo(() => {
    if (visibleTests.length === 1) {
      return "grid grid-cols-1 gap-6 mx-auto max-w-md";
    }

    if (visibleTests.length === 2) {
      return "grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto max-w-4xl";
    }

    return "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mx-auto max-w-6xl";
  }, [visibleTests.length]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100 pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:opacity-90 text-sm px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Page heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-3">
            Live Tests
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Live tests for this course will appear here when published. Before the test starts, a countdown will be displayed. When the live window opens, you can start the test.
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-72 rounded-2xl bg-white/10" />
            ))}
          </div>
        ) : visibleTests.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <AlertCircle className="w-10 h-10 mb-3 text-gray-400" />
            <p className="text-sm">No live test available right now.</p>
          </div>
        ) : (
          /* Live test cards */
          <div className={gridClassName}>
            {visibleTests.map((test) => {
              const state = getWindowState(test);
              const remainingSeconds = getRemainingSeconds(test);

              return (
                <Card
                  key={test.id}
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-md"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">
                        {test.title}
                      </h2>
                      <p className="text-sm text-gray-300 line-clamp-3">
                        {test.description || "Scheduled live test."}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-1 rounded-full border ${
                        state === "live"
                          ? "bg-green-500/15 text-green-200 border-green-400/40"
                          : "bg-cyan-500/15 text-cyan-200 border-cyan-400/40"
                      }`}
                    >
                      {state === "live" ? "Live Now" : "Upcoming"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-sm text-gray-300 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-300" />
                      <span>Duration: {test.duration_minutes} min</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-cyan-300" />
                      <span>Starts: {test.start_at ? formatDateTime(test.start_at) : "Not scheduled"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <TimerReset className="w-4 h-4 text-cyan-300" />
                      <span>Ends: {test.end_at ? formatDateTime(test.end_at) : "Not scheduled"}</span>
                    </div>

                    {/* Countdown box */}
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-xs text-gray-400">
                        {state === "upcoming" ? "Starts In" : "Ends In"}
                      </p>
                      <p className="text-lg font-mono text-cyan-300 mt-1">
                        {formatTime(remainingSeconds)}
                      </p>
                    </div>
                  </div>

                  {/* CTA button */}
                  <Button
                    onClick={() => navigate(`/live-test/${test.id}`)}
                    disabled={state !== "live"}
                    className={`w-full rounded-xl px-5 py-3 font-medium ${
                      state === "live"
                        ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:opacity-90"
                        : "bg-gray-600 cursor-not-allowed opacity-80"
                    }`}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {state === "live" ? "Start Live Test" : "Starts Soon"}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}