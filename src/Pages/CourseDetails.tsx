import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient } from "@/utils/axiosConfig";
import type { Course } from "@/types/course";
import { Calendar, Clock, Globe, Layers, Users, Star } from "lucide-react";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await apiClient.get(`/api/course/${id}`);
        setCourse(data.data);
      } catch (err) {
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  // ✅ Loading Skeleton
  if (loading)
    return (
      <section className="pt-28 pb-12 px-6 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="w-full h-80 bg-gray-700 rounded-xl mb-6"></div>

          <div className="h-8 bg-gray-700 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>

          <div className="flex justify-between mb-6">
            <div className="h-5 bg-gray-700 rounded w-1/4"></div>
            <div className="h-5 bg-gray-700 rounded w-1/5"></div>
          </div>

          <div className="h-12 bg-cyan-800/50 rounded-lg w-1/3 mx-auto"></div>
        </div>
      </section>
    );

  if (error)
    return <p className="text-center text-red-400 mt-10">{error}</p>;

  if (!course)
    return <p className="text-center text-gray-300 mt-10">Course not found.</p>;

  // ✅ Format creation date
  const createdDate = new Date(course.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="pt-28 pb-16 px-6 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100">
      <div className="max-w-4xl mx-auto">
        <img
          src={course.image}
          alt={course.course_name}
          className="rounded-xl w-full h-80 object-cover mb-8 shadow-lg"
        />

        <h2 className="text-4xl font-bold mb-3 text-cyan-300">
          {course.course_name}
        </h2>
        <p className="text-gray-300 text-lg mb-6">{course.description}</p>

        {/* --- Course Metadata --- */}
        <div className="grid sm:grid-cols-2 gap-4 bg-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Category: {course.category || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>Duration: {course.duration || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>Language: {course.language || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>
              Students Enrolled:{" "}
              {course.students_enrolled?.length ?? 0}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>Rating: {course.rating || 0} ⭐</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <span>Created on: {createdDate}</span>
          </div>
        </div>

        {/* --- Price and Checkout --- */}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold text-white">
            Price: <span className="text-cyan-300">₹{course.price}</span>
          </div>
          <button className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-lg font-semibold text-white transition-all">
            Proceed to Checkout 🛒
          </button>
        </div>
      </div>
    </section>
  );
}
