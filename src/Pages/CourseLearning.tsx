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
} from "lucide-react";
import PYQPaperDialog from "@/components/PYQPaperDialog";
import { useState, useEffect, useMemo } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { toast } from "sonner";
import React from "react";

type SectionKey = "resources" | "videos" | "mock-test" | "pyq-mock-test";

interface SectionCard {
  title: string;
  desc: string;
  icon: React.ReactNode;
  gradient: string;
  path: string;
}

export default function CourseLearning() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pyqOpen, setPyqOpen] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Always fetch full latest course details before rendering
  // This avoids flicker when user comes from "My Courses" with partial state.
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

  // 🔹 Section mapping for normal courses
  const sectionMap: Record<SectionKey, SectionCard> = useMemo(
    () => ({
      resources: {
        title: "Resources",
        desc: "Access notes, guides, and downloadable materials for this course.",
        icon: <FileText className="w-10 h-10 text-cyan-300" />,
        gradient: "from-cyan-500/20 to-blue-700/20",
        path: "resources",
      },
      videos: {
        title: "Video Lectures",
        desc: "Watch all video lectures and master your concepts.",
        icon: <PlayCircle className="w-10 h-10 text-cyan-300" />,
        gradient: "from-purple-500/20 to-pink-700/20",
        path: "videos",
      },
      "mock-test": {
        title: "Mock Test",
        desc: "Evaluate your understanding through interactive tests.",
        icon: <ClipboardCheck className="w-10 h-10 text-cyan-300" />,
        gradient: "from-emerald-500/20 to-green-700/20",
        path: "mock-test",
      },
      "pyq-mock-test": {
        title: "PYQ (Previous Year Questions) Test",
        desc: "Solve past year question papers to strengthen your preparation.",
        icon: <History className="w-10 h-10 text-cyan-300" />,
        gradient: "from-amber-500/20 to-orange-700/20",
        path: "pyq-mock-test",
      },
    }),
    [],
  );

  // 🔹 Show only available sections for normal courses
  const sectionsToShow: SectionCard[] =
    course?.sections?.length > 0
      ? course.sections
          .map((sec: string) => sectionMap[sec as SectionKey])
          .filter(Boolean)
      : Object.values(sectionMap);

  // 🔹 Masterclass helpers
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

  // 🔹 Meeting link becomes visible a few minutes before the session starts
  const isMeetingVisible = () => {
    if (!masterclass?.masterclass_start_at) return false;

    const start = new Date(masterclass.masterclass_start_at).getTime();
    const beforeMinutes = masterclass.meeting_visible_before_minutes ?? 15;
    const visibleAt = start - beforeMinutes * 60 * 1000;

    return Date.now() >= visibleAt;
  };

  // 🔹 Masterclass is treated as completed if:
  // 1. backend status says "completed"
  // 2. OR end time has already passed
  const isMasterclassCompleted = () => {
    if (masterclass?.masterclass_status === "completed") return true;

    if (!masterclass?.masterclass_end_at) return false;

    const end = new Date(masterclass.masterclass_end_at).getTime();
    return Date.now() >= end;
  };

  // 🔹 Handle normal course card click
  const handleCardClick = (path: string) => {
    if (path === "pyq-mock-test") {
      setPyqOpen(true);
    } else {
      navigate(`/my-courses/${id}/${path}`);
    }
  };

  const normalizeExternalUrl = (url?: string | null) => {
  if (!url) return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  return /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
};

  // Join masterclass when link becomes visible
  const handleJoinMasterclass = () => {
  const safeMeetingUrl = normalizeExternalUrl(masterclass?.meeting_url);

  if (isMeetingVisible() && safeMeetingUrl) {
    window.open(safeMeetingUrl, "_blank", "noopener,noreferrer");
    return;
  }

  toast.info("Meeting link is not visible yet.");
};

  if (loading) {
    return (
      <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-10 text-center animate-pulse">
            🎓 Loading Course...
          </h1>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 space-y-4 animate-pulse"
              >
                <div className="h-10 w-10 bg-white/10 rounded-full mx-auto" />
                <div className="h-4 bg-white/10 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-white/10 rounded w-5/6 mx-auto" />
                <div className="h-2 bg-white/10 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="pt-24 pb-16 px-6 text-gray-100 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] flex items-center justify-center min-h-screen">
        <p className="text-red-400">Course not found or inaccessible.</p>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-3 capitalize">
          {course?.course_name || "My Course"}
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          {isMasterclass
            ? "Join the live session when the meeting link becomes available. After the masterclass is completed, revision material will appear here."
            : "Choose a section below to access your learning materials, mock tests, and PYQs."}
        </p>
      </div>

      {isMasterclass ? (
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-lg shadow-xl p-6 md:p-8">
            {/* 🔹 Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-200">
                <Video className="w-4 h-4" />
                Live Masterclass Access
              </div>

              <h2 className="mt-4 text-2xl md:text-3xl font-bold text-white">
                Your Masterclass Dashboard
              </h2>

              <p className="mt-2 text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Keep this page bookmarked. The join button will activate when the
                meeting link becomes available, and the revision file will appear
                here after the session ends.
              </p>
            </div>

            {/* 🔹 Main info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-cyan-300 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Starts At</p>
                    <p className="text-lg font-semibold text-white">
                      {formatDateTime(masterclass?.masterclass_start_at)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Please join a few minutes before the session starts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-cyan-300 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Ends At</p>
                    <p className="text-lg font-semibold text-white">
                      {formatDateTime(masterclass?.masterclass_end_at)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Revision material unlocks after the session is completed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan-300 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">
                      Meeting Link Visibility
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {masterclass?.meeting_visible_before_minutes ?? 15} minutes
                      before start
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      The join button will automatically become active at that
                      time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-cyan-300 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Revision Material</p>
                    <p className="text-lg font-semibold text-white">
                      {isMasterclassCompleted()
                        ? masterclass?.ppt_file_url
                          ? "Now available"
                          : "No file uploaded yet"
                        : "Available after completion"}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Notes or PPT link will appear here after the masterclass is
                      done.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 🔹 Join button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleJoinMasterclass}
                disabled={
                  isMasterclassCompleted() ||
                  !(isMeetingVisible() && masterclass?.meeting_url)
                }
                className={`min-w-[260px] rounded-2xl px-6 py-3.5 font-semibold text-white shadow-md transition ${
                  isMasterclassCompleted()
                    ? "bg-slate-600 cursor-not-allowed opacity-80"
                    : isMeetingVisible() && masterclass?.meeting_url
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-gray-600 cursor-not-allowed opacity-80"
                }`}
              >
                {isMasterclassCompleted()
                  ? "Masterclass Completed"
                  : isMeetingVisible() && masterclass?.meeting_url
                    ? "Join Masterclass 🚀"
                    : "Meeting Link Available Soon"}
              </button>
            </div>

            {/* 🔹 Status helper text */}
            <p className="mt-4 text-center text-sm text-gray-400">
              {isMasterclassCompleted()
                ? "The live session has ended. You can access the revision material below."
                : isMeetingVisible() && masterclass?.meeting_url
                  ? "Your live session is ready. Click the button above to join."
                  : `The meeting link will be available ${
                      masterclass?.meeting_visible_before_minutes ?? 15
                    } minutes before the masterclass starts.`}
            </p>

            {/* 🔹 Show revision file only after completion */}
            {isMasterclassCompleted() && masterclass?.ppt_file_url && (
              <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-cyan-300 mt-1" />
                    <div>
                      <p className="text-sm text-cyan-200">
                        Revision Material
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {masterclass?.ppt_file_name || "Open file"}
                      </p>
                      <p className="mt-1 text-sm text-gray-300">
                        Use this file to revise the concepts covered in the
                        masterclass.
                      </p>
                    </div>
                  </div>

                  <a
                    href={masterclass.ppt_file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 py-3 text-sm font-medium text-white transition"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Open Revision File
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`max-w-6xl mx-auto ${
            sectionsToShow.length === 1
              ? "flex justify-center"
              : sectionsToShow.length === 2
                ? "grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center"
                : sectionsToShow.length === 3
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          }`}
        >
          {sectionsToShow.map((card: SectionCard, i: number) => (
            <div
              key={i}
              onClick={() => handleCardClick(card.path)}
              className={`group bg-gradient-to-b ${card.gradient}
                border border-white/10 rounded-3xl p-6
                hover:border-cyan-400/40 hover:shadow-cyan-500/20
                transition-all cursor-pointer backdrop-blur-lg
                flex flex-col items-center text-center shadow-md`}
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                {card.title}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      <PYQPaperDialog
        open={pyqOpen}
        onClose={() => setPyqOpen(false)}
        courseId={Number(id)}
      />
    </section>
  );
}