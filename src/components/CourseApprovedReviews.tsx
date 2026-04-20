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

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

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

const renderStars = (rating: number, size = "h-4 w-4") => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => {
        const active = value <= rating;

        return (
          <Star
            key={value}
            className={`${size} ${
              active ? "fill-yellow-400 text-yellow-400" : "text-slate-500"
            }`}
          />
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                         Course Approved Reviews UI                         */
/* -------------------------------------------------------------------------- */

export default function CourseApprovedReviews({ courseId }: Props) {
  const [reviews, setReviews] = useState<ApprovedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchApprovedReviews = async () => {
      try {
        setLoading(true);

        const { data } = await apiClient.get(
          `/api/course-reviews/course/${courseId}`,
        );

        if (!mounted) return;
        setReviews(data?.data || []);
      } catch (error) {
        console.error("Error fetching approved reviews:", error);
        if (!mounted) return;
        setReviews([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (courseId) {
      fetchApprovedReviews();
    }

    return () => {
      mounted = false;
    };
  }, [courseId]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0,
    );

    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="mt-8 sm:mt-10 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="animate-pulse">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="h-6 w-40 sm:w-52 rounded bg-white/10" />
              <div className="h-4 w-56 sm:w-72 rounded bg-white/10" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="h-20 w-full sm:w-36 rounded-2xl bg-white/10" />
              <div className="h-20 w-full sm:w-36 rounded-2xl bg-white/10" />
            </div>
          </div>

          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="w-[85vw] max-w-[300px] shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/10" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 rounded bg-white/10" />
                      <div className="h-3 w-16 rounded bg-white/10" />
                    </div>
                  </div>
                  <div className="h-5 w-16 rounded bg-white/10" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-white/10" />
                  <div className="h-4 w-11/12 rounded bg-white/10" />
                  <div className="h-4 w-9/12 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!reviews.length) {
    return null;
  }

  return (
    <section className="mt-8 sm:mt-10 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a]/80 via-[#16213e]/70 to-[#1e293b]/80 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl min-w-0">
          <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] sm:text-xs font-medium text-cyan-300">
            <MessageSquareText className="h-4 w-4 shrink-0" />
            <span className="truncate">Student Feedback</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            What students are saying
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-300">
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 w-full lg:w-auto">
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 sm:px-5 py-4">
            <p className="text-xs uppercase tracking-wide text-yellow-200/80">
              Rating
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-bold text-yellow-300">
                {averageRating}
              </span>
              {renderStars(Math.round(averageRating), "h-3.5 w-3.5 sm:h-4 sm:w-4")}
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Controls */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs sm:text-sm text-slate-400">
        </p>

        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={scrollLeft}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div
        ref={scrollRef}
        className="mt-5 overflow-x-auto pb-2 touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-4 sm:gap-5 snap-x snap-mandatory">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="w-[85vw] max-w-[320px] sm:w-[360px] sm:max-w-none shrink-0 snap-start rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/10 hover:shadow-xl"
            >
              {/* Top Section */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-bold text-white shadow-lg">
                    {getInitial(review.user?.user_name)}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm sm:text-base font-semibold text-white">
                      {review.user?.user_name || "Student"}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-[11px] sm:text-xs text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3 py-2 text-right">
                  <div className="mb-1 flex justify-end">
                    {renderStars(
                      Number(review.rating || 0),
                      "h-3.5 w-3.5 sm:h-4 sm:w-4",
                    )}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <div className="mt-4 sm:mt-5 rounded-2xl border border-white/10 bg-slate-900/30 p-4">
                <div className="mb-3 flex items-center gap-2 text-cyan-300">
                  <Quote className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide">
                    Review
                  </span>
                </div>

                <p className="text-sm leading-6 sm:leading-7 text-slate-200 break-words whitespace-pre-wrap">
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