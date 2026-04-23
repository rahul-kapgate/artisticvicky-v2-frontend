import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import { apiClient } from "@/utils/axiosConfig";
import {
  Calendar,
  Clock,
  Globe,
  Users,
  Star,
  Video,
  ExternalLink,
  CheckCircle2,
  BarChart3,
  Play,
  Presentation,
  Wifi,
  WifiOff,
  Timer,
  GraduationCap,
  Zap,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import Login from "@/components/Login";
import Register from "@/components/Register";
import CourseApprovedReviews from "@/components/CourseApprovedReviews";

/* ─────────────────────────── Types ─────────────────────────── */

type MasterclassDetails = {
  id: number;
  course_id: number;
  masterclass_start_at: string;
  masterclass_end_at: string;
  meeting_provider: "zoom" | "google_meet" | "custom" | null;
  meeting_url: string | null;
  meeting_visible_before_minutes: number;
  approval_required: boolean;
  ppt_file_url: string | null;
  ppt_file_name: string | null;
  masterclass_status: "draft" | "published" | "completed" | "cancelled";
  recording_link?: string | null;
  created_at: string;
  updated_at: string;
};

type MasterclassCourse = {
  id: number;
  course_name: string;
  description: string;
  price: number;
  price_without_discount?: number;
  image?: string;
  category?: string;
  level?: string | null;
  language?: string;
  duration?: string;
  students_enrolled?: number[];
  rating?: number;
  tags?: string[];
  created_at?: string;
  course_type: "masterclass";
  masterclass_details: MasterclassDetails | null;
};

/* ─────────────────────────── Helpers ─────────────────────────── */


const formatTime = (value?: string | null) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatProvider = (value?: string | null) => {
  if (!value) return "N/A";
  if (value === "google_meet") return "Google Meet";
  if (value === "zoom") return "Zoom";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const getMasterclassStatus = (mc: MasterclassDetails | null) => {
  if (!mc) return "unknown";
  const now = Date.now();
  const start = new Date(mc.masterclass_start_at).getTime();
  const end = new Date(mc.masterclass_end_at).getTime();
  if (mc.masterclass_status === "completed") return "completed";
  if (mc.masterclass_status === "cancelled") return "cancelled";
  if (now >= start && now <= end) return "live";
  if (now < start) return "upcoming";
  return "completed";
};

const STATUS_CONFIG = {
  live: {
    label: "🔴 Live Now",
    bg: "bg-red-500/20 border-red-400/30 text-red-300",
  },
  upcoming: {
    label: "🟡 Upcoming",
    bg: "bg-yellow-500/20 border-yellow-400/30 text-yellow-300",
  },
  completed: {
    label: "✅ Completed",
    bg: "bg-emerald-500/20 border-emerald-400/30 text-emerald-300",
  },
  cancelled: {
    label: "❌ Cancelled",
    bg: "bg-gray-500/20 border-gray-400/30 text-gray-300",
  },
  unknown: { label: "—", bg: "bg-white/10 border-white/10 text-gray-300" },
};

/* ─────────────────────────── Countdown ─────────────────────────── */

function useCountdown(targetDate?: string | null) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        expired: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

/* ─────────────────────────── Component ─────────────────────────── */

export default function MasterClassDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState<MasterclassCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { user } = useContext(AuthContext);

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const currentUser = user || storedUser;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/api/course/${id}`);
        const fetched: MasterclassCourse = data?.data;
        setCourse(fetched);
        const enrolled = fetched?.students_enrolled || [];
        setIsEnrolled(
          !!currentUser?.id && enrolled.includes(Number(currentUser.id)),
        );
      } catch {
        setError("Failed to load masterclass details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id, currentUser?.id]);

  const masterclass = course?.masterclass_details ?? null;
  const status = getMasterclassStatus(masterclass);
  const statusCfg = STATUS_CONFIG[status];
  const countdown = useCountdown(
    status === "upcoming" ? masterclass?.masterclass_start_at : null,
  );

  const isMeetingVisible = () => {
    if (!masterclass?.masterclass_start_at || !masterclass?.masterclass_end_at)
      return false;
    const now = Date.now();
    const start = new Date(masterclass.masterclass_start_at).getTime();
    const end = new Date(masterclass.masterclass_end_at).getTime();
    const visibleAt =
      start - (masterclass.meeting_visible_before_minutes ?? 15) * 60000;
    return now >= visibleAt && now <= end;
  };

  const showMeetingLink =
    isEnrolled && isMeetingVisible() && masterclass?.meeting_url;
  const showRecording =
    isEnrolled && status === "completed" && !!masterclass?.recording_link;
  const showPpt =
    isEnrolled && status === "completed" && !!masterclass?.ppt_file_url;

  const discount =
    course?.price_without_discount &&
    course.price_without_discount > (course.price || 0)
      ? Math.round(
          ((course.price_without_discount - course.price) /
            course.price_without_discount) *
            100,
        )
      : null;

  const openWhatsApp = () => {
    if (!course) return;
    const msg = `Hi, I am interested in the Masterclass "${course.course_name}".\nPrice: ₹${course.price}`;
    window.open(
      `https://wa.me/9325217691?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const handleBook = () => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }
    if (isEnrolled) return;
    openWhatsApp();
  };

  const handleJoin = () => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }
    if (masterclass?.meeting_url)
      window.open(`https://${masterclass.meeting_url}`, "_blank");
  };

  const createdDate = course?.created_at
    ? new Date(course.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a237e] text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse space-y-4">
          <div className="h-64 rounded-2xl bg-white/10" />
          <div className="h-8 w-2/3 rounded bg-white/10" />
          <div className="h-4 w-full rounded bg-white/10" />
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-400 mt-20">{error}</p>;
  if (!course)
    return (
      <p className="text-center text-gray-300 mt-20">Masterclass not found.</p>
    );

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1b3d] to-[#1a237e] text-gray-100">
      {/* ── Hero ── */}
      <div className="relative w-full h-[240px] sm:h-[360px] md:h-[420px] overflow-hidden">
        <img
          src={course.image || ""}
          alt={course.course_name}
          className="w-full h-full object-cover brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/50 to-transparent" />

        {/* Live badge */}
        {status === "live" && (
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 bg-red-500/30 border border-red-400/40 backdrop-blur-sm text-red-200 px-3 py-1.5 rounded-full text-sm font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            Live Now
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6 sm:pb-10 max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-block bg-violet-500/25 border border-violet-400/30 text-violet-200 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
              Live Masterclass
            </span>
            <span
              className={`inline-flex items-center border text-xs font-semibold px-3 py-1 rounded-full ${statusCfg.bg}`}
            >
              {statusCfg.label}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight max-w-3xl mb-2">
            {course.course_name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            {course.rating ? (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-yellow-300">
                  {course.rating}
                </span>
              </span>
            ) : null}
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-violet-400" />
              {course.students_enrolled?.length ?? 0} registered
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-violet-400" />
              {formatDate(masterclass?.masterclass_start_at)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Countdown — only if upcoming */}
          {status === "upcoming" && !countdown.expired && (
            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Timer className="w-5 h-5 text-violet-300" />
                <span className="text-sm font-semibold text-violet-200 uppercase tracking-wide">
                  Session starts in
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Days", value: countdown.days },
                  { label: "Hours", value: countdown.hours },
                  { label: "Minutes", value: countdown.minutes },
                  { label: "Seconds", value: countdown.seconds },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-white/10 border border-white/10 p-3 text-center"
                  >
                    <p className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
                      {String(value).padStart(2, "0")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-400" />
              Session Schedule
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ScheduleBlock
                icon={<Calendar className="w-4 h-4 text-violet-400" />}
                label="Date"
                value={formatDate(masterclass?.masterclass_start_at)}
              />
              <ScheduleBlock
                icon={<Clock className="w-4 h-4 text-violet-400" />}
                label="Time"
                value={`${formatTime(masterclass?.masterclass_start_at)} – ${formatTime(masterclass?.masterclass_end_at)}`}
              />
              <ScheduleBlock
                icon={<Video className="w-4 h-4 text-violet-400" />}
                label="Platform"
                value={formatProvider(masterclass?.meeting_provider)}
              />
              <ScheduleBlock
                icon={<Wifi className="w-4 h-4 text-violet-400" />}
                label="Status"
                value={statusCfg.label}
              />
            </div>
          </div>

          {/* What's included */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-400" />
              What's Included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Live interactive session with the instructor",
                "In-depth 2D Design & Perspective coverage",
                "Get your drawings reviewed live",
                "Access to all previous class recordings",
                "Personalized feedback & doubt resolution",
                "Post-session recording access",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-200 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-3">
              About this Masterclass
            </h2>
            <div className="space-y-2">
              {course.description
                .split(/\r?\n/)
                .filter(Boolean)
                .map((line, i) => (
                  <p key={i} className="text-gray-300 text-sm leading-relaxed">
                    {line}
                  </p>
                ))}
            </div>
          </div>

          {/* Meeting link — enrolled + visible */}
          {showMeetingLink && (
            <div className="rounded-2xl border border-green-400/25 bg-green-500/10 backdrop-blur-sm p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-green-500/20 border border-green-400/20 p-3">
                  <Wifi className="w-6 h-6 text-green-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-green-300 mb-1">
                    Your Meeting Link is Ready!
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                    The session is starting soon. Click below to join.
                  </p>
                  <button
                    onClick={handleJoin}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition active:scale-[0.98]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Join on {formatProvider(masterclass?.meeting_provider)}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Not enrolled — meeting link hidden */}
          {!isEnrolled && status !== "completed" && status !== "cancelled" && (
            <div className="rounded-2xl border border-orange-400/20 bg-orange-500/8 p-5 flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-orange-300 shrink-0" />
              <p className="text-sm text-orange-200">
                Book your seat to receive the meeting link before the session
                starts.
              </p>
            </div>
          )}

          {/* Recording — after completion */}
          {showRecording && (
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/8 backdrop-blur-sm p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-cyan-500/20 border border-cyan-400/20 p-3">
                  <Play className="w-6 h-6 text-cyan-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-cyan-300 mb-1">
                    Session Recording
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                    The masterclass is completed. Watch the full recording
                    below.
                  </p>
                  <a
                    href={masterclass?.recording_link!}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition active:scale-[0.98]"
                  >
                    <Play className="w-4 h-4" />
                    Watch Recording
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* PPT */}
          {showPpt && (
            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/8 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-violet-500/20 border border-violet-400/20 p-3">
                  <Presentation className="w-6 h-6 text-violet-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-violet-300 mb-1">
                    Masterclass Slides
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Access the presentation shared during this session.
                  </p>
                  <a
                    href={masterclass?.ppt_file_url!}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition active:scale-[0.98]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {masterclass?.ppt_file_name || "Open Slides"}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          <CourseApprovedReviews courseId={Number(course.id)} />

          {/* Instructor */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-violet-400" />
              Your Mentor
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-blue-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
                V
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Vicky Sir</h3>
                <p className="text-violet-300 text-sm mb-2">
                  MAH AAC CET Expert & BFA Coach
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" /> 5.0 Rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-violet-400" /> 500+
                    Students
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Expert MAH AAC CET coach helping students unlock their
                  creative potential and secure BFA admissions across
                  Maharashtra's top visual arts colleges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4 order-first lg:order-last">
          {/* Price + CTA */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-4">
            {!isEnrolled && (
              <div className="text-center">
                <div className="flex items-end justify-center gap-3">
                  <span className="text-4xl font-extrabold text-emerald-400">
                    ₹{course.price}
                  </span>
                  {course.price_without_discount &&
                    course.price_without_discount > course.price && (
                      <span className="text-xl text-red-400 line-through pb-0.5">
                        ₹{course.price_without_discount}
                      </span>
                    )}
                </div>
                {discount && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-400/20 px-3 py-1 text-sm text-emerald-200">
                    <span className="font-semibold">Save {discount}%</span>
                    <span className="text-emerald-100/70">•</span>
                    <span>
                      ₹{(course.price_without_discount || 0) - course.price} off
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Main CTA */}
            {status === "live" && isEnrolled && masterclass?.meeting_url ? (
              <button
                onClick={handleJoin}
                className="w-full py-3 rounded-xl text-base font-semibold text-white bg-red-600 hover:bg-red-500 transition flex items-center justify-center gap-2 animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                Join Live Session
              </button>
            ) : isEnrolled &&
              status === "completed" &&
              masterclass?.recording_link ? (
              <a
                href={masterclass.recording_link}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl text-base font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Recording
              </a>
            ) : isEnrolled ? (
              <div className="w-full py-3 rounded-xl text-base font-semibold text-center text-emerald-300 bg-emerald-500/10 border border-emerald-400/20">
                ✅ You're Registered
              </div>
            ) : (
              <button
                onClick={handleBook}
                className="w-full py-3 rounded-xl text-base font-semibold text-white bg-violet-600 hover:bg-violet-500 transition active:scale-[0.98]"
              >
                Book Masterclass 🚀
              </button>
            )}

            {/* Includes */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-sm font-semibold text-white mb-3">
                This masterclass includes:
              </p>
              <div className="space-y-2">
                {[
                  "🔴 Live interactive session",
                  "📹 Recording access after class",
                  "✏️ Live drawing feedback",
                  "📚 Backlog recordings access",
                  "🏆 Certificate on completion",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              Session Details
            </p>
            <div className="space-y-2.5">
              <MetaRow
                icon={<Calendar className="w-4 h-4 text-violet-400" />}
                label="Date"
                value={formatDate(masterclass?.masterclass_start_at)}
              />
              <MetaRow
                icon={<Clock className="w-4 h-4 text-violet-400" />}
                label="Start"
                value={formatTime(masterclass?.masterclass_start_at)}
              />
              <MetaRow
                icon={<Clock className="w-4 h-4 text-violet-400" />}
                label="End"
                value={formatTime(masterclass?.masterclass_end_at)}
              />
              <MetaRow
                icon={<Video className="w-4 h-4 text-violet-400" />}
                label="Platform"
                value={formatProvider(masterclass?.meeting_provider)}
              />
              <MetaRow
                icon={<Globe className="w-4 h-4 text-violet-400" />}
                label="Language"
                value={course.language || "N/A"}
              />
              <MetaRow
                icon={<Users className="w-4 h-4 text-violet-400" />}
                label="Registered"
                value={String(course.students_enrolled?.length ?? 0)}
              />
              <MetaRow
                icon={<Star className="w-4 h-4 text-yellow-400" />}
                label="Rating"
                value={`${course.rating || 0} ⭐`}
              />
              <MetaRow
                icon={<Calendar className="w-4 h-4 text-violet-400" />}
                label="Created"
                value={createdDate}
              />
            </div>
          </div>
        </aside>
      </div>

      <Login
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onOpenRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
      <Register open={registerOpen} onOpenChange={setRegisterOpen} />
    </div>
  );
}

/* ─────────────────────────── Sub-components ─────────────────────────── */

function ScheduleBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
        {icon}
        {label}
      </span>
      <span className="text-xs text-gray-200 font-medium text-right">
        {value}
      </span>
    </div>
  );
}
