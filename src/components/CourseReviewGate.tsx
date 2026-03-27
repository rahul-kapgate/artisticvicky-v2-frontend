import  { useEffect, useState } from "react";
import { MessageSquareText } from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import CourseReviewDialog from "@/components/CourseReviewDialog";

type ReviewStatusResponse = {
  canReview: boolean;
  hasReviewed: boolean;
  status: "pending" | "approved" | "rejected" | null;
  review: any | null;
};

type Props = {
  courseId: number;
  autoOpen?: boolean;
};

export default function CourseReviewGate({
  courseId,
  autoOpen = false,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchReviewStatus = async () => {
      try {
        setLoading(true);

        const { data } = await apiClient.get(
          `/api/course-reviews/me/course/${courseId}`,
        );

        const reviewStatus: ReviewStatusResponse | undefined = data?.data;

        const show =
          !!reviewStatus?.canReview && !reviewStatus?.hasReviewed;

        if (!mounted) return;

        setShouldShowPrompt(show);

        if (show && autoOpen) {
          setDialogOpen(true);
        }
      } catch {
        if (!mounted) return;
        setShouldShowPrompt(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (courseId) {
      fetchReviewStatus();
    }

    return () => {
      mounted = false;
    };
  }, [courseId, autoOpen]);

  if (loading || !shouldShowPrompt) return null;

  return (
    <>
      <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-500/10 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-cyan-400/10 p-3">
              <MessageSquareText className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                Add Your Course Review
              </h3>
              <p className="mt-1 text-sm text-gray-300">
                Share your feedback about this course.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center justify-center rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            Add Review
          </button>
        </div>
      </div>

      <CourseReviewDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        courseId={courseId}
        onSubmitted={() => {
          setShouldShowPrompt(false);
          setDialogOpen(false);
        }}
      />
    </>
  );
}