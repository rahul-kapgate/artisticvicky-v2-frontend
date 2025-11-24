import { useEffect, useState, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Better worker config for bundlers (Vite, etc.)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export default function PdfViewer({ url, title, onClose }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPage(1);
    setError(null);
  };

  // ✅ Build file config with Authorization header for react-pdf
  const fileConfig = useMemo(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // optional: set a friendly message, but still let it try
      // setError("You must be logged in to view this resource.");
      return { url }; // backend will return 401/403
    }

    return {
      url,
      // this goes directly to pdf.js fetch call:
      httpHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: false,
    } as any; // cast if TS complains
  }, [url]);

  // optional: block Ctrl/Cmd + P for light anti-print friction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onContextMenu={(e) => e.preventDefault()} // disable right-click
    >
      <div className="relative bg-[#0f172a] rounded-xl w-[100vw] h-[80vh] flex flex-col overflow-hidden border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <h2 className="text-sm sm:text-base font-semibold text-cyan-300 line-clamp-1">
            {title}
          </h2>

          <div className="flex items-center gap-3">
            {numPages && (
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ‹
                </Button>
                <span>
                  {page} / {numPages}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  //@ts-ignore
                  disabled={numPages && page >= numPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  ›
                </Button>
              </div>
            )}

            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 text-white"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-auto bg-slate-900">
          {error && (
            <p className="text-red-400 text-xs sm:text-sm mb-2">
              {error}
            </p>
          )}

          <Document
            file={fileConfig}           // 🔑 now includes Authorization header
            onLoadSuccess={handleLoad}
            onLoadError={(err) => {
              console.error("PDF load error:", err);
              setError("Failed to load PDF. Please try again.");
            }}
          >
            <Page
              pageNumber={page}
              width={400}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
