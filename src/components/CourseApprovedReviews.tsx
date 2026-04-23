import { useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "@/utils/axiosConfig";
import {
  Star,
  MessageSquareText,
  CalendarDays,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type ReviewUser = {
  id?: number;
  user_name?: string;
};

type ApprovedReview = {
  id: number;
  course_id: number;
  user_id: number;
  rating: number;
  review_text: string | null;
  status: "approved";
  created_at: string;
  user?: ReviewUser | null;
};

type Props = {
  courseId: number;
};

const formatDate = (date: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitial = (name?: string) => {
  if (!name?.trim()) return "S";
  return name.trim().charAt(0).toUpperCase();
};

const renderStars = (rating: number, size = "h-4 w-4") => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((value) => (
      <Star
        key={value}
        className={`${size} ${value <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-500"}`}
      />
    ))}
  </div>
);

// Avatar color palette
const AVATAR_COLORS = [
  "from-cyan-400 to-blue-500",
  "from-violet-400 to-purple-600",
  "from-emerald-400 to-teal-600",
  "from-orange-400 to-pink-500",
  "from-rose-400 to-red-600",
  "from-amber-400 to-orange-500",
];

export default function CourseApprovedReviews({ courseId }: Props) {
  const [reviews, setReviews] = useState<ApprovedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(
          `/api/course-reviews/course/${courseId}`,
        );
        if (!mounted) return;
        setReviews(data?.data || []);
      } catch {
        if (!mounted) return;
        setReviews([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (courseId) fetch();
    return () => {
      mounted = false;
    };
  }, [courseId]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((s, r) => s + Number(r.rating || 0), 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  // Rating distribution
  const ratingDist = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const rating = Math.round(Number(r.rating || 0));
      if (rating >= 1 && rating <= 5) dist[rating]++;
    });
    return dist;
  }, [reviews]);

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -360, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 360, behavior: "smooth" });

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse">
        <div className="h-6 w-44 rounded bg-white/10 mb-4" />
        <div className="flex gap-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="w-72 shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4 h-40"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!reviews.length) return null;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
            <MessageSquareText className="h-3.5 w-3.5" />
            Student Feedback
          </div>
          <h2 className="text-xl font-bold text-white">
            What students are saying
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            {reviews.length} reviews for this course
          </p>
        </div>

        {/* Rating Summary */}
        <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4 min-w-[180px]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl font-extrabold text-yellow-300 leading-none">
              {averageRating}
            </span>
            <div>
              {renderStars(Math.round(averageRating), "h-4 w-4")}
              <p className="text-xs text-gray-400 mt-1">Course Rating</p>
            </div>
          </div>
          {/* Distribution bars */}
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDist[star] || 0;
              const pct = reviews.length
                ? Math.round((count / reviews.length) * 100)
                : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-3 text-right">
                    {star}
                  </span>
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 shrink-0" />
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-7 text-right">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll controls */}
      <div className="hidden sm:flex justify-end gap-2 mb-4">
        <button
          type="button"
          onClick={scrollLeft}
          className="rounded-full border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={scrollRight}
          className="rounded-full border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Review Cards */}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-2 touch-pan-x touch-pan-y [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-6 px-6 scroll-pl-6"
      >
        <div className="flex gap-4 snap-x snap-mandatory">
          {reviews.map((review, index) => (
            <article
              key={review.id}
              className="w-[75vw] sm:w-[340px] shrink-0 snap-start rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-cyan-400/20 hover:bg-white/8 transition-all duration-300"
            >
              {/* User info */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center text-sm font-bold text-white shrink-0 shadow`}
                  >
                    {getInitial(review.user?.user_name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {review.user?.user_name || "Student"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                      <CalendarDays className="h-3 w-3 shrink-0" />
                      {formatDate(review.created_at)}
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  {renderStars(Number(review.rating || 0), "h-3.5 w-3.5")}
                </div>
              </div>

              {/* Review text */}
              <div className="rounded-xl border border-white/10 bg-slate-900/30 p-4">
                <div className="flex items-center gap-1.5 text-cyan-300 mb-2">
                  <Quote className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    Review
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-200 break-words whitespace-pre-wrap line-clamp-5">
                  {review.review_text?.trim() || "No review text provided."}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
