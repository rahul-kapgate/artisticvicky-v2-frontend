import { useMemo, useRef, useEffect, useState } from "react";
import { Star, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

// ── Types ─────────────────────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const getReviewerInitials = (name?: string) => {
  if (!name?.trim()) return "AV";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
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

const avatarGradients = [
  "from-cyan-400 via-blue-500 to-fuchsia-500",
  "from-emerald-400 via-teal-500 to-cyan-500",
  "from-pink-400 via-fuchsia-500 to-violet-500",
  "from-amber-400 via-orange-500 to-pink-500",
  "from-violet-400 via-purple-500 to-indigo-500",
  "from-sky-400 via-cyan-500 to-emerald-400",
];
const getAvatarGradient = (name?: string) =>
  avatarGradients[(name?.charCodeAt(0) ?? 0) % avatarGradients.length];

// ── Animated Count-Up ─────────────────────────────────────────────────────────
function CountUp({
  target,
  decimals = 0,
}: {
  target: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const val = useMotionValue(0);
  const spring = useSpring(val, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (inView) animate(val, target, { duration: 1.8, ease: "easeOut" });
  }, [inView, target, val]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = v.toFixed(decimals);
    });
  }, [spring, decimals]);

  return <span ref={ref}>0</span>;
}

// ── Star Row ──────────────────────────────────────────────────────────────────
function Stars({
  rating,
  size = "w-4 h-4",
}: {
  rating: number;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((v) => (
        <Star
          key={v}
          className={`${size} ${v <= rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`}
        />
      ))}
    </div>
  );
}

// ── Rating Distribution Bar ───────────────────────────────────────────────────
function RatingDistribution({ reviews }: { reviews: HomePageReview[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const dist = useMemo(() => {
    const counts = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => Math.round(Number(r.rating)) === star)
        .length,
    }));
    const max = Math.max(...counts.map((c) => c.count), 1);
    return counts.map((c) => ({
      ...c,
      pct: Math.round((c.count / reviews.length) * 100),
      width: (c.count / max) * 100,
    }));
  }, [reviews]);

  return (
    <div ref={ref} className="space-y-2">
      {dist.map(({ star, pct, width }) => (
        <div key={star} className="flex items-center gap-3 text-sm">
          <span className="text-gray-400 w-4 text-right">{star}</span>
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-300"
              initial={{ width: 0 }}
              animate={inView ? { width: `${width}%` } : { width: 0 }}
              transition={{
                duration: 0.9,
                delay: (5 - star) * 0.08,
                ease: "easeOut",
              }}
            />
          </div>
          <span className="text-gray-400 w-8 text-right text-xs">{pct}%</span>
        </div>
      ))}
    </div>
  );
}

// ── Single Review Card ────────────────────────────────────────────────────────
function ReviewCard({
  review,
  index,
}: {
  review: HomePageReview;
  index: number;
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const text =
    review.review_text?.trim() ||
    "Very helpful course with a supportive learning experience.";
  const isLong = text.length > 180;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.04]
        hover:bg-white/[0.07] backdrop-blur-xl p-5 transition-all duration-300
        hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        hover:border-white/20 flex flex-col"
    >
      {/* Decorative quote watermark */}
      <span className="absolute top-3 right-4 text-5xl font-serif text-white/5 select-none leading-none">
        "
      </span>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with gradient ring */}
          <div
            className={`relative shrink-0 w-10 h-10 rounded-full p-[2px] bg-gradient-to-br ${getAvatarGradient(review.user?.user_name)}`}
          >
            <div className="w-full h-full rounded-full bg-[#0b1120] flex items-center justify-center text-white font-semibold text-sm">
              {getReviewerInitials(review.user?.user_name)}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-white font-semibold text-sm truncate">
                {review.user?.user_name || "Student"}
              </h3>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
            {review.course?.course_name && (
              <span
                className="inline-flex items-center gap-1 mt-0.5 rounded-full border border-cyan-400/20
                bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300 truncate max-w-[160px]"
              >
                {review.course.course_name}
              </span>
            )}
          </div>
        </div>
        <span className="text-[10px] text-gray-500 shrink-0 mt-1">
          {formatReviewDate(review.created_at)}
        </span>
      </div>

      {/* Stars */}
      <Stars rating={Number(review.rating || 0)} />

      {/* Review text with read more */}
      <p
        className={`mt-3 text-gray-300 text-sm leading-relaxed ${!expanded && isLong ? "line-clamp-4" : ""}`}
      >
        "{text}"
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition self-start"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" /> Read more
            </>
          )}
        </button>
      )}

      {/* Footer */}
      <button
        onClick={() =>
          navigate(`/courses/${review.course?.id || review.course_id}`)
        }
        className="mt-4 pt-3 border-t border-white/5 text-xs text-gray-500 hover:text-cyan-300
          transition text-left group-hover:border-white/10"
      >
        View Course →
      </button>
    </motion.div>
  );
}

// ── Marquee Row ───────────────────────────────────────────────────────────────
function ReviewMarquee({ reviews }: { reviews: HomePageReview[] }) {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!reviews.length) return;
    const track = trackRef.current;
    const first = firstRef.current;
    if (!track || !first) return;

    const speed = 0.6;

    // ── Mouse drag ──
    let isMouseDown = false;
    let startX = 0;
    let scrollStart = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      pausedRef.current = true;
      startX = e.pageX;
      scrollStart = track.scrollLeft;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      track.scrollLeft = scrollStart - (e.pageX - startX);
    };
    const onMouseUp = () => {
      isMouseDown = false;
      pausedRef.current = false;
    };

    // ── Touch drag ──
    let startTouchX = 0;
    let scrollTouchStart = 0;

    const onTouchStart = (e: TouchEvent) => {
      pausedRef.current = true;
      startTouchX = e.touches[0].pageX;
      scrollTouchStart = track.scrollLeft;
    };
    const onTouchMove = (e: TouchEvent) => {
      track.scrollLeft = scrollTouchStart - (e.touches[0].pageX - startTouchX);
    };
    const onTouchEnd = () => {
      pausedRef.current = false;
    };

    track.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: true });
    track.addEventListener("touchend", onTouchEnd);

    // ── Auto-scroll loop ──
    const step = () => {
      if (!pausedRef.current) {
        const w = first.offsetWidth;
        if (w > 0) {
          if (track.scrollLeft >= w) track.scrollLeft -= w;
          track.scrollLeft += speed;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      track.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("touchend", onTouchEnd);
    };
  }, [reviews.length]);

  const MarqueeCard = ({ review }: { review: HomePageReview }) => {
    const text = review.review_text?.trim() || "Wonderful learning experience.";
    const isLong = text.length > 180;

    return (
      <div
        className="shrink-0 w-[340px] sm:w-[380px] rounded-2xl border border-white/10 bg-white/[0.04]
        backdrop-blur-xl p-5 mx-3 cursor-pointer hover:border-white/20
        hover:bg-white/[0.07] transition-all flex flex-col relative"
        onClick={() =>
          navigate(`/courses/${review.course?.id || review.course_id}`)
        }
      >
        {/* Decorative quote watermark */}
        <span className="absolute top-3 right-4 text-5xl font-serif text-white/5 select-none leading-none">
          "
        </span>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`relative shrink-0 w-10 h-10 rounded-full p-[2px] bg-gradient-to-br ${getAvatarGradient(review.user?.user_name)}`}
            >
              <div className="w-full h-full rounded-full bg-[#0b1120] flex items-center justify-center text-white font-semibold text-sm">
                {getReviewerInitials(review.user?.user_name)}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-white font-semibold text-sm truncate">
                  {review.user?.user_name || "Student"}
                </h3>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
              {review.course?.course_name && (
                <span
                  className="inline-flex items-center gap-1 mt-0.5 rounded-full border border-cyan-400/20
                bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300 truncate max-w-[160px]"
                >
                  {review.course.course_name}
                </span>
              )}
            </div>
          </div>
          <span className="text-[10px] text-gray-500 shrink-0 mt-1">
            {formatReviewDate(review.created_at)}
          </span>
        </div>

        {/* Stars */}
        <Stars rating={Number(review.rating || 0)} />

        {/* Review text */}
        <p
          className={`mt-3 text-gray-300 text-sm leading-relaxed ${isLong ? "line-clamp-4" : ""}`}
        >
          "{text}"
        </p>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/5 text-xs text-gray-500">
          View Course →
        </div>
      </div>
    );
  };

  return (
    <div
      ref={trackRef}
      className="overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="flex py-2">
        <div className="flex" ref={firstRef}>
          {reviews.map((r) => (
            <MarqueeCard key={`a-${r.id}`} review={r} />
          ))}
        </div>
        <div className="flex">
          {reviews.map((r) => (
            <MarqueeCard key={`b-${r.id}`} review={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
interface ReviewsSectionProps {
  homeReviews: HomePageReview[];
  homeReviewsLoading: boolean;
  homeReviewsError: string | null;
  reviewCount: number | null;
}

export default function ReviewsSection({
  homeReviews,
  homeReviewsLoading,
  homeReviewsError,
  reviewCount,
}: ReviewsSectionProps) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  const reviewAverage = useMemo(() => {
    if (!homeReviews.length) return 0;
    return (
      homeReviews.reduce((s, r) => s + Number(r.rating || 0), 0) /
      homeReviews.length
    );
  }, [homeReviews]);

  const recommendPct = useMemo(() => {
    if (!homeReviews.length) return 0;
    return Math.round(
      (homeReviews.filter((r) => Number(r.rating) >= 4).length /
        homeReviews.length) *
        100,
    );
  }, [homeReviews]);

  const gridReviews = useMemo(() => {
    const base = homeReviews.slice(1);
    if (activeFilter === null) return base;
    return base.filter((r) => Math.round(Number(r.rating)) === activeFilter);
  }, [homeReviews, activeFilter]);

  const featuredReview = homeReviews[0] || null;
  const marqueeReviews = homeReviews.slice(1);

  // ── Loading ──
  if (homeReviewsLoading) {
    return (
      <section className="relative py-16 px-6 bg-gradient-to-b from-[#030712] via-[#0b1120] to-[#10194f] text-gray-100">
        <div className="max-w-7xl mx-auto animate-pulse space-y-6">
          <div className="h-10 w-64 rounded-xl bg-white/5 mx-auto" />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 h-72 rounded-3xl bg-white/5" />
            <div className="space-y-4">
              <div className="h-32 rounded-2xl bg-white/5" />
              <div className="h-32 rounded-2xl bg-white/5" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Error ──
  if (homeReviewsError) {
    return (
      <section className="py-16 px-6 bg-gradient-to-b from-[#030712] via-[#0b1120] to-[#10194f]">
        <div className="max-w-3xl mx-auto rounded-3xl border border-red-400/20 bg-red-500/10 px-6 py-8 text-center">
          <p className="text-red-300 font-medium">
            Failed to load student reviews.
          </p>
          <p className="text-red-200/80 text-sm mt-2">{homeReviewsError}</p>
        </div>
      </section>
    );
  }

  // ── Empty ──
  if (homeReviews.length === 0) {
    return (
      <section className="py-16 px-6 bg-gradient-to-b from-[#030712] via-[#0b1120] to-[#10194f]">
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center">
          <h3 className="text-2xl font-semibold text-white mb-3">
            Reviews coming soon ✨
          </h3>
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
      </section>
    );
  }

  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-[#030712] via-[#0b1120] to-[#10194f] text-gray-100 overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-24 left-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-fuchsia-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/20 bg-white/5 text-cyan-300 text-sm backdrop-blur"
          >
            <Star className="w-4 h-4 fill-cyan-300 text-cyan-300" />
            Loved by students
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mt-5 mb-3"
          >
            What Students Say About{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-300 bg-clip-text text-transparent">
              Artistic Vickey
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Honest feedback from students who learned, practiced, and grew with
            our courses and masterclasses.
          </motion.p>
        </div>

        {/* ── Featured + Stats ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-10">
          {/* Featured Review */}
          {featuredReview && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="xl:col-span-3 relative rounded-3xl border border-cyan-400/20
                bg-gradient-to-br from-white/10 via-white/5 to-cyan-500/10
                backdrop-blur-xl p-6 md:p-8 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.3)]"
            >
              <div className="absolute top-4 right-6 text-[8rem] font-serif text-white/5 leading-none select-none">
                "
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div
                  className={`relative shrink-0 w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-br ${getAvatarGradient(featuredReview.user?.user_name)}`}
                >
                  <div className="w-full h-full rounded-full bg-[#0b1120] flex items-center justify-center text-white font-bold text-xl">
                    {getReviewerInitials(featuredReview.user?.user_name)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg md:text-xl font-semibold text-white">
                      {featuredReview.user?.user_name || "Student Review"}
                    </h3>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <Stars
                      rating={Number(featuredReview.rating || 0)}
                      size="w-4 h-4"
                    />
                    {featuredReview.course?.course_name && (
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cyan-200">
                        {featuredReview.course.course_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-lg md:text-2xl leading-relaxed text-gray-100 max-w-3xl">
                "
                {featuredReview.review_text?.trim() ||
                  "A wonderful learning experience with helpful guidance and inspiring lessons."}
                "
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-400">
                  Shared on {formatReviewDate(featuredReview.created_at)}
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `/courses/${featuredReview.course?.id || featuredReview.course_id}`,
                    )
                  }
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-cyan-400/30
                    bg-cyan-500/10 text-cyan-200 font-medium hover:bg-cyan-500 hover:text-white transition"
                >
                  View Course
                </button>
              </div>
            </motion.div>
          )}

          {/* Stats Column */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            {/* Average + Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 flex-1"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-3">
                Average Rating
              </p>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-5xl font-bold text-white tabular-nums">
                  <CountUp target={reviewAverage} decimals={1} />
                </span>
                <span className="text-gray-400 mb-1.5">/ 5</span>
              </div>
              <Stars rating={Math.round(reviewAverage)} size="w-5 h-5" />
              <div className="mt-4">
                <RatingDistribution reviews={homeReviews} />
              </div>
            </motion.div>

            {/* NPS + Student Count */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-white/5 to-cyan-500/10 backdrop-blur-xl p-5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300 mb-2">
                Student Voices
              </p>
              <p className="text-4xl font-bold text-white tabular-nums">
                <CountUp target={reviewCount ?? 0} />
              </p>

              <div className="mt-4 mb-1">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Recommend rate</span>
                  <span className="text-emerald-400 font-semibold">
                    {recommendPct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${recommendPct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {recommendPct}% of students gave 4★ or higher
                </p>
              </div>

              <button
                onClick={() =>
                  document
                    .getElementById("courses")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500
                  px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                Start Your Journey
              </button>
            </motion.div>
          </div>
        </div>

        {/* ── Marquee ── mobile only */}
        {marqueeReviews.length > 0 && (
          <div className="mb-10 relative xl:hidden">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0b1120] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0b1120] to-transparent z-10 pointer-events-none" />
            <ReviewMarquee reviews={marqueeReviews} />
          </div>
        )}

        {/* ── Masonry Grid ── desktop only */}
        {gridReviews.length > 0 ? (
          <div className="hidden xl:block columns-1 sm:columns-2 xl:columns-3 gap-5 space-y-5">
            {gridReviews.map((review, index) => (
              <div key={review.id} className="break-inside-avoid">
                <ReviewCard review={review} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden xl:block text-center py-12 text-gray-500">
            No reviews found for {activeFilter}★ rating.
          </div>
        )}
      </div>
    </section>
  );
}
