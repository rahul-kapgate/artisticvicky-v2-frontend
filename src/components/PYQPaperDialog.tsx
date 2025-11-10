import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, AlertTriangle } from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import { useNavigate } from "react-router-dom";

interface PYQPaper {
  id: number;
  course_id: number;
  year: number;
  total_questions: number;
  created_at: string;
}

interface PYQPaperDialogProps {
  open: boolean;
  onClose: () => void;
  courseId: number;
}

export default function PYQPaperDialog({
  open,
  onClose,
  courseId,
}: PYQPaperDialogProps) {
  const [papers, setPapers] = useState<PYQPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const fetchPapers = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/api/pyq-mock-test/${courseId}/papers`);
        if (data.success) {
          setPapers(data.data);
          setError(null);
        } else {
          setError("Failed to load PYQ papers.");
        }
      } catch {
        setError("Network error while fetching PYQ papers.");
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [open, courseId]);

  const handleStartTest = (course_id: number) => {
    onClose();
    navigate(`/my-courses/${course_id}/pyq-mock-test`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          bg-gradient-to-b from-[#0f1b3d] via-[#182a5a] to-[#1a237e]
          border border-white/10 text-gray-100 rounded-2xl
          sm:max-w-lg w-[95vw] max-h-[85vh]
          overflow-hidden flex flex-col
          backdrop-blur-xl p-0
        "
      >
        {/* ===== HEADER ===== */}
        <DialogHeader className="text-center p-5 border-b border-white/10">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-cyan-300">
            Previous Year Papers
          </DialogTitle>
          <p className="text-gray-400 text-sm mt-1">
            Choose a paper to start the PYQ mock test
          </p>
        </DialogHeader>

        {/* ===== CONTENT AREA ===== */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-cyan-300 animate-spin" />
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-8 text-red-400">
              <AlertTriangle className="w-8 h-8 mb-2" />
              <p>{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-gradient-to-r from-pink-500 to-red-600 hover:opacity-90"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Papers List */}
          {!loading && !error && papers.length > 0 && (
            <div className="grid gap-4 sm:gap-5">
              {papers.map((paper) => (
                <div
                  key={paper.id}
                  className="
                    flex flex-col sm:flex-row sm:items-center justify-between
                    p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10
                    hover:border-cyan-400/40 hover:shadow-cyan-500/10
                    transition-all cursor-pointer
                  "
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <Calendar className="w-6 h-6 text-cyan-300 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white text-base sm:text-lg">
                        MAH AAC CET {paper.year}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {paper.total_questions} Questions
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStartTest(paper.id)}
                    className="
                      bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 
                      rounded-lg text-white px-4 py-2 w-full sm:w-auto
                    "
                  >
                    Start Test
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && papers.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No PYQ papers available yet.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
