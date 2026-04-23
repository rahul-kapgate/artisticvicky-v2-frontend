import { useEffect, useRef, useState, useCallback } from "react";
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
import ReviewsSection from "@/components/ReviewsSection";

// ─── Constants (outside component — no re-creation on render) ───────────────

const REASONS = [
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

const STATS = [
  { num: "1200+", label: "Students" },
  { num: "94%", label: "Selection Rate" },
  { num: "50+", label: "Video Lessons" },
  { num: "5 ★", label: "Rated" },
];

const PHRASES = [
  "Master Perspective Drawing ✏️",
  "Score Full Marks in Aptitude 📐",
  "Crack Design Entrance Exams 🎯",
  "Build Your Dream Portfolio 🖼️",
  "Join 1200+ Successful Students 🌟",
  "Learn 3D Visualisation 🏛️",
  "Ace Colour Theory & Sketching 🎨",
];

const CARD_STYLES = [
  {
    gradient: "from-[#2b1a4a] via-[#3c1e65] to-[#472181]",
    border: "border-pink-400/30",
    accent: "text-pink-300   border-pink-400   hover:bg-pink-500",
  },
  {
    gradient: "from-[#0f1b3d]/90 via-[#152a52]/90 to-[#1c3d6e]/90",
    border: "border-cyan-400/30",
    accent: "text-cyan-300   border-cyan-400   hover:bg-cyan-500",
  },
  {
    gradient: "from-[#1b1335]/90 via-[#2c1e5c]/90 to-[#3a2780]/90",
    border: "border-violet-400/30",
    accent: "text-violet-300 border-violet-400 hover:bg-violet-500",
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Small pure components ────────────────────────────────────────────────────

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 360 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <circle
        cx="180"
        cy="190"
        r="155"
        stroke="rgba(99,102,241,0.18)"
        strokeWidth="1"
        strokeDasharray="6 4"
      />
      <circle
        cx="180"
        cy="190"
        r="130"
        stroke="rgba(167,139,250,0.15)"
        strokeWidth="0.8"
      />

      <rect
        x="70"
        y="60"
        width="220"
        height="175"
        rx="8"
        fill="rgba(15,23,42,0.85)"
        stroke="rgba(167,139,250,0.5)"
        strokeWidth="1.5"
      />

      {/* Grid lines */}
      <line
        x1="70"
        y1="147"
        x2="290"
        y2="147"
        stroke="rgba(167,139,250,0.25)"
        strokeWidth="0.8"
      />
      <line
        x1="180"
        y1="60"
        x2="180"
        y2="235"
        stroke="rgba(167,139,250,0.2)"
        strokeWidth="0.8"
      />
      {[80, 120, 160, 200, 235].map((y, i) => (
        <g key={i}>
          <line
            x1="180"
            y1="147"
            x2="70"
            y2={y}
            stroke="rgba(244,114,182,0.4)"
            strokeWidth="0.7"
          />
          <line
            x1="180"
            y1="147"
            x2="290"
            y2={y}
            stroke="rgba(34,211,238,0.4)"
            strokeWidth="0.7"
          />
        </g>
      ))}

      {/* 3-D box */}
      <polygon
        points="155,165 205,165 205,210 155,210"
        fill="rgba(99,102,241,0.25)"
        stroke="#818cf8"
        strokeWidth="1.2"
      />
      <polygon
        points="155,165 205,165 220,150 170,150"
        fill="rgba(99,102,241,0.15)"
        stroke="#818cf8"
        strokeWidth="1.2"
      />
      <polygon
        points="205,165 220,150 220,195 205,210"
        fill="rgba(99,102,241,0.1)"
        stroke="#818cf8"
        strokeWidth="1.2"
      />

      {/* VP dot */}
      <circle cx="180" cy="147" r="3.5" fill="#f472b6" />
      <circle
        cx="180"
        cy="147"
        r="6"
        fill="none"
        stroke="rgba(244,114,182,0.5)"
        strokeWidth="1"
      />

      {/* Pencil */}
      <g transform="rotate(-35,260,300)">
        <rect x="247" y="255" width="13" height="60" rx="2" fill="#fbbf24" />
        <polygon points="247,315 260,315 253.5,332" fill="#fde68a" />
        <rect x="247" y="255" width="13" height="10" rx="1" fill="#9ca3af" />
        <rect x="249" y="329" width="9" height="3" fill="#d97706" />
      </g>

      {/* Palette dots */}
      {[
        ["#ef4444", "95"],
        ["#fbbf24", "122"],
        ["#22c55e", "149"],
        ["#3b82f6", "176"],
        ["#a855f7", "203"],
      ].map(([fill, cx]) => (
        <circle
          key={cx}
          cx={cx}
          cy="318"
          r="12"
          fill={`${fill}cc`}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
      ))}
      <ellipse
        cx="155"
        cy="318"
        rx="75"
        ry="22"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1.5"
      />

      {/* Topic pills */}
      {[
        {
          x: 30,
          y: 150,
          w: 110,
          label: "Perspective Drawing",
          fill: "34,211,238",
          tx: 85,
        },
        {
          x: 220,
          y: 105,
          w: 105,
          label: "Colour Theory",
          fill: "244,114,182",
          tx: 272,
        },
        {
          x: 35,
          y: 240,
          w: 90,
          label: "Aptitude Test",
          fill: "167,139,250",
          tx: 80,
        },
        {
          x: 225,
          y: 245,
          w: 90,
          label: "Sketching",
          fill: "74,222,128",
          tx: 270,
        },
      ].map(({ x, y, w, label, fill, tx }) => (
        <g key={label}>
          <rect
            x={x}
            y={y}
            width={w}
            height="24"
            rx="12"
            fill={`rgba(${fill},0.12)`}
            stroke={`rgba(${fill},0.4)`}
            strokeWidth="1"
          />
          <text
            x={tx}
            y={y + 16}
            textAnchor="middle"
            fill={`rgba(${fill},1)`}
            fontSize="10"
            fontFamily="sans-serif"
          >
            {label}
          </text>
        </g>
      ))}

      {/* Accent stars */}
      {[
        [60, 100, "#fbbf24"],
        [300, 180, "#67e8f9"],
        [45, 290, "#f472b6"],
        [315, 290, "#a78bfa"],
        [180, 30, "#67e8f9"],
      ].map(([cx, cy, fill], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="2"
          fill={fill as string}
          opacity="0.7"
        />
      ))}
    </svg>
  );
}

function StatCard({ num, label }: { num: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm py-3 px-2 text-center">
      <div className="text-xl font-bold text-cyan-300">{num}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}

// ─── useTypewriter hook ───────────────────────────────────────────────────────

function useTypewriter(phrases: string[]) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = phrases[phraseIndex];
    if (!isDeleting && charIndex === current.length) {
      const t = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((p) => (p + 1) % phrases.length);
      return;
    }
    const t = setTimeout(
      () => {
        setDisplayed(current.slice(0, charIndex + (isDeleting ? -1 : 1)));
        setCharIndex((c) => c + (isDeleting ? -1 : 1));
      },
      isDeleting ? 38 : 68,
    );
    return () => clearTimeout(t);
  }, [charIndex, isDeleting, phraseIndex, phrases]);

  return displayed;
}

// ─── Main component ───────────────────────────────────────────────────────────

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
  const [reviewCount, setReviewCount] = useState<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const firstRowRef = useRef<HTMLDivElement | null>(null);
  const courseScrollRef = useRef<HTMLDivElement | null>(null);
  const courseFirstCardRef = useRef<HTMLElement | null>(null);
  const [courseStep, setCourseStep] = useState(0);

  const displayed = useTypewriter(PHRASES);

  // ── Data fetching ────────────────────────────────────────────────────────

  const fetchCourses = useCallback(async () => {
    try {
      const res = await apiClient.get<CourseResponse>(
        "/api/course/all-courses",
      );
      if (res.data.success) setCourses(res.data.data);
      else throw new Error(res.data.message || "Failed to fetch courses");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudentArtworks = useCallback(async () => {
    try {
      const res = await apiClient.get<StudentArtworkResponse>(
        "/api/student-artwork/all",
      );
      if (res.data.success) setStudentArtworks(res.data.data);
      else throw new Error("Failed to fetch student artworks");
    } catch (err: any) {
      setArtworkError(err.message || "Something went wrong");
    } finally {
      setArtworkLoading(false);
    }
  }, []);

  const fetchHomePageReviews = useCallback(async () => {
    try {
      const res = await apiClient.get<HomePageReviewResponse>(
        "/api/course-reviews/home-page?limit=50",
      );
      if (res.data.success) {
        setHomeReviews(res.data.data || []);
        setReviewCount(res.data?.count || 0);
      } else
        throw new Error(
          res.data.message || "Failed to fetch home page reviews",
        );
    } catch (err: any) {
      setHomeReviewsError(err.message || "Something went wrong");
    } finally {
      setHomeReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchStudentArtworks();
    fetchHomePageReviews();
  }, [fetchCourses, fetchStudentArtworks, fetchHomePageReviews]);

  const ORDER = [1, 26, 16, 12, 13, 24, 25];
  const sortedCourses = [...courses].sort((a, b) => {
    const aPos = ORDER.indexOf(a.id) === -1 ? 999 : ORDER.indexOf(a.id);
    const bPos = ORDER.indexOf(b.id) === -1 ? 999 : ORDER.indexOf(b.id);
    return aPos - bPos;
  });

  // ── Artwork auto-scroll ──────────────────────────────────────────────────
  useEffect(() => {
    if (artworkLoading || studentArtworks.length === 0) return;

    const container = scrollContainerRef.current;
    const firstRow = firstRowRef.current;
    if (!container || !firstRow) return;

    let rafId: number;
    let isPaused = false;

    // Mouse drag (desktop)
    let isMouseDown = false;
    let startX = 0;
    let scrollStart = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      isPaused = true;
      startX = e.pageX;
      scrollStart = container.scrollLeft;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isMouseDown) {
        container.scrollLeft = scrollStart - (e.pageX - startX);
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
      isPaused = false;
    };

    // ── TOUCH (mobile) - ONLY pause/resume ─────────────────────────────
    const onTouchStart = () => {
      isPaused = true;
    };

    const onTouchEnd = () => {
      setTimeout(() => {
        isPaused = false;
      }, 400);
    };

    // Attach listeners
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    // Auto-scroll loop
    const tick = () => {
      if (!isPaused) {
        const w = firstRow.offsetWidth;
        if (w > 0) {
          if (container.scrollLeft >= w) {
            container.scrollLeft -= w; // seamless loop
          }
          container.scrollLeft += 0.9;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [artworkLoading, studentArtworks.length]);

  // ── Course scroller step ─────────────────────────────────────────────────

  useEffect(() => {
    if (loading || courses.length === 0) return;
    const first = courseFirstCardRef.current;
    if (!first) return;
    const update = () => setCourseStep(first.offsetWidth + 24);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(first);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [loading, courses.length]);

  const scrollCoursesByStep = useCallback(
    (dir: "left" | "right") => {
      const el = courseScrollRef.current;
      if (!el) return;
      el.scrollBy({
        left:
          dir === "left"
            ? -(courseStep || el.clientWidth * 0.9)
            : courseStep || el.clientWidth * 0.9,
        behavior: "smooth",
      });
    },
    [courseStep],
  );

  // ── Artwork card (shared between the two duplicate strips) ───────────────

  const ArtworkCard = useCallback(
    ({ art, prefix }: { art: StudentArtwork; prefix: string }) => (
      <div
        key={`${prefix}-${art.id}`}
        className="min-w-[260px] sm:min-w-[320px] bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e293b] rounded-2xl border border-cyan-400/20 shadow-lg overflow-hidden group"
      >
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={art.image}
            alt={art.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
              {art.title || "Untitled Artwork"}
            </h3>
            <p className="text-sm text-gray-200">
              by <span className="font-medium">{art.student_name}</span>
              {art.city && (
                <span className="text-xs text-gray-300 ml-2">• {art.city}</span>
              )}
            </p>
          </div>
        </div>
        <div className="px-4 py-3 bg-slate-900/70">
          <span className="uppercase tracking-wide text-xs text-cyan-300">
            Student Artwork
          </span>
        </div>
      </div>
    ),
    [],
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth mt-14">
      <FreeMockPopup />

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative flex flex-col justify-center items-center min-h-[60vh] lg:min-h-[92vh] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#10194f] to-[#1e3a8a]" />

        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          {[
            {
              cls: "absolute -top-32 -left-16 w-72 h-72 bg-[#3b82f6]",
              anim: { y: [0, 25, 0], x: [0, 10, 0] },
              dur: 16,
            },
            {
              cls: "absolute -bottom-40 -right-10 w-80 h-80 bg-[#22d3ee]",
              anim: { y: [0, -20, 0], x: [0, -15, 0] },
              dur: 18,
            },
            {
              cls: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#a855f7]/60",
              anim: { scale: [1, 1.1, 1] },
              dur: 20,
            },
          ].map(({ cls, anim, dur }, i) => (
            <motion.div
              key={i}
              className={`${cls} rounded-full blur-3xl`}
              animate={anim}
              transition={{
                duration: dur,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 lg:py-0 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-purple-400/40 bg-purple-500/10 text-purple-300 text-sm font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              India's #1 MAH AAC CET Coaching
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15 }}
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#22d3ee] bg-clip-text text-transparent">
                Artistic Vickey
              </span>
            </motion.h1>

            {/* Typewriter */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-1 mb-5 h-9"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span
                className="text-lg sm:text-xl font-semibold"
                style={{
                  background:
                    "linear-gradient(to right,#f472b6,#a78bfa,#22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {displayed}
              </span>
              <span className="inline-block w-[2px] h-6 bg-cyan-300 rounded-full animate-pulse" />
            </motion.div>

            <motion.p
              className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Sketch your success, ace the exam, and bring your artistic dreams
              to life — guided by expert mentor Vickey.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() =>
                  document
                    .getElementById("courses")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-7 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full font-semibold hover:opacity-90 transition shadow-lg"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                🎨 Explore Courses
              </motion.button>
              <motion.button
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-7 py-3 rounded-full font-semibold border border-white/30 hover:bg-white/10 transition"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                About Vickey →
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              {STATS.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </motion.div>
          </motion.div>

          {/* Right — illustration */}
          <motion.div
            className="flex-shrink-0 w-full max-w-xs lg:max-w-sm xl:max-w-md hidden sm:flex items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <HeroIllustration />
          </motion.div>
        </div>

        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
      </section>

      {/* ══════════════ STUDENT ARTWORKS ══════════════ */}
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
              <div
                ref={scrollContainerRef}
                className="overflow-x-scroll pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
              >
                <div className="flex gap-6">
                  <div className="flex gap-6" ref={firstRowRef}>
                    {studentArtworks.map((art) => (
                      <ArtworkCard key={art.id} art={art} prefix="first" />
                    ))}
                  </div>
                  <div className="flex gap-6" aria-hidden="true">
                    {studentArtworks.map((art) => (
                      <ArtworkCard key={art.id} art={art} prefix="second" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ COURSES ══════════════ */}
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

        {loading ? (
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
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-300 mt-6">
            No courses available yet.
          </p>
        ) : (
          <div className="relative max-w-6xl mx-auto">
            {(["left", "right"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => scrollCoursesByStep(dir)}
                className={`hidden md:flex items-center justify-center absolute ${dir === "left" ? "-left-12" : "-right-12"} top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 border border-white/15 hover:bg-black/45 transition`}
                aria-label={`Scroll courses ${dir}`}
              >
                {dir === "left" ? (
                  <ChevronLeft className="w-5 h-5 text-white" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white" />
                )}
              </button>
            ))}

            <div
              ref={courseScrollRef}
              className="overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onWheel={(e) => {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX))
                  e.currentTarget.scrollLeft += e.deltaY;
              }}
            >
              <div className="flex gap-6">
                {sortedCourses.map((course, index) => {
                  const s = CARD_STYLES[index % 3];
                  const isMasterclass = course.course_type === "masterclass";
                  const isStudyMaterial = course.id === 16;
                  return (
                    <article
                      key={course.id}
                      ref={index === 0 ? courseFirstCardRef : undefined}
                      className={`snap-start flex-shrink-0 w-[260px] sm:w-[320px] md:w-[360px] rounded-2xl shadow-lg p-5 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br ${s.gradient} border ${s.border} group flex flex-col`}
                    >
                      <img
                        src={course.image}
                        alt={course.course_name}
                        className="rounded-xl mb-4 lg:h-80 h-55 w-full object-cover border border-white/10 group-hover:border-white/30 transition-all duration-300"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                        }}
                      />
                      <h3
                        className={`text-xl font-semibold ${s.accent.split(" ")[0]} mb-2`}
                      >
                        {course.course_name}
                      </h3>
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
                        onClick={() =>
                          navigate(
                            isMasterclass
                              ? `/masterclass/${course.id}`
                              : `/courses/${course.id}`,
                          )
                        }
                        className={`mt-auto w-full py-2 rounded-lg font-semibold border ${s.accent} text-white/90 hover:text-white transition-all duration-300`}
                      >
                        {isMasterclass
                          ? "View Masterclass ✨"
                          : isStudyMaterial
                            ? "Buy Now ✨"
                            : "Enroll Now ✨"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      <NotificationsSection />

      {/* ══════════════ WHY SECTION ══════════════ */}
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
            {REASONS.map((item, i) => (
              <div
                key={i}
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
            <span className="inline-block w-24 h-1 bg-purple-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* ══════════════ ABOUT ══════════════ */}
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
            colors, textures, and storytelling through art.
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
                Vickey's artistic vision is rooted in curiosity and constant
                exploration. Whether it's digital illustration, watercolor
                realism, or abstract compositions, each artwork aims to connect
                emotionally with its audience.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Through <strong>Artistic Vickey</strong>, the goal is to inspire
                others to see art as a language that transcends boundaries —
                celebrating creativity, diversity, and imagination.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span className="inline-block w-10 h-1 bg-purple-600 rounded-full" />
                <p className="text-gray-800 font-medium">
                  Creating art that connects hearts worldwide 🌍
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection
        homeReviews={homeReviews}
        homeReviewsLoading={homeReviewsLoading}
        homeReviewsError={homeReviewsError}
        reviewCount={reviewCount}
      />
    </div>
  );
}

export default Home;
