import { useEffect, useMemo, useState } from "react";
import { BookOpen, Star, Clock, Ban, MessageCircle } from "lucide-react";
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
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Read current user once for the blocked check
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

  // Only show regular courses (hide masterclasses)
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

  if (loading) {
    return (
      <section className="min-h-screen pt-28 pb-16 px-6 bg-gradient-to-b from-[#10194f] via-[#132060] to-[#1a237e] text-gray-100">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-10 text-center">
            🎓 My Courses
          </h1>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
              >
                <div className="h-40 bg-white/10 rounded-xl" />
                <div className="h-5 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
                <div className="h-2.5 bg-white/10 rounded w-full" />
                <div className="h-2.5 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-28 pb-16 px-6 bg-gradient-to-b from-[#10194f] via-[#132060] to-[#1a237e] text-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-10 text-center">
          🎓 My Courses
        </h1>

        {regularCourses.length > 0 ? (
          <div
            className={`grid gap-8 justify-center ${
              regularCourses.length === 1
                ? "grid-cols-1 max-w-sm mx-auto"
                : regularCourses.length === 2
                  ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {regularCourses.map((course) => {
              const blocked = isCourseBlocked(course);

              return (
                <div
                  key={course.id}
                  className={`relative bg-white/5 backdrop-blur-lg border rounded-2xl p-6 transition-all duration-300 ${
                    blocked
                      ? "border-red-400/30 hover:border-red-400/50"
                      : "border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  }`}
                >
                  {course.image && (
                    <div className="relative mb-4">
                      <img
                        src={course.image}
                        alt={course.course_name}
                        className={`rounded-xl h-40 w-full object-cover border border-white/10 ${
                          blocked ? "opacity-60 grayscale" : ""
                        }`}
                      />
                      {blocked && (
                        <span className="absolute top-2 right-2 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/90 text-white shadow-md backdrop-blur-sm">
                          <Ban className="w-3 h-3" />
                          Blocked
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold line-clamp-1">
                      {course.course_name}
                    </h2>
                    <BookOpen
                      className={blocked ? "text-red-400" : "text-cyan-400"}
                      size={20}
                    />
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400" />
                      <span>{course.rating || 0}</span>
                    </div>
                    {course.duration && (
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-purple-400" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                  </div>

                  {blocked ? (
                    <>
                      <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 mb-3 text-xs text-red-200 leading-relaxed">
                        Your access to this course has been suspended. Please
                        contact support to restore it.
                      </div>
                      <Button
                        className="w-full py-2 bg-[#25D366] hover:bg-[#20bd5a] rounded-full font-semibold flex items-center justify-center gap-2"
                        onClick={() => openWhatsApp(course.course_name)}
                      >
                        <MessageCircle size={16} />
                        Contact Support
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full mt-2 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full font-semibold hover:opacity-90 transition-all"
                      onClick={() =>
                        navigate(`/my-courses/${course.id}`, {
                          state: { course },
                        })
                      }
                    >
                      Continue Learning
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <p className="text-center text-gray-300 text-lg">
              You haven't enrolled in any courses yet.
            </p>
            <p className="text-cyan-300 mt-2">
              Explore and start learning today! ✨
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
