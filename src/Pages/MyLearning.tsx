import { BookOpen, Star, Clock } from "lucide-react";

export default function MyLearning() {
  // Placeholder data (replace later with API data)
  const courses = [
    {
      id: 1,
      title: "Digital Portraits for Beginners",
      progress: 65,
      rating: 4.7,
      duration: "8h 30m",
    },
    {
      id: 2,
      title: "Mastering Watercolor Techniques",
      progress: 30,
      rating: 4.5,
      duration: "5h 15m",
    },
  ];

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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{course.title}</h2>
                  <BookOpen className="text-cyan-400" size={20} />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-purple-400" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="w-full bg-gray-800/50 rounded-full h-2.5 mb-3">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-300">
                  Progress: {course.progress}%
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300 mt-10">
            You haven’t started any courses yet. Explore and start learning today!
          </p>
        )}
      </div>
    </section>
  );
}
