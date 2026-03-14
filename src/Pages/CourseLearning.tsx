import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  PlayCircle,
  ClipboardCheck,
  History,
  Calendar,
  Clock,
  Video,
  ShieldCheck,
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

  const isMeetingVisible = () => {
    if (!masterclass?.masterclass_start_at) return false;

    const start = new Date(masterclass.masterclass_start_at).getTime();
    const beforeMinutes = masterclass.meeting_visible_before_minutes ?? 15;
    const visibleAt = start - beforeMinutes * 60 * 1000;

    return Date.now() >= visibleAt;
  };

  const handleCardClick = (path: string) => {
    if (path === "pyq-mock-test") {
      setPyqOpen(true);
    } else {
      navigate(`/my-courses/${id}/${path}`);
    }
  };

  // 🔹 Join masterclass when link becomes visible
  const handleJoinMasterclass = () => {
    if (isMeetingVisible() && masterclass?.meeting_url) {
      window.open(masterclass.meeting_url, "_blank");
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
            ? "View your masterclass timing, meeting details, and attached resources."
            : "Choose a section below to access your learning materials, mock tests, and PYQs."}
        </p>
      </div>

      {isMasterclass ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                <Calendar className="w-5 h-5 text-cyan-300 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Starts At</p>
                  <p className="text-white font-medium">
                    {formatDateTime(masterclass?.masterclass_start_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                <Calendar className="w-5 h-5 text-cyan-300 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Ends At</p>
                  <p className="text-white font-medium">
                    {formatDateTime(masterclass?.masterclass_end_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                <Video className="w-5 h-5 text-cyan-300 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Meeting Provider</p>
                  <p className="text-white font-medium capitalize">
                    {masterclass?.meeting_provider?.replace("_", " ") || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                <ShieldCheck className="w-5 h-5 text-cyan-300 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Approval</p>
                  <p className="text-white font-medium">
                    {masterclass?.approval_required
                      ? "Approval required"
                      : "No approval required"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                <History className="w-5 h-5 text-cyan-300 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-white font-medium capitalize">
                    {masterclass?.masterclass_status || "draft"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                <Clock className="w-5 h-5 text-cyan-300 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">
                    Meeting Visible Before
                  </p>
                  <p className="text-white font-medium">
                    {masterclass?.meeting_visible_before_minutes ?? 15} minutes
                  </p>
                </div>
              </div>
            </div>

            {masterclass?.ppt_file_url && (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-cyan-300 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Attached File</p>
                      <p className="text-white font-medium">
                        {masterclass?.ppt_file_name || "Open file"}
                      </p>
                    </div>
                  </div>

                  <a
                    href={masterclass.ppt_file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Open File
                  </a>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <button
                onClick={handleJoinMasterclass}
                disabled={!(isMeetingVisible() && masterclass?.meeting_url)}
                className={`rounded-xl px-6 py-3 font-semibold text-white shadow-md transition ${
                  isMeetingVisible() && masterclass?.meeting_url
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-gray-600 cursor-not-allowed opacity-80"
                }`}
              >
                {isMeetingVisible() && masterclass?.meeting_url
                  ? "Join Masterclass 🚀"
                  : "Meeting Link Not Available Yet"}
              </button>
            </div>
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
