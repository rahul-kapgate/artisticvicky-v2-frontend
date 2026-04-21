import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface PdfViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const ZOOM_STEP = 0.15;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function PdfViewer({ url, title, onClose }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pageRendering, setPageRendering] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  /* Responsive page width based on container */
  const [pageWidth, setPageWidth] = useState(600);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        // Leave some padding; cap at a readable max
        setPageWidth(Math.min(w - 48, 800));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* PDF file config with auth header */
  const fileConfig = useMemo(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return { url };
    return {
      url,
      httpHeaders: { Authorization: `Bearer ${token}` },
      withCredentials: false,
    } as any;
  }, [url]);

  /* Navigation helpers */
  const canPrev = page > 1;
  const canNext = numPages != null && page < numPages;

  const goNext = useCallback(() => {
    if (canNext) {
      setPage((p) => p + 1);
      bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [canNext]);

  const goPrev = useCallback(() => {
    if (canPrev) {
      setPage((p) => p - 1);
      bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [canPrev]);

  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX)),
    [],
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN)),
    [],
  );

  /* Keyboard shortcuts */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      }
      // Block print
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
      }
      // Zoom with +/-
      if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        zoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        zoomOut();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev, zoomIn, zoomOut]);

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleLoad = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPage(1);
    setError(null);
    setPdfLoading(false);
  };

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={containerRef}
        className="relative flex flex-col bg-[#0c1225] rounded-2xl
                   w-[96vw] sm:w-[92vw] md:w-[85vw] lg:w-[75vw] xl:w-[65vw]
                   h-[90vh] sm:h-[88vh]
                   border border-white/[0.08] shadow-2xl shadow-black/40
                   animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-white/[0.07] bg-white/[0.02]">
          <h2 className="text-sm sm:text-base font-semibold text-gray-100 line-clamp-1 min-w-0">
            {title}
          </h2>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Zoom controls */}
            <div className="hidden sm:flex items-center gap-1 mr-2 border-r border-white/[0.08] pr-3">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/[0.08]"
                onClick={zoomOut}
                disabled={zoom <= ZOOM_MIN}
                title="Zoom out (Ctrl -)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>

              <span className="text-[11px] text-gray-400 tabular-nums w-10 text-center select-none">
                {zoomPercent}%
              </span>

              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/[0.08]"
                onClick={zoomIn}
                disabled={zoom >= ZOOM_MAX}
                title="Zoom in (Ctrl +)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Page navigation */}
            {numPages && (
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-30"
                  disabled={!canPrev}
                  onClick={goPrev}
                  title="Previous page (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <span className="text-xs text-gray-300 tabular-nums select-none min-w-[4rem] text-center">
                  {page}
                  <span className="text-gray-500"> / </span>
                  {numPages}
                </span>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-30"
                  disabled={!canNext}
                  onClick={goNext}
                  title="Next page (→)"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Close */}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 ml-1 text-gray-400 hover:text-white hover:bg-white/[0.08] rounded-lg"
              onClick={onClose}
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div
          ref={bodyRef}
          className="flex-1 overflow-auto flex items-start justify-center py-6 px-4 bg-[#080d1a]"
        >
          {/* Loading indicator */}
          {(pdfLoading || pageRendering) && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                <span className="text-xs text-gray-500">
                  {pdfLoading ? "Loading document…" : "Rendering page…"}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-3 py-12">
              <p className="text-red-400 text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setError(null);
                  setPdfLoading(true);
                  setPage(1);
                }}
              >
                Retry
              </Button>
            </div>
          )}

          <Document
            file={fileConfig}
            onLoadSuccess={handleLoad}
            onLoadError={(err) => {
              console.error("PDF load error:", err);
              setError("Failed to load PDF. Please try again.");
              setPdfLoading(false);
            }}
            loading={null} // we handle loading ourselves
          >
            <Page
              key={`page-${page}-${zoom}`}
              pageNumber={page}
              width={pageWidth * zoom}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              onRenderSuccess={() => setPageRendering(false)}
              loading={null}
              className="shadow-xl shadow-black/30 rounded-sm"
            />
          </Document>
        </div>

        {/* ── Footer (mobile zoom) ───────────────────────────────── */}
        <div className="sm:hidden flex items-center justify-center gap-3 px-4 py-2.5 border-t border-white/[0.07] bg-white/[0.02]">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={zoomOut}
            disabled={zoom <= ZOOM_MIN}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-gray-400 tabular-nums w-10 text-center">
            {zoomPercent}%
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={zoomIn}
            disabled={zoom >= ZOOM_MAX}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
