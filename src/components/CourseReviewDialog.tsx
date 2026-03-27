import { useMemo, useState } from "react";
import { Star, X } from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  courseId: number;
  onSubmitted?: () => void;
};

export default function CourseReviewDialog({
  open,
  onClose,
  courseId,
  onSubmitted,
}: Props) {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => rating >= 1 && reviewText.trim().length > 0 && !submitting,
    [rating, reviewText, submitting],
  );

  const resetForm = () => {
    setRating(0);
    setReviewText("");
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
  toast.error("Please write your review");
  return;
}

    try {
      setSubmitting(true);

      const payload = {
        courseId,
        rating,
        review_text: reviewText.trim() || null,
      };

      const { data } = await apiClient.post("/api/course-reviews", payload);

      if (data?.success) {
        toast.success("Thanks for sharing your review. We appreciate your feedback!");
        resetForm();
        onSubmitted?.();
        onClose();
        return;
      }

      toast.error(data?.message || "Failed to submit review");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while submitting review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative z-[101] w-full max-w-lg rounded-3xl border border-white/10 bg-[#0f1b3d] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold text-cyan-300">
              Add Your Review
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Share your learning experience for this course.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
            disabled={submitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-5 py-5">
          <div>
            <p className="mb-3 text-sm font-medium text-gray-300">
              Your Rating
            </p>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => {
                const active = value <= rating;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="transition hover:scale-110"
                    disabled={submitting}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        active
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-500"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Review
            </label>
            <textarea
              rows={5}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your feedback here..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-cyan-400/40"
              disabled={submitting}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-200 transition hover:bg-white/10"
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
                canSubmit
                  ? "bg-cyan-600 hover:bg-cyan-500"
                  : "cursor-not-allowed bg-gray-600 opacity-70"
              }`}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
