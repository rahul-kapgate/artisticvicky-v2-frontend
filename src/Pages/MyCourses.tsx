import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Star,
  Clock,
  Ban,
  MessageCircle,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Course {
  id: number;
  course_name: string;
  description: string;
  rating: number;
  duration: string | null;
  image?: string;
  course_type?: "course" | "masterclass";
  blocked_users?: number[];
  progress?: number; // 0-100, optional
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUserId = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return Number(user?.id) || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user?.id) {
          toast.error("Please log in to view your enrolled courses.");
          setLoading(false);
          return;
        }

        const { data } = await apiClient.get(`/api/course/enrolled/${user.id}`);

        if (data.success) {
          setCourses(data.data);
        } else {
          toast.error(data.message || "Failed to fetch courses");
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong while fetching courses",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const regularCourses = useMemo(
    () => courses.filter((c) => c.course_type !== "masterclass"),
    [courses],
  );

  const isCourseBlocked = (course: Course) =>
    !!currentUserId && (course.blocked_users || []).includes(currentUserId);

  const openWhatsApp = (courseName: string) => {
    const msg = `Hi, I need help with my access to "${courseName}".`;
    window.open(
      `https://wa.me/9325217691?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 px-6 overflow-hidden bg-[#0a0f2e] text-gray-100">
      {/* Atmospheric background layers */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(56,189,248,0.15), transparent 50%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(168,85,247,0.12), transparent 50%), radial-gradient(ellipse 100% 80% at 50% 100%, rgba(20,30,90,0.6), transparent 60%)",
        }}
      />
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Editorial header */}
        <header className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-cyan-400/60" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300/80">
              Your Library
            </span>
          </div>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
              My{" "}
              <span className="italic font-light text-cyan-300">Courses</span>
            </h1>
            {!loading && regularCourses.length > 0 && (
              <div className="text-sm text-gray-400">
                <span className="text-white font-semibold text-lg">
                  {regularCourses.length}
                </span>{" "}
                {regularCourses.length === 1 ? "course" : "courses"} enrolled
              </div>
            )}
          </div>
        </header>

        {/* Loading state */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-white/[0.04]" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-white/[0.06] rounded w-3/4" />
                  <div className="h-3 bg-white/[0.04] rounded w-full" />
                  <div className="h-3 bg-white/[0.04] rounded w-2/3" />
                  <div className="h-10 bg-white/[0.04] rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Courses grid */}
        {!loading && regularCourses.length > 0 && (
          <div
            className={`grid gap-6 ${
              regularCourses.length === 1
                ? "grid-cols-1 max-w-md mx-auto"
                : regularCourses.length === 2
                  ? "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {regularCourses.map((course) => {
              const blocked = isCourseBlocked(course);
              const progress = Math.max(0, Math.min(100, course.progress ?? 0));

              return (
                <article
                  key={course.id}
                  className={`group relative overflow-hidden rounded-2xl border bg-white/[0.03] backdrop-blur-sm transition-all duration-500 ${
                    blocked
                      ? "border-red-400/20 hover:border-red-400/40"
                      : "border-white/[0.08] hover:border-cyan-400/40 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(56,189,248,0.25)]"
                  }`}
                >
                  {/* Image with overlay */}
                  {course.image ? (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.course_name}
                        className={`h-full w-full object-cover transition-transform duration-700 ${
                          blocked
                            ? "opacity-40 grayscale"
                            : "group-hover:scale-105"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2e] via-[#0a0f2e]/40 to-transparent" />

                      {blocked && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-500/90 text-white shadow-lg backdrop-blur-sm">
                          <Ban className="w-3 h-3" />
                          Suspended
                        </div>
                      )}

                      {/* Rating badge floating */}
                      {!blocked && course.rating > 0 && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white">
                          <Star
                            size={11}
                            className="text-yellow-400 fill-yellow-400"
                          />
                          {course.rating}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-44 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/20" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 pt-4">
                    <h2 className="text-lg font-semibold text-white mb-2 line-clamp-1 tracking-tight">
                      {course.course_name}
                    </h2>

                    <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
                      {course.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
                      {course.duration && (
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-cyan-400/80" />
                          <span>{course.duration}</span>
                        </div>
                      )}
                      {course.duration && (
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                      )}
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={12} className="text-purple-400/80" />
                        <span>Enrolled</span>
                      </div>
                    </div>

                    {/* Progress bar (only when not blocked) */}
                    {!blocked && course.progress !== undefined && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
                          <span>Progress</span>
                          <span className="text-cyan-300 font-semibold">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-700"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    {blocked ? (
                      <>
                        <div className="rounded-lg border border-red-400/20 bg-red-500/5 px-3 py-2.5 mb-3 text-xs text-red-200/90 leading-relaxed">
                          Your access has been suspended. Contact support to
                          restore it.
                        </div>
                        <Button
                          className="w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] rounded-full font-semibold flex items-center justify-center gap-2 transition-all"
                          onClick={() => openWhatsApp(course.course_name)}
                        >
                          <MessageCircle size={15} />
                          Contact Support
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="group/btn w-full py-2.5 bg-white text-[#0a0f2e] hover:bg-cyan-300 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                        onClick={() =>
                          navigate(`/my-courses/${course.id}`, {
                            state: { course },
                          })
                        }
                      >
                        Continue Learning
                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                        />
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && regularCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-6">
              <BookOpen className="w-9 h-9 text-cyan-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No courses yet
            </h3>
            <p className="text-gray-400 max-w-sm mb-6">
              You haven't enrolled in any courses. Discover something new and
              start learning today.
            </p>
            <Button
              onClick={() => navigate("/courses")}
              className="px-6 py-2.5 bg-white text-[#0a0f2e] hover:bg-cyan-300 rounded-full font-semibold transition-all"
            >
              Browse Courses
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
