import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FileText, PlayCircle, ClipboardCheck, History } from "lucide-react";
import PYQPaperDialog from "@/components/PYQPaperDialog";
import { useState, useEffect, useMemo } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { toast } from "sonner";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
  const location = useLocation();
  const [pyqOpen, setPyqOpen] = useState(false);
  const [course, setCourse] = useState<any>(location.state?.course || null);
  const [loading, setLoading] = useState(!location.state?.course);

  // 🔹 Fetch course details if state is missing
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
            "Something went wrong while loading course"
        );
      } finally {
        setLoading(false);
      }
    };

    if (!course) fetchCourse();
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
    []
  );

  const sectionsToShow: SectionCard[] =
    course?.sections?.length > 0
      ? course.sections
          .map((sec: string) => sectionMap[sec as SectionKey])
          .filter(Boolean)
      : Object.values(sectionMap);

  const handleCardClick = (path: string) => {
    if (path === "pyq-mock-test") setPyqOpen(true);
    else navigate(`/my-courses/${id}/${path}`);
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
          Choose a section below to access your learning materials, mock tests,
          and PYQs.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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

      <PYQPaperDialog
        open={pyqOpen}
        onClose={() => setPyqOpen(false)}
        courseId={Number(id)}
      />
    </section>
  );
}
