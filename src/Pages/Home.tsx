import { useEffect, useState, useRef } from "react";
import { Palette, Heart, Globe, Star, Layers, Brush } from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import type { Course, CourseResponse } from "@/types/course";
import { useNavigate } from "react-router-dom";
import type { StudentArtwork, StudentArtworkResponse } from "@/types/studentArtwork";

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
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [studentArtworks, setStudentArtworks] = useState<StudentArtwork[]>([]);
  const [artworkLoading, setArtworkLoading] = useState(true);
  const [artworkError, setArtworkError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const firstRowRef = useRef<HTMLDivElement | null>(null);


  // Fetch all courses
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

  // fetch artworks
  const fetchStudentArtworks = async () => {
    try {
      const res = await apiClient.get<StudentArtworkResponse>(
        "/api/student-artwork/all"
      );

      if (res.data.success) {
        setStudentArtworks(res.data.data);
      } else {
        throw new Error("Failed to fetch student artworks");
      }
    } catch (err: any) {
      console.error("Error fetching student artworks:", err);
      setArtworkError(err.message || "Something went wrong");
    } finally {
      setArtworkLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStudentArtworks();
  }, []);

  // 🔁 Infinite auto-scroll Student Artwork strip (1..N..1..N...)
  useEffect(() => {
    if (artworkLoading || studentArtworks.length === 0) return;

    const container = scrollContainerRef.current;
    const firstRow = firstRowRef.current;

    if (!container || !firstRow) return;

    const speed = 0.7; // pixels per frame – tweak for faster/slower
    let animationFrameId: number;

    const step = () => {
      const firstWidth = firstRow.offsetWidth;
      if (firstWidth <= 0) {
        animationFrameId = requestAnimationFrame(step);
        return;
      }

      // When we've scrolled past the first set, wrap back by exactly its width
      if (container.scrollLeft >= firstWidth) {
        container.scrollLeft -= firstWidth;
      }

      container.scrollLeft += speed;
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [artworkLoading, studentArtworks.length]);



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
      <section className="relative flex flex-col justify-center items-center h-[85vh] text-center text-white overflow-hidden">

        {/* 🔹 Static gradient background that matches the home theme (blues/purples) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#10194f] to-[#1e3a8a]" />

        {/* 🔹 Subtle glowing blobs for depth */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-32 -left-16 w-72 h-72 bg-[#3b82f6] rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-10 w-80 h-80 bg-[#22d3ee] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#a855f7]/60 rounded-full blur-3xl" />
        </div>

        {/* 🔹 Soft dark overlay to enhance text contrast */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        {/* 🔹 Hero Content */}
        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#22d3ee] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Artistic Vickey
            </span>
          </h1>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
            Sketch Your Success. Ace the MAH AAC CET. Bring art to life. 🎨
          </p>

          <button
            onClick={() =>
              document
                .getElementById("courses")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full text-white font-semibold hover:opacity-90 transition drop-shadow-lg"
          >
            Explore Courses
          </button>
        </div>

        {/* Subtle top & bottom gradient fades for smooth blending */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
      </section>

      {/* ---------------- Student Artwork Section ---------------- */}
      <section className="py-16 px-6 bg-gradient-to-b from-[#020617] via-[#020617] to-[#0b1120] text-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-3">
              🖼️ Student <span className="text-cyan-300">Artwork</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Explore beautiful creations made by students of Artistic Vickey from
              different cities and backgrounds.
            </p>
          </div>

          {artworkLoading ? (
            // ✅ Skeleton shimmer while loading
            <div className="flex gap-6 overflow-hidden max-w-[90vw] mx-auto animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[260px] sm:min-w-[320px] h-64 rounded-2xl bg-slate-800/40 border border-slate-700/60"
                />
              ))}
            </div>
          ) : artworkError ? (
            <p className="text-center text-red-400">
              Failed to load student artwork: {artworkError}
            </p>
          ) : studentArtworks.length === 0 ? (
            <p className="text-center text-gray-400 mt-4">
              No student artwork shared yet. Stay tuned! ✨
            </p>
          ) : (
            <div className="relative max-w-[90vw] mx-auto">
              {/* Horizontal scroll container */}
              <div
                id="studentArtworkScroll"
                ref={scrollContainerRef}
                className="overflow-x-hidden pb-4 art-scrollbar"
              >
                <div className="flex gap-6">
                  {/* 🔹 First set (used for measuring width) */}
                  <div className="flex gap-6" ref={firstRowRef}>
                    {studentArtworks.map((art) => (
                      <div
                        key={`first-${art.id}`}
                        className="min-w-[260px] sm:min-w-[320px] bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e293b] rounded-2xl border border-cyan-400/20 shadow-lg overflow-hidden group"
                      >
                        <div className="relative h-56 w-full overflow-hidden">
                          <img
                            src={art.image}
                            alt={art.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />
                          <div className="absolute bottom-3 left-4 right-4">
                            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                              {art.title || "Untitled Artwork"}
                            </h3>
                            <p className="text-sm text-gray-200">
                              by <span className="font-medium">{art.student_name}</span>
                              {art.city && (
                                <span className="text-xs text-gray-300 ml-2">
                                  • {art.city}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between text-xs text-gray-300 bg-slate-900/70">
                          <span className="uppercase tracking-wide text-cyan-300">
                            Student Artwork
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 🔹 Second set (for seamless looping after the first 5) */}
                  <div className="flex gap-6">
                    {studentArtworks.map((art) => (
                      <div
                        key={`second-${art.id}`}
                        className="min-w-[260px] sm:min-w-[320px] bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e293b] rounded-2xl border border-cyan-400/20 shadow-lg overflow-hidden group"
                      >
                        <div className="relative h-56 w-full overflow-hidden">
                          <img
                            src={art.image}
                            alt={art.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />
                          <div className="absolute bottom-3 left-4 right-4">
                            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                              {art.title || "Untitled Artwork"}
                            </h3>
                            <p className="text-sm text-gray-200">
                              by <span className="font-medium">{art.student_name}</span>
                              {art.city && (
                                <span className="text-xs text-gray-300 ml-2">
                                  • {art.city}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between text-xs text-gray-300 bg-slate-900/70">
                          <span className="uppercase tracking-wide text-cyan-300">
                            Student Artwork
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
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
                    onClick={() => navigate(`/courses/${course.id}`)}
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
                src="https://jofgujxmsxubscczjimz.supabase.co/storage/v1/object/public/course-images/courses/IMG_5525.JPG"
                alt="Artist at work"
                className="rounded-2xl shadow-xl w-full max-w-md h-[42vh] object-cover object-center hover:scale-105 transition-transform duration-300"
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
