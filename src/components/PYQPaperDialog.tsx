import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText } from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface PYQPaper {
  id: number;
  course_id: number;
  year: number;
  total_questions: number;
  created_at: string;
  exam_day: number | null;
}

interface PYQPaperDialogProps {
  open: boolean;
  onClose: () => void;
  courseId: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
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
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get(`/api/pyq-mock-test/${1}/papers`);
        if (cancelled) return;
        data.success
          ? setPapers(data.data)
          : setError("Failed to load papers.");
      } catch {
        if (!cancelled) setError("Network error.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, courseId]);

  /* Group by year descending, days sorted */
  const grouped = useMemo(() => {
    const map = new Map<number, PYQPaper[]>();
    for (const p of papers) {
      if (!map.has(p.year)) map.set(p.year, []);
      map.get(p.year)!.push(p);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => b - a)
      .map(([year, yp]) => ({
        year,
        papers: yp.sort((a, b) => (a.exam_day ?? 0) - (b.exam_day ?? 0)),
      }));
  }, [papers]);

  const handleStart = useCallback(
    (paperId: number) => {
      onClose();
      navigate(`/my-courses/${paperId}/pyq-mock-test`);
    },
    [onClose, navigate],
  );

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    (async () => {
      try {
        const { data } = await apiClient.get(`/api/pyq-mock-test/${1}/papers`);
        data.success
          ? setPapers(data.data)
          : setError("Failed to load papers.");
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          bg-[#0c1020] border border-white/[0.08] text-gray-100 rounded-2xl
          sm:max-w-md w-[92vw] max-h-[80vh]
          overflow-hidden flex flex-col p-0 shadow-2xl gap-0
        "
      >
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-lg font-semibold text-white">
            Previous Year Papers
          </DialogTitle>
          {!loading && papers.length > 0 && (
            <p className="text-[12px] text-gray-500 mt-1">
              {papers.length} paper{papers.length !== 1 ? "s" : ""} available
            </p>
          )}
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading skeleton — mirrors actual layout */}
          {loading && (
            <div className="px-2 pb-3 animate-pulse">
              {[1, 2, 3].map((g) => (
                <div key={g}>
                  <div className="flex items-center gap-3 px-3 pt-3 pb-1.5">
                    <div className="h-4 w-10 rounded bg-white/[0.06]" />
                    <div className="flex-1 h-px bg-white/[0.04]" />
                  </div>
                  {[1, 2].map((r) => (
                    <div
                      key={r}
                      className="flex items-center gap-3 px-3 py-2.5"
                    >
                      <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
                      <div className="flex-1 h-3.5 rounded bg-white/[0.05]" />
                      <div className="h-3 w-7 rounded bg-white/[0.04]" />
                      <div className="h-6 w-12 rounded-md bg-white/[0.04]" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center py-14 px-6 text-center">
              <AlertTriangle className="w-6 h-6 text-red-400/70 mb-2" />
              <p className="text-sm text-gray-400 mb-4">{error}</p>
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="rounded-lg border-white/[0.1] text-gray-400 hover:bg-white/[0.05] text-xs"
              >
                Try again
              </Button>
            </div>
          )}

          {/* Papers grouped by year */}
          {!loading && !error && grouped.length > 0 && (
            <div className="px-2 pb-3">
              {grouped.map(({ year, papers: yp }) => (
                <div key={year}>
                  {/* Year divider */}
                  <div className="flex items-center gap-3 px-3 pt-3 pb-1.5">
                    <span className="text-[13px] font-semibold text-white tabular-nums">
                      {year}
                    </span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>

                  {/* Paper rows for this year */}
                  {yp.map((paper) => (
                    <button
                      key={paper.id}
                      type="button"
                      onClick={() => handleStart(paper.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5
                                 rounded-lg hover:bg-white/[0.05] transition-colors group"
                    >
                      {/* Dot */}
                      <span className="w-2 h-2 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors shrink-0" />

                      {/* Label */}
                      <span className="flex-1 text-left text-[13px] text-gray-400 group-hover:text-gray-200 transition-colors">
                        {paper.exam_day
                          ? `MAH AAC CET ${year} — Day ${paper.exam_day}`
                          : `MAH AAC CET ${year}`}
                      </span>

                      {/* Question count */}
                      <span className="text-[11px] text-gray-600 tabular-nums shrink-0">
                        {paper.total_questions}Q
                      </span>

                      {/* Start pill */}
                      <span
                        className="text-[11px] font-medium text-cyan-500 bg-cyan-500/[0.08]
                                       px-2.5 py-1 rounded-md
                                       group-hover:bg-cyan-500/15 group-hover:text-cyan-400
                                       transition-all shrink-0"
                      >
                        Start
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && papers.length === 0 && (
            <div className="flex flex-col items-center py-14 text-center">
              <FileText className="w-6 h-6 text-gray-700 mb-2" />
              <p className="text-sm text-gray-500">No papers available yet.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
