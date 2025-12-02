import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { apiClient } from "@/utils/axiosConfig";
import type { Course } from "@/types/course";
import { Calendar, Clock, Globe, Layers, Users, Star } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import Login from "@/components/Login";
import { CourseEnrollCard } from "@/components/CourseEnrollCard";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await apiClient.get(`/api/course/${id}`);
        const fetchedCourse = data.data;
        setCourse(fetchedCourse);

        const storedUser =
          user || JSON.parse(localStorage.getItem("user") || "null");

        if (storedUser && fetchedCourse?.students_enrolled) {
          const isUserEnrolled = fetchedCourse.students_enrolled.includes(
            storedUser.id
          );
          setIsEnrolled(isUserEnrolled);
        }
      } catch {
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id, user]);

  if (loading)
    return (
      <section className="pt-28 pb-12 px-6 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="w-full h-80 bg-gray-700 rounded-xl mb-6"></div>
          <div className="h-8 bg-gray-700 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
        </div>
      </section>
    );

  if (error)
    return <p className="text-center text-red-400 mt-10">{error}</p>;

  if (!course)
    return <p className="text-center text-gray-300 mt-10">Course not found.</p>;

  const createdDate = new Date(course.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleButtonClick = () => {
    if (!user) {
      setLoginOpen(true);
      return;
    }

    if (isEnrolled) {
      navigate(`/my-courses/${course.id}`);
    } else {
      window.open("https://wa.me/9325217691", "_blank");
    }
  };

  return (
    <section className="pt-24 pb-16 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100">
      {/* ===== HERO IMAGE ===== */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-b-3xl shadow-lg">
        <img
          src={course.image}
          alt={course.course_name}
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 md:p-12">
          <span className="text-cyan-300 uppercase tracking-wide text-sm mb-2">
            {course.category || "Uncategorized"}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white mb-3">
            {course.course_name}
          </h1>
          <p className="text-gray-200 max-w-2xl text-lg">{course.description}</p>
        </div>
      </div>

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="max-w-6xl mx-auto mt-10 px-6 grid lg:grid-cols-3 gap-10">
        {/* LEFT: Course Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid sm:grid-cols-2 gap-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <MetaItem icon={<Layers className="w-5 h-5 text-cyan-400" />} label="Category" value={course.category || "N/A"} />
            <MetaItem icon={<Clock className="w-5 h-5 text-cyan-400" />} label="Duration" value={course.duration || "N/A"} />
            <MetaItem icon={<Globe className="w-5 h-5 text-cyan-400" />} label="Language" value={course.language || "N/A"} />
            <MetaItem icon={<Users className="w-5 h-5 text-cyan-400" />} label="Students Enrolled" value={course.students_enrolled?.length ?? 0} />
            <MetaItem icon={<Star className="w-5 h-5 text-yellow-400" />} label="Rating" value={`${course.rating || 0} ⭐`} />
            <MetaItem icon={<Calendar className="w-5 h-5 text-cyan-400" />} label="Created On" value={createdDate} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-300 mb-3">About this course</h2>
            <p className="text-gray-200 leading-relaxed text-lg">
              {course.description ||
                "This course provides a deep dive into the subject with practical examples and step-by-step lessons to help you master new skills."}
            </p>
          </div>

          {course.tags && course.tags.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-cyan-800/40 text-cyan-200 px-3 py-1 rounded-full text-sm border border-cyan-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Enrollment Card */}
        <CourseEnrollCard
          course={course}
          isEnrolled={isEnrolled}
          onEnrolledChange={setIsEnrolled}
        />
      </div>

      <Login open={loginOpen} onOpenChange={setLoginOpen} />
    </section>
  );
}

/* ===== Meta Info Reusable ===== */
function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center space-x-3">
      {icon}
      <span className="text-gray-200">
        <strong className="text-white/90">{label}:</strong> {value}
      </span>
    </div>
  );
}
