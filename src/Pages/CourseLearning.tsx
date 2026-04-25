import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  PlayCircle,
  ClipboardCheck,
  History,
  Calendar,
  Clock,
  Video,
  Link as LinkIcon,
  ChevronRight,
  AlertCircle,
  ChevronLeft,
  HeartHandshake,
  MessageCircle,
  Target,
  ClipboardList,
  Phone,
  TrendingUp,
  Award,
} from "lucide-react";
import PYQPaperDialog from "@/components/PYQPaperDialog";
import { useState, useEffect, useMemo } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { toast } from "sonner";
import React from "react";
import CourseReviewGate from "@/components/CourseReviewGate";

type SectionKey =
  | "resources"
  | "videos"
  | "mock-test"
  | "pyq-mock-test"
  | "live-test"
  | "mentor"; // ← added; driven by API sections[]

interface SectionCard {
  title: string;
  desc: string;
  icon: React.ReactNode;
  gradient: string;
  color: string;
  path: string;
}

// ── Mentor modal ──────────────────────────────────────────────────────────────
const MENTORSHIP_FEATURES = [
  {
    icon: <Target className="w-4 h-4" />,
    label: "1:1 Personal Guidance",
    color: "text-rose-300",
  },
  {
    icon: <ClipboardList className="w-4 h-4" />,
    label: "Customized Study Plan",
    color: "text-amber-300",
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    label: "Performance Tracking",
    color: "text-emerald-300",
  },
  {
    icon: <FileText className="w-4 h-4" />,
    label: "CAP Round & Form Guidance",
    color: "text-violet-300",
  },
  {
    icon: <Phone className="w-4 h-4" />,
    label: "Direct Mentor Call / Chat",
    color: "text-cyan-300",
  },
  {
    icon: <Award className="w-4 h-4" />,
    label: "College Shortlisting Help",
    color: "text-yellow-300",
  },
];

function MentorModal({
  open,
  onClose,
  courseName,
}: {
  open: boolean;
  onClose: () => void;
  courseName: string;
}) {
  if (!open) return null;

  const openWhatsApp = () => {
    const msg = `Hi Vickey Sir! I've enrolled in the "${courseName}" programme and would like to start my mentorship. Please guide me on the next steps.`;
    window.open(
      `https://wa.me/9325217691?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1535] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400" />

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-orange-500 flex items-center justify-center text-lg font-bold text-white shrink-0">
              V
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">
                Vickey Sir
              </h3>
              <p className="text-rose-300 text-xs mt-0.5">
                MAH AAC CET Expert & BFA Coach
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-auto text-gray-500 hover:text-gray-300 text-xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* Features */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Your Mentorship Includes
            </p>
            {MENTORSHIP_FEATURES.map(({ icon, label, color }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className={color}>{icon}</span>
                <span className="text-sm text-gray-200">{label}</span>
              </div>
            ))}
          </div>

          {/* Instruction */}
          <div className="rounded-xl border border-rose-400/20 bg-rose-500/[0.08] px-4 py-3">
            <p className="text-xs text-rose-100/80 leading-relaxed">
              👋 Your mentorship is active. Tap below to message Vickey Sir on
              WhatsApp — he'll reach out within a few hours to schedule your
              first session and build your study plan.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={openWhatsApp}
            className="w-full py-3.5 rounded-2xl text-base font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] transition active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-900/30"
          >
            <MessageCircle className="w-5 h-5" />
            Connect on WhatsApp
          </button>

          <p className="text-center text-xs text-gray-500">
            Available Mon – Sat · Replies within a few hours
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CourseLearning() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pyqOpen, setPyqOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/api/course/${id}`);
        if (data.success) {
          setCourse(data.data);
        } else {
          toast.error(data.message || "Failed to load course details");
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong while loading course",
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  // Driven purely by the API — no course-id hardcoding needed
  const hasMentorSection = course?.sections?.includes("mentor") ?? false;

  const sectionMap: Record<SectionKey, SectionCard> = useMemo(
    () => ({
      resources: {
        title: "Resources",
        desc: "Access notes, guides, and downloadable materials.",
        icon: <FileText className="w-8 h-8" />,
        gradient: "from-blue-600/40 via-blue-500/20 to-transparent",
        color: "text-blue-300",
        path: "resources",
      },
      videos: {
        title: "Video Lectures",
        desc: "Watch and master all video content.",
        icon: <PlayCircle className="w-8 h-8" />,
        gradient: "from-purple-600/40 via-purple-500/20 to-transparent",
        color: "text-purple-300",
        path: "videos",
      },
      "mock-test": {
        title: "Mock Tests",
        desc: "Test your knowledge with interactive quizzes.",
        icon: <ClipboardCheck className="w-8 h-8" />,
        gradient: "from-emerald-600/40 via-emerald-500/20 to-transparent",
        color: "text-emerald-300",
        path: "mock-test",
      },
      "pyq-mock-test": {
        title: "PYQ Tests",
        desc: "Solve previous year question papers.",
        icon: <History className="w-8 h-8" />,
        gradient: "from-amber-600/40 via-amber-500/20 to-transparent",
        color: "text-amber-300",
        path: "pyq-mock-test",
      },
      "live-test": {
        title: "Live Tests",
        desc: "Join scheduled tests with real exam experience.",
        icon: <Clock className="w-8 h-8" />,
        gradient: "from-rose-600/40 via-rose-500/20 to-transparent",
        color: "text-rose-300",
        path: "live-test",
      },
      // ── Mentor — rendered when API returns "mentor" in sections[] ──────────
      mentor: {
        title: "My Mentor",
        desc: "Connect directly with Vickey Sir for personalised guidance, study planning, and admission support.",
        icon: <HeartHandshake className="w-8 h-8" />,
        gradient: "from-rose-600/40 via-orange-500/20 to-transparent",
        color: "text-rose-300",
        path: "mentor",
      },
    }),
    [],
  );

  const sectionsToShow: SectionCard[] = useMemo(() => {
    if (course?.sections?.length > 0) {
      // Render exactly what the API says, in the order it says
      return course.sections
        .map((sec: string) => sectionMap[sec as SectionKey])
        .filter(Boolean);
    }
    // Fallback for courses with no sections field — exclude mentor
    return Object.entries(sectionMap)
      .filter(([key]) => key !== "mentor")
      .map(([, val]) => val);
  }, [course, sectionMap]);

  const isMasterclass = course?.course_type === "masterclass";
  const masterclass = course?.masterclass_details;

  const formatDateTime = (value?: string | null) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isMeetingVisible = () => {
    if (!masterclass?.masterclass_start_at) return false;
    const start = new Date(masterclass.masterclass_start_at).getTime();
    const beforeMins = masterclass.meeting_visible_before_minutes ?? 15;
    return Date.now() >= start - beforeMins * 60 * 1000;
  };

  const isMasterclassCompleted = () => {
    if (masterclass?.masterclass_status === "completed") return true;
    if (!masterclass?.masterclass_end_at) return false;
    return Date.now() >= new Date(masterclass.masterclass_end_at).getTime();
  };

  const handleCardClick = (path: string) => {
    if (path === "pyq-mock-test") {
      setPyqOpen(true);
    } else if (path === "mentor") {
      setMentorOpen(true);
    } else {
      navigate(`/my-courses/${id}/${path}`);
    }
  };

  const normalizeExternalUrl = (url?: string | null) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  const handleJoinMasterclass = () => {
    const safeMeetingUrl = normalizeExternalUrl(masterclass?.meeting_url);
    if (isMeetingVisible() && safeMeetingUrl) {
      window.open(safeMeetingUrl, "_blank", "noopener,noreferrer");
      return;
    }
    toast.info("Meeting link is not visible yet.");
  };

  const safeRecordingUrl = normalizeExternalUrl(masterclass?.recording_link);

  const colClass =
    sectionsToShow.length === 1
      ? "grid-cols-1 max-w-md mx-auto"
      : sectionsToShow.length === 2
        ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
        : sectionsToShow.length === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  /* ── Loading ── */
  if (loading) {
    return (
      <section className="relative min-h-screen pt-28 pb-20 px-6 bg-[#0a0f2e] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(56,189,248,0.1), transparent 50%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(168,85,247,0.08), transparent 50%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block h-1 w-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mb-4 animate-pulse" />
            <h1 className="text-4xl font-semibold text-white mb-4 animate-pulse">
              Loading Course
            </h1>
            <p className="text-gray-400 animate-pulse">
              Preparing your learning experience...
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4 animate-pulse"
              >
                <div className="h-10 w-10 bg-white/[0.06] rounded-lg mx-auto" />
                <div className="h-5 bg-white/[0.06] rounded w-3/4 mx-auto" />
                <div className="h-3 bg-white/[0.04] rounded w-5/6 mx-auto" />
                <div className="h-3 bg-white/[0.04] rounded w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Not found ── */
  if (!course) {
    return (
      <section className="relative min-h-screen pt-28 pb-20 px-6 bg-[#0a0f2e] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            The course you're looking for is unavailable or inaccessible.
          </p>
          <button
            onClick={() => navigate("/my-courses")}
            className="px-6 py-2.5 bg-white text-[#0a0f2e] rounded-full font-semibold hover:bg-cyan-300 transition-all"
          >
            Back to My Courses
          </button>
        </div>
      </section>
    );
  }

  /* ── Main render ── */
  return (
    <section className="relative min-h-screen pt-28 pb-20 px-6 bg-[#0a0f2e] text-gray-100 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(56,189,248,0.12), transparent 50%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(168,85,247,0.1), transparent 50%), radial-gradient(ellipse 100% 80% at 50% 100%, rgba(20,30,90,0.5), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-16 text-center">
          <div className="flex justify-start mb-6">
            <button
              onClick={() => navigate("/my-courses")}
              className="group/back flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-300 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 group-hover/back:border-cyan-400/40 group-hover/back:bg-cyan-400/5 transition-all">
                <ChevronLeft size={16} />
              </div>
              <span>Back to My Courses</span>
            </button>
          </div>

          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/5">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-medium text-cyan-300 tracking-wider">
                {hasMentorSection ? "MENTORSHIP PROGRAMME" : "COURSE LEARNING"}
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold text-white mb-4 tracking-tight leading-[1.1]">
            {course?.course_name || "My Course"}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {isMasterclass
              ? "Join the live session when available. Access revision materials after completion."
              : hasMentorSection
                ? "Access your mentorship and connect directly with your mentor below."
                : "Select a section below to access learning materials, tests, and PYQs."}
          </p>
        </header>

        {/* ── Masterclass view ── */}
        {isMasterclass ? (
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-lg overflow-hidden shadow-2xl">
              <div className="relative h-32 bg-gradient-to-r from-purple-600/30 via-cyan-500/20 to-blue-600/20 border-b border-white/5 flex items-center px-6 md:px-10">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-5 h-5 text-purple-300" />
                    <span className="text-sm font-semibold text-purple-200 uppercase tracking-wider">
                      Masterclass Dashboard
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white">
                    Your Live Session
                  </h2>
                </div>
              </div>

              <div className="p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                  {[
                    {
                      icon: <Calendar className="h-6 w-6 text-cyan-300" />,
                      bg: "bg-cyan-500/20 border-cyan-400/30",
                      label: "Starts At",
                      value: formatDateTime(masterclass?.masterclass_start_at),
                      sub: "Please join a few minutes early",
                    },
                    {
                      icon: <Clock className="h-6 w-6 text-purple-300" />,
                      bg: "bg-purple-500/20 border-purple-400/30",
                      label: "Ends At",
                      value: formatDateTime(masterclass?.masterclass_end_at),
                      sub: "Materials unlock after session",
                    },
                    {
                      icon: <LinkIcon className="h-6 w-6 text-blue-300" />,
                      bg: "bg-blue-500/20 border-blue-400/30",
                      label: "Join Link Available",
                      value: `${masterclass?.meeting_visible_before_minutes ?? 15} min before`,
                      sub: "Button activates automatically",
                    },
                    {
                      icon: <FileText className="h-6 w-6 text-emerald-300" />,
                      bg: "bg-emerald-500/20 border-emerald-400/30",
                      label: "Revision Material",
                      value: isMasterclassCompleted()
                        ? "Available Now"
                        : "Coming Soon",
                      sub: "PPT, notes, or recording",
                    },
                  ].map(({ icon, bg, label, value, sub }) => (
                    <div
                      key={label}
                      className="group rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] p-5 transition-all"
                    >
                      <div className="flex gap-4">
                        <div
                          className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg border ${bg}`}
                        >
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            {label}
                          </p>
                          <p className="text-lg font-semibold text-white mt-1 truncate">
                            {value}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">{sub}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <button
                    onClick={handleJoinMasterclass}
                    disabled={
                      isMasterclassCompleted() ||
                      !(isMeetingVisible() && masterclass?.meeting_url)
                    }
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                      isMasterclassCompleted()
                        ? "bg-gray-600/30 border border-gray-500/20 text-gray-400 cursor-not-allowed"
                        : isMeetingVisible() && masterclass?.meeting_url
                          ? "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20"
                          : "bg-gray-600/30 border border-gray-500/20 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isMasterclassCompleted() ? (
                      "Masterclass Completed"
                    ) : isMeetingVisible() && masterclass?.meeting_url ? (
                      <>
                        <span>Join Masterclass</span>
                        <ChevronRight className="w-5 h-5" />
                      </>
                    ) : (
                      "Meeting Link Available Soon"
                    )}
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    {isMasterclassCompleted()
                      ? "The session has ended. Access materials below."
                      : isMeetingVisible() && masterclass?.meeting_url
                        ? "Your session is ready to begin!"
                        : `Meeting link opens ${masterclass?.meeting_visible_before_minutes ?? 15} minutes before start time.`}
                  </p>
                </div>

                {isMasterclassCompleted() && masterclass?.ppt_file_url && (
                  <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-5 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-500/20 border border-cyan-400/30">
                          <FileText className="h-5 w-5 text-cyan-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-cyan-200">
                            Revision Material
                          </p>
                          <p className="text-sm text-gray-300 mt-0.5">
                            {masterclass?.ppt_file_name || "Download file"}
                          </p>
                        </div>
                      </div>
                      <a
                        href={masterclass.ppt_file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-all whitespace-nowrap"
                      >
                        <LinkIcon className="w-4 h-4" /> Open
                      </a>
                    </div>
                  </div>
                )}

                {isMasterclassCompleted() && safeRecordingUrl && (
                  <div className="rounded-xl border border-purple-400/30 bg-purple-500/10 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-500/20 border border-purple-400/30">
                          <PlayCircle className="h-5 w-5 text-purple-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-200">
                            Session Recording
                          </p>
                          <p className="text-sm text-gray-300 mt-0.5">
                            Watch the full masterclass replay
                          </p>
                        </div>
                      </div>
                      <a
                        href={safeRecordingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all whitespace-nowrap"
                      >
                        <PlayCircle className="w-4 h-4" /> Watch
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── Section cards grid ── */
          <div className={`grid gap-6 ${colClass}`}>
            {sectionsToShow.map((card: SectionCard, i: number) => {
              const isMentorCard = card.path === "mentor";
              return (
                <button
                  key={i}
                  onClick={() => handleCardClick(card.path)}
                  className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${card.gradient} border-white/10 p-6 transition-all duration-300 text-left
                    ${
                      isMentorCard
                        ? "hover:border-rose-400/40 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/10"
                        : "hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(56,189,248,0.2)]"
                    }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:translate-x-1/3 transition-transform" />

                  {isMentorCard && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 px-2 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                      <span className="text-[10px] font-semibold text-rose-300 uppercase tracking-wide">
                        Active
                      </span>
                    </div>
                  )}

                  <div className="relative">
                    <div
                      className={`${card.color} mb-4 group-hover:scale-110 transition-transform`}
                    >
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      {card.desc}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isMentorCard ? (
                        <>
                          <MessageCircle className="w-3 h-3 text-rose-300" />
                          <span className="text-rose-300">Connect Now</span>
                        </>
                      ) : (
                        <>
                          Access <ChevronRight className="w-3 h-3" />
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Course review */}
        {Number(id) > 0 && (!isMasterclass || isMasterclassCompleted()) && (
          <div className="max-w-6xl mx-auto mt-16">
            <CourseReviewGate courseId={Number(id)} autoOpen={false} />
          </div>
        )}
      </div>

      <PYQPaperDialog
        open={pyqOpen}
        onClose={() => setPyqOpen(false)}
        courseId={Number(id)}
      />

      {/* Mentor modal — conditionally mounted only when section is present */}
      {hasMentorSection && (
        <MentorModal
          open={mentorOpen}
          onClose={() => setMentorOpen(false)}
          courseName={course?.course_name || "Mentorship Programme"}
        />
      )}
    </section>
  );
}
