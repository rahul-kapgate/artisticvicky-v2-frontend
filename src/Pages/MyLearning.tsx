import { useEffect, useState } from "react";
import { BookOpen, Star, Clock } from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  course_name: string;
  description: string;
  rating: number;
  duration: string | null;
  image?: string;
}

export default function MyLearning() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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
          error.response?.data?.message || "Something went wrong while fetching courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#10194f] via-[#132060] to-[#1a237e] text-gray-100">
        <p className="text-lg text-gray-300 animate-pulse">Loading your courses...</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-28 pb-16 px-6 bg-gradient-to-b from-[#10194f] via-[#132060] to-[#1a237e] text-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-10 text-center">
          🎓 My Learnings
        </h1>

        {courses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-300"
              >
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.course_name}
                    className="rounded-xl mb-4 h-40 w-full object-cover border border-white/10"
                  />
                )}

                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold line-clamp-1">
                    {course.course_name}
                  </h2>
                  <BookOpen className="text-cyan-400" size={20} />
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

                <Button
                  className="w-full mt-2 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full font-semibold hover:opacity-90 transition-all"
                  onClick={() => toast.info(`Continue learning: ${course.course_name}`)}
                >
                  Continue Learning
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300 mt-10">
            You haven’t enrolled in any courses yet. Explore and start learning today!
          </p>
        )}
      </div>
    </section>
  );
}
