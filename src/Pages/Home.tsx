import { useEffect, useMemo, useRef, useState } from "react";
import {
  Palette,
  Heart,
  Globe,
  Star,
  Layers,
  Brush,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import type { Course, CourseResponse } from "@/types/course";
import { useNavigate } from "react-router-dom";
import type {
  StudentArtwork,
  StudentArtworkResponse,
} from "@/types/studentArtwork";
import { motion } from "framer-motion";
import NotificationsSection from "@/components/NotificationsSection";
import Vicky from "/vicky.jpg";
import FreeMockPopup from "@/components/FreeMockPopup";

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

// Home Page Reviews Types
interface HomePageReviewUser {
  id: number;
  user_name: string;
}

interface HomePageReviewCourse {
  id: number;
  course_name: string;
}

interface HomePageReview {
  id: number;
  course_id: number;
  rating: number;
  review_text: string | null;
  created_at: string;
  user: HomePageReviewUser | null;
  course: HomePageReviewCourse | null;
}

interface HomePageReviewResponse {
  success: boolean;
  message?: string;
  count?: number;
  data: HomePageReview[];
}

function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [studentArtworks, setStudentArtworks] = useState<StudentArtwork[]>([]);
  const [artworkLoading, setArtworkLoading] = useState(true);
  const [artworkError, setArtworkError] = useState<string | null>(null);

  const [homeReviews, setHomeReviews] = useState<HomePageReview[]>([]);
  const [homeReviewsLoading, setHomeReviewsLoading] = useState(true);
  const [homeReviewsError, setHomeReviewsError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const firstRowRef = useRef<HTMLDivElement | null>(null);

  // ✅ Course step scroller refs
  const courseScrollRef = useRef<HTMLDivElement | null>(null);
  const courseFirstCardRef = useRef<HTMLElement | null>(null);
  const [courseStep, setCourseStep] = useState(0);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await apiClient.get<CourseResponse>(
        "/api/course/all-courses",
      );
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
        "/api/student-artwork/all",
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

  // fetch public home page reviews
  const fetchHomePageReviews = async () => {
    try {
      const res = await apiClient.get<HomePageReviewResponse>(
        "/api/course-reviews/home-page?limit=6",
      );

      if (res.data.success) {
        setHomeReviews(res.data.data || []);
      } else {
        throw new Error(
          res.data.message || "Failed to fetch home page reviews",
        );
      }
    } catch (err: any) {
      console.error("Error fetching home page reviews:", err);
      setHomeReviewsError(err.message || "Something went wrong");
    } finally {
      setHomeReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStudentArtworks();
    fetchHomePageReviews();
  }, []);

  // 🔁 Infinite auto-scroll Student Artwork strip (1..N..1..N...)
  useEffect(() => {
    if (artworkLoading || studentArtworks.length === 0) return;

    const container = scrollContainerRef.current;
    const firstRow = firstRowRef.current;

    if (!container || !firstRow) return;

    const speed = 0.9;
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

  useEffect(() => {
    if (loading || courses.length === 0) return;

    const first = courseFirstCardRef.current;
    if (!first) return;

    const GAP = 24; // gap-6 = 24px

    const updateStep = () => {
      setCourseStep(first.offsetWidth + GAP);
    };

    updateStep();

    const ro = new ResizeObserver(updateStep);
    ro.observe(first);

    window.addEventListener("resize", updateStep);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateStep);
    };
  }, [loading, courses.length]);

  const scrollCoursesByStep = (dir: "left" | "right") => {
    const el = courseScrollRef.current;
    if (!el) return;

    const step = courseStep || Math.floor(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  const reviewAverage = useMemo(() => {
    if (!homeReviews.length) return "0.0";
    const total = homeReviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0,
    );
    return (total / homeReviews.length).toFixed(1);
  }, [homeReviews]);

  const featuredReview = homeReviews[0] || null;
  const remainingReviews = homeReviews.slice(1);

  const getReviewerInitials = (name?: string) => {
    if (!name?.trim()) return "AV";
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  };

  const formatReviewDate = (date: string) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderReviewStars = (rating: number, iconClass = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={`${iconClass} ${
              value <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-white/25"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth mt-14">
      <FreeMockPopup />

      {/* ---------------- Hero Section ---------------- */}
      <section className="relative flex flex-col justify-center items-center h-[60vh] lg:h-[85vh]  text-center text-white overflow-hidden">
        {/* 🔹 Static gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#10194f] to-[#1e3a8a]" />

        {/* 🔹 Animated glowing blobs for depth */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <motion.div
            className="absolute -top-32 -left-16 w-72 h-72 bg-[#3b82f6] rounded-full blur-3xl"
            animate={{ y: [0, 25, 0], x: [0, 10, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -right-10 w-80 h-80 bg-[#22d3ee] rounded-full blur-3xl"
            animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#a855f7]/60 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* 🔹 Soft dark overlay to enhance text contrast */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        {/* 🔹 Hero Content with entrance animation */}
        <motion.div
          className="relative z-10 px-6 max-w-3xl"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl font-bold mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#22d3ee] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Artistic Vickey
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-gray-100 max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            Sketch Your Success. Ace the MAH AAC CET. Bring art to life. 🎨
          </motion.p>

          <motion.button
            onClick={() =>
              document
                .getElementById("courses")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full text-white font-semibold hover:opacity-90 transition drop-shadow-lg"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore Courses
          </motion.button>
        </motion.div>

        {/* Gradient fades for smooth blending */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
      </section>

      {/* ---------------- Student Artwork Section ---------------- */}
      <section className="py-16 px-6 bg-gradient-to-b from-[#020617] via-[#020617] to-[#0b1120] text-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-3">
              🖼️ Students <span className="text-cyan-300">Artworks</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Explore beautiful creations made by students of Artistic Vickey
              from different cities and backgrounds.
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
                              by{" "}
                              <span className="font-medium">
                                {art.student_name}
                              </span>
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
                              by{" "}
                              <span className="font-medium">
                                {art.student_name}
                              </span>
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
            Learn, create, and master your artistic skills through immersive and
            guided lessons.
          </p>
        </div>

        {!loading && courses.length === 0 && (
          <p className="text-center text-gray-300 mt-6">
            No courses available yet.
          </p>
        )}

        {loading ? (
          // ✅ 1-line skeleton strip
          <div className="flex gap-6 overflow-hidden max-w-6xl mx-auto animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[260px] sm:w-[320px] md:w-[360px] rounded-2xl bg-[#2b1a4a]/40 h-80 border border-white/10"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-400">
            Failed to load courses: {error}
          </p>
        ) : (
          <div className="relative max-w-6xl mx-auto">
            {/* Left/Right Step Buttons */}
            <button
              type="button"
              onClick={() => scrollCoursesByStep("left")}
              className="hidden md:flex items-center justify-center absolute -left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 border border-white/15 hover:bg-black/45 transition"
              aria-label="Scroll courses left"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <button
              type="button"
              onClick={() => scrollCoursesByStep("right")}
              className="hidden md:flex items-center justify-center absolute -right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 border border-white/15 hover:bg-black/45 transition"
              aria-label="Scroll courses right"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* ✅ 1-line step scroller (snap) */}
            <div
              ref={courseScrollRef}
              className="overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]"
              onWheel={(e) => {
                // nice desktop behavior: vertical wheel scrolls horizontally
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
            >
              <div className="flex gap-6">
                {courses.map((course, index) => {
                  const isMasterclass = course.course_type === "masterclass";
                  const cardStyles = [
                    {
                      gradient: "from-[#2b1a4a] via-[#3c1e65] to-[#472181]",
                      border: "border-pink-400/30",
                      accent: "text-pink-300 border-pink-400 hover:bg-pink-500",
                    },
                    {
                      gradient:
                        "from-[#0f1b3d]/90 via-[#152a52]/90 to-[#1c3d6e]/90",
                      border: "border-cyan-400/30",
                      accent: "text-cyan-300 border-cyan-400 hover:bg-cyan-500",
                    },
                    {
                      gradient:
                        "from-[#1b1335]/90 via-[#2c1e5c]/90 to-[#3a2780]/90",
                      border: "border-violet-400/30",
                      accent:
                        "text-violet-300 border-violet-400 hover:bg-violet-500",
                    },
                  ][index % 3];

                  return (
                    <article
                      key={course.id}
                      ref={index === 0 ? courseFirstCardRef : undefined}
                      className={`snap-start flex-shrink-0 w-[260px] sm:w-[320px] md:w-[360px]
                        rounded-2xl shadow-lg p-5 transition-all duration-300 hover:scale-[1.02]
                        bg-gradient-to-br ${cardStyles.gradient} border ${cardStyles.border} group
                        flex flex-col`}
                    >
                      <img
                        src={course.image}
                        alt={course.course_name}
                        className="rounded-xl mb-4 h-48 w-full object-cover border border-white/10 group-hover:border-white/30 transition-all duration-300"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = course.image;
                        }}
                      />

                      <h3
                        className={`text-xl font-semibold ${cardStyles.accent.split(" ")[0]} mb-2`}
                      >
                        {course.course_name}
                      </h3>

                      <p className="text-gray-300 mb-3 line-clamp-3">
                        {course.description}
                      </p>

                      <div className="flex justify-between text-sm text-gray-300 mb-3">
                        <span>
                          {isMasterclass
                            ? "🎓 Masterclass"
                            : course.category || "—"}
                        </span>

                        <span className="text-right">
                          {course.price_without_discount &&
                          course.price_without_discount > course.price ? (
                            <span className="flex flex-col items-end leading-tight">
                              <span className="text-xs text-red-500 line-through">
                                ₹{course.price_without_discount}
                              </span>
                              <span className="text-emerald-400 font-semibold">
                                ₹{course.price}
                              </span>
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-semibold">
                              ₹{course.price}
                            </span>
                          )}
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className={`mt-auto w-full py-2 rounded-lg font-semibold border ${cardStyles.accent}
      text-white/90 hover:text-white transition-all duration-300`}
                      >
                        {isMasterclass
                          ? "View Masterclass ✨"
                          : "Enroll Now ✨"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* hide scrollbar (webkit) */}
            <style>{`
              div::-webkit-scrollbar { display: none; }
            `}</style>
          </div>
        )}
      </section>

      {/* 🔔 Notifications Section (using public API) */}
      <NotificationsSection />

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
                src={Vicky}
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

      {/* ---------------- Student Reviews Section ---------------- */}
      <section className="relative py-16 px-6 bg-gradient-to-b from-[#030712] via-[#0b1120] to-[#10194f] text-gray-100 overflow-hidden">
        {/* Decorative background glow */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-24 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-10 w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[26rem] h-[26rem] bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/20 bg-white/5 text-cyan-300 text-sm backdrop-blur">
              <Star className="w-4 h-4 fill-cyan-300 text-cyan-300" />
              Loved by students
            </span>

            <h2 className="text-4xl font-bold mt-5 mb-3">
              What Students Say About{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-300 bg-clip-text text-transparent">
                Artistic Vickey
              </span>
            </h2>

            <p className="text-gray-300 max-w-2xl mx-auto">
              Honest feedback from students who learned, practiced, and grew
              with our courses and masterclasses.
            </p>
          </div>

          {homeReviewsLoading ? (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 animate-pulse">
              <div className="xl:col-span-3 rounded-3xl h-[320px] bg-white/5 border border-white/10" />
              <div className="xl:col-span-2 grid sm:grid-cols-2 xl:grid-cols-1 gap-6">
                <div className="rounded-2xl h-[150px] bg-white/5 border border-white/10" />
                <div className="rounded-2xl h-[150px] bg-white/5 border border-white/10" />
              </div>
            </div>
          ) : homeReviewsError ? (
            <div className="max-w-3xl mx-auto rounded-3xl border border-red-400/20 bg-red-500/10 px-6 py-8 text-center">
              <p className="text-red-300 font-medium">
                Failed to load student reviews.
              </p>
              <p className="text-red-200/80 text-sm mt-2">{homeReviewsError}</p>
            </div>
          ) : homeReviews.length === 0 ? (
            <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-10 text-center">
              <h3 className="text-2xl font-semibold text-white mb-3">
                Reviews will appear here soon ✨
              </h3>
              <p className="text-gray-300 max-w-xl mx-auto mb-6">
                Once approved reviews are selected for the home page, they will
                show up in this section as student success stories.
              </p>
              <button
                onClick={() =>
                  document
                    .getElementById("courses")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500 text-white font-semibold hover:opacity-90 transition"
              >
                Explore Courses
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
                {/* Featured Review Card */}
                {featuredReview && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.6 }}
                    className="xl:col-span-3 relative rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-white/10 via-white/5 to-cyan-500/10 backdrop-blur-xl p-6 md:p-8 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.25)]"
                  >
                    <div className="absolute top-5 right-5 text-7xl font-serif text-white/10 select-none">
                      “
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {getReviewerInitials(featuredReview.user?.user_name)}
                      </div>

                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-white">
                          {featuredReview.user?.user_name || "Student Review"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          {renderReviewStars(
                            Number(featuredReview.rating || 0),
                          )}
                          {featuredReview.course?.course_name && (
                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cyan-200">
                              {featuredReview.course.course_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-lg md:text-2xl leading-relaxed text-gray-100 max-w-3xl">
                      “
                      {featuredReview.review_text?.trim() ||
                        "A wonderful learning experience with helpful guidance and inspiring lessons."}
                      ”
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-sm text-gray-300">
                        Shared on {formatReviewDate(featuredReview.created_at)}
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/courses/${featuredReview.course?.id || featuredReview.course_id}`,
                          )
                        }
                        className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 font-medium hover:bg-cyan-500 hover:text-white transition"
                      >
                        View Course
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Social Proof Side Cards */}
                <div className="xl:col-span-2 grid sm:grid-cols-2 xl:grid-cols-1 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-300 mb-2">
                      Average Rating
                    </p>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-white">
                        {reviewAverage}
                      </span>
                      <span className="text-gray-300 mb-1">/ 5</span>
                    </div>
                    <div className="mt-3">
                      {renderReviewStars(
                        Math.round(Number(reviewAverage)),
                        "w-5 h-5",
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mt-4">
                      Selected public reviews shown on the home page.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-white/5 to-cyan-500/10 backdrop-blur-xl p-6"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-300 mb-2">
                      Student Voices
                    </p>
                    <p className="text-4xl font-bold text-white">
                      {homeReviews.length}
                    </p>
                    <p className="text-sm text-gray-300 mt-4 leading-relaxed">
                      Real feedback from learners who joined Artistic Vickey’s
                      courses and masterclasses.
                    </p>

                    <button
                      onClick={() =>
                        document
                          .getElementById("courses")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="mt-5 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
                    >
                      Start Your Journey
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Review Grid */}
              {remainingReviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {remainingReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
                    >
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold shrink-0">
                            {getReviewerInitials(review.user?.user_name)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-white font-semibold truncate">
                              {review.user?.user_name || "Student"}
                            </h3>
                            <p className="text-xs text-gray-400 truncate">
                              {review.course?.course_name || "Course Review"}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs text-gray-400 shrink-0">
                          {formatReviewDate(review.created_at)}
                        </span>
                      </div>

                      <div className="mb-4">
                        {renderReviewStars(Number(review.rating || 0))}
                      </div>

                      <p className="text-gray-200 leading-relaxed line-clamp-5">
                        “
                        {review.review_text?.trim() ||
                          "Very helpful course with a supportive learning experience."}
                        ”
                      </p>

                      <button
                        onClick={() =>
                          navigate(
                            `/courses/${review.course?.id || review.course_id}`,
                          )
                        }
                        className="mt-5 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-500 hover:text-white transition"
                      >
                        View Course
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
