import { useEffect, useState } from "react";
import { Palette, Heart, Globe, Star, Layers, Brush } from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import type { Course, CourseResponse } from "@/types/course";


// Reasons Section 
const reasons = [
  {
    icon: <Star className="w-8 h-8 text-pink-500" />,
    title: "Unique Creativity",
    desc: "Every artwork is crafted with originality, blending modern techniques with timeless styles.",
  },
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: "Personal Expression",
    desc: "Art that speaks emotions, stories, and imagination beyond words.",
  },
  {
    icon: <Layers className="w-8 h-8 text-indigo-500" />,
    title: "Diverse Portfolio",
    desc: "From digital illustrations to traditional paintings, explore a wide range of creative expressions.",
  },
  {
    icon: <Brush className="w-8 h-8 text-green-500" />,
    title: "Custom Creations",
    desc: "Personalized artworks designed to reflect your vision, style, or brand.",
  },
  {
    icon: <Palette className="w-8 h-8 text-yellow-500" />,
    title: "Passion for Art",
    desc: "Driven by love for creativity, each piece is made with dedication and detail.",
  },
  {
    icon: <Globe className="w-8 h-8 text-blue-500" />,
    title: "Global Reach",
    desc: "Connect with art lovers worldwide through exhibitions and digital platforms.",
  },
];

function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = document.querySelector("#courseScroll");
    let scrollAmount = 0;
    const interval = setInterval(() => {
      scrollAmount += 300;
      // @ts-ignore
      if (scrollAmount >= container.scrollWidth) scrollAmount = 0;
      // @ts-ignore
      container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiClient.get<CourseResponse>("/api/course/all-courses");
        if (res.data.success) {
          setCourses(res.data.data);
        } else {
          throw new Error(res.data.message || "Failed to fetch courses");
        }
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (error)
    return (
      <p className="text-center text-red-500 mt-10">
        Failed to load courses: {error}
      </p>
    );

  console.log(courses)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth mt-14">
      {/* ---------------- Hero Section ---------------- */}
      <section className="text-center pt-20 pb-6 px-4 bg-gradient-to-b from-purple-50 via-white to-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 bg-clip-text text-transparent">
              Artistic Vickey
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover colors, creativity, and inspiration through the eyes of
            Vickey.
          </p>

          <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl mb-8">
            <iframe
              className="w-full h-64 sm:h-96"
              src="https://www.youtube.com/embed/R_9NzB6LzEY?autoplay=1&mute=1&loop=1&playlist=R_9NzB6LzEY&controls=1&rel=0"
              title="Intro Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* ---------------- Courses Section ---------------- */}
      <section
        id="courses"
        className="py-16 px-6 bg-gradient-to-b from-[#10194f] via-[#132060] to-[#1a237e] text-gray-100"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">
            🎨 Explore <span className="text-cyan-300">Courses</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Learn, create, and master your artistic skills through immersive and guided lessons.
          </p>
        </div>

        {!loading && courses.length === 0 && (
          <p className="text-center text-gray-300 mt-6">No courses available yet.</p>
        )}

        {loading ? (
          // ✅ Only skeleton inside the same section
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#2b1a4a]/40 h-80 border border-white/10"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-400">Failed to load courses: {error}</p>
        ) : (
          // ✅ Actual course cards
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {courses.map((course, index) => {
              const cardStyles = [
                {
                  gradient: "from-[#2b1a4a] via-[#3c1e65] to-[#472181]",
                  border: "border-pink-400/30",
                  accent: "text-pink-300 border-pink-400 hover:bg-pink-500",
                },
                {
                  gradient: "from-[#0f1b3d]/90 via-[#152a52]/90 to-[#1c3d6e]/90",
                  border: "border-cyan-400/30",
                  accent: "text-cyan-300 border-cyan-400 hover:bg-cyan-500",
                },
                {
                  gradient: "from-[#1b1335]/90 via-[#2c1e5c]/90 to-[#3a2780]/90",
                  border: "border-violet-400/30",
                  accent: "text-violet-300 border-violet-400 hover:bg-violet-500",
                },
              ][index % 3];

              return (
                <article
                  key={course.id}
                  className={`rounded-2xl shadow-lg p-5 transition-all duration-300 hover:scale-105 bg-gradient-to-br ${cardStyles.gradient} border ${cardStyles.border} group`}
                >
                  <img
                    src={course.image}
                    alt={course.course_name}
                    className="rounded-xl mb-4 h-48 w-full object-cover border border-white/10 group-hover:border-white/30 transition-all duration-300"
                  />
                  <h3
                    className={`text-xl font-semibold ${cardStyles.accent.split(" ")[0]} mb-2`}
                  >
                    {course.course_name}
                  </h3>
                  <p className="text-gray-300 mb-3 line-clamp-3">{course.description}</p>
                  <div className="flex justify-between text-sm text-gray-300 mb-3">
                    <span>{course.category || "—"}</span>
                    <span className={`${cardStyles.accent.split(" ")[0]} font-medium`}>
                      ₹{course.price}
                    </span>
                  </div>
                  <button
                    className={`w-full py-2 rounded-lg font-semibold border ${cardStyles.accent} text-white/90 hover:text-white transition-all duration-300`}
                  >
                    Enroll Now ✨
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------------- Why Artistic Vickey Section ---------------- */}
      <section className="py-12 px-6 bg-gradient-to-b from-white via-purple-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Why <span className="text-purple-600">Artistic Vickey?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover what makes Artistic Vickey a unique space for creativity,
            passion, and meaningful artistic expression.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md shadow-md rounded-2xl p-8 border border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-purple-800">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <span className="inline-block w-24 h-1 bg-purple-500 rounded-full"></span>
          </div>
        </div>
      </section>

      {/* ---------------- About Section ---------------- */}
      <section
        id="about"
        className="pt-4 pb-8 px-6 bg-gradient-to-b from-white via-purple-50 to-white"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            About <span className="text-purple-600">Artistic Vickey</span>
          </h2>

          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Artistic Vickey is more than just an art platform — it's a creative
            journey that blends imagination, emotion, and technique. Founded by
            Vickey, a passionate artist dedicated to exploring the beauty of
            colors, textures, and storytelling through art. Each piece
            represents a unique story — inspired by life, nature, and human
            emotion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
                alt="Artist at work"
                className="rounded-2xl shadow-xl w-full max-w-md hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="text-left md:text-justify">
              <h3 className="text-2xl font-semibold mb-4 text-purple-700">
                Meet Vickey — The Artist Behind the Canvas
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Vickey’s artistic vision is rooted in curiosity and constant
                exploration. Whether it’s digital illustration, watercolor
                realism, or abstract compositions, each artwork aims to connect
                emotionally with its audience.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Through <strong>Artistic Vickey</strong>, the goal is to inspire
                others to see art as a language that transcends boundaries —
                celebrating creativity, diversity, and imagination.
              </p>

              <div className="flex items-center gap-3 mt-4">
                <span className="inline-block w-10 h-1 bg-purple-600 rounded-full"></span>
                <p className="text-gray-800 font-medium">
                  Creating art that connects hearts worldwide 🌍
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
