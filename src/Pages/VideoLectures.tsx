import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { toast } from "sonner";
import {
  PlayCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  ListVideo,
  PanelRightClose,
  PanelRightOpen,
  Search,
  X,
  SkipForward,
  SkipBack,
  Loader2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Video {
  id: number;
  title: string;
  description?: string;
  youtube_url: string;
  thumbnail_url?: string;
  duration?: number;
  is_free?: boolean;
  created_at: string;
}

interface Section {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  video_lectures?: Video[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const YOUTUBE_PATTERNS = [
  /youtu\.be\/([0-9A-Za-z_-]{11})/,
  /v=([0-9A-Za-z_-]{11})/,
  /\/embed\/([0-9A-Za-z_-]{11})/,
  /\/shorts\/([0-9A-Za-z_-]{11})/,
];

function extractVideoId(url: string): string | null {
  for (const p of YOUTUBE_PATTERNS) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

function formatDuration(mins?: number): string {
  if (typeof mins !== "number") return "—";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/* ------------------------------------------------------------------ */
/*  Skeleton shimmer                                                   */
/* ------------------------------------------------------------------ */
function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-lg bg-white/[0.04] animate-pulse ${className}`} />
  );
}

/* ------------------------------------------------------------------ */
/*  Section item (memoisation-friendly)                                */
/* ------------------------------------------------------------------ */
function SectionItem({
  section,
  isOpen,
  currentVideoId,
  onToggle,
  onSelect,
}: {
  section: Section;
  isOpen: boolean;
  currentVideoId: number | null;
  onToggle: (id: number) => void;
  onSelect: (v: Video) => void;
}) {
  const lectures = section.video_lectures ?? [];
  const totalMins = lectures.reduce((s, v) => s + (v.duration ?? 0), 0);

  return (
    <div>
      {/* Section header */}
      <button
        type="button"
        onClick={() => onToggle(section.id)}
        className="w-full flex items-center gap-2.5 px-4 py-3
                   hover:bg-white/[0.03] transition-colors group"
      >
        <span className="text-gray-500 group-hover:text-gray-400 transition-colors">
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </span>

        <div className="flex-1 min-w-0 text-left">
          <p className="text-[13px] font-medium text-gray-200 truncate leading-tight">
            {section.title}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {lectures.length} lecture{lectures.length !== 1 && "s"}
            {totalMins > 0 && ` · ${formatDuration(totalMins)}`}
          </p>
        </div>
      </button>

      {/* Lecture list */}
      {isOpen && (
        <div className="pb-1">
          {lectures.length === 0 ? (
            <p className="px-10 py-2 text-[11px] text-gray-600 italic">
              No videos yet.
            </p>
          ) : (
            lectures.map((video, idx) => {
              const active = currentVideoId === video.id;
              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => onSelect(video)}
                  className={`
                    w-full flex items-center gap-3 pl-10 pr-4 py-2 text-left
                    transition-colors duration-150
                    ${
                      active
                        ? "bg-cyan-500/[0.08] text-cyan-300"
                        : "text-gray-400 hover:bg-white/[0.03] hover:text-gray-200"
                    }
                  `}
                >
                  {/* Icon */}
                  <span className="shrink-0">
                    {active ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <PlayCircle className="w-3.5 h-3.5" />
                    )}
                  </span>

                  {/* Title + duration */}
                  <span className="flex-1 min-w-0 text-[12px] leading-snug truncate">
                    {idx + 1}. {video.title}
                  </span>

                  <span className="shrink-0 text-[10px] text-gray-600 tabular-nums">
                    {formatDuration(video.duration)}
                  </span>

                  {video.is_free && (
                    <span
                      className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full
                                     border border-emerald-500/30 text-emerald-400 font-medium uppercase tracking-wider"
                    >
                      Free
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function VideoLectures() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set(),
  );
  const [showMobileContent, setShowMobileContent] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [search, setSearch] = useState("");
  const activeVideoRef = useRef<HTMLButtonElement | null>(null);

  /* ── Fetch data ─────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get<{
          success: boolean;
          data: Section[];
        }>("/api/section");
        if (cancelled) return;
        if (data.success) {
          const s = data.data ?? [];
          setSections(s);
          if (s[0]?.video_lectures?.[0])
            setCurrentVideo(s[0].video_lectures[0]);
          setExpandedSections(new Set(s.map((sec) => sec.id)));
        }
      } catch {
        toast.error("Failed to load video lectures");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Flat ordered list for prev/next ────────────────────────── */
  const allVideos = useMemo(
    () => sections.flatMap((s) => s.video_lectures ?? []),
    [sections],
  );

  const currentIndex = useMemo(
    () =>
      currentVideo ? allVideos.findIndex((v) => v.id === currentVideo.id) : -1,
    [allVideos, currentVideo],
  );

  const canPrev = currentIndex > 0;
  const canNext = currentIndex >= 0 && currentIndex < allVideos.length - 1;

  const goNext = useCallback(() => {
    if (canNext) setCurrentVideo(allVideos[currentIndex + 1]);
  }, [canNext, allVideos, currentIndex]);

  const goPrev = useCallback(() => {
    if (canPrev) setCurrentVideo(allVideos[currentIndex - 1]);
  }, [canPrev, allVideos, currentIndex]);

  /* ── Embed URL ──────────────────────────────────────────────── */
  const embedSrc = useMemo(() => {
    if (!currentVideo) return "";
    const id = extractVideoId(currentVideo.youtube_url);
    if (!id) return currentVideo.youtube_url;
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      fs: "1",
      playsinline: "1",
    });
    return `https://www.youtube.com/embed/${id}?${params}`;
  }, [currentVideo]);

  /* ── Stats ──────────────────────────────────────────────────── */
  const totalLectures = allVideos.length;
  const totalDuration = useMemo(
    () => allVideos.reduce((s, v) => s + (v.duration ?? 0), 0),
    [allVideos],
  );

  /* ── Sidebar helpers ────────────────────────────────────────── */
  const toggleSection = useCallback((id: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const onSelectVideo = useCallback((video: Video) => {
    setCurrentVideo(video);
    setShowMobileContent(false);
  }, []);

  /* ── Filtered sections for search ───────────────────────────── */
  const filteredSections = useMemo(() => {
    if (!search.trim()) return sections;
    const q = search.toLowerCase();
    return sections
      .map((s) => ({
        ...s,
        video_lectures: (s.video_lectures ?? []).filter(
          (v) =>
            v.title.toLowerCase().includes(q) ||
            v.description?.toLowerCase().includes(q),
        ),
      }))
      .filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.video_lectures?.length ?? 0) > 0,
      );
  }, [sections, search]);

  /* ── Keyboard shortcuts ─────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Only when not typing in an input
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.shiftKey && e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
      if (e.shiftKey && e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  return (
    <section className="min-h-screen bg-[#07090f] text-gray-100 pt-[15vh] pb-8 ">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-8">
        {/* ── Top bar ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-white tracking-tight truncate">
              Video Lectures
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {sections.length} section{sections.length !== 1 && "s"} ·{" "}
              {totalLectures} lecture{totalLectures !== 1 && "s"}
              {totalDuration > 0 && ` · ${formatDuration(totalDuration)} total`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSidebar((p) => !p)}
            className="hidden lg:inline-flex items-center gap-2 rounded-xl
                       border border-white/[0.06] bg-white/[0.03] px-3 py-2
                       text-xs font-medium text-gray-300
                       hover:bg-white/[0.06] transition"
          >
            {showSidebar ? (
              <>
                <PanelRightClose className="w-4 h-4" /> Max view
              </>
            ) : (
              <>
                <PanelRightOpen className="w-4 h-4" /> Show content
              </>
            )}
          </button>
        </div>

        {/* ── Main layout ──────────────────────────────────────── */}
        <div
          className={`flex flex-col lg:flex-row gap-4 lg:gap-5 ${showSidebar ? "" : "lg:block"}`}
        >
          {/* ── Player column ──────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0c0f18] shadow-2xl shadow-black/30">
              {/* Video area */}
              {loading ? (
                <Shimmer className="w-full aspect-video rounded-none" />
              ) : currentVideo ? (
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    key={currentVideo.id}
                    src={embedSrc}
                    title={currentVideo.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center text-gray-600 text-sm">
                  No video selected.
                </div>
              )}

              {/* Info + controls below player */}
              <div className="p-4 sm:p-5">
                {loading ? (
                  <div className="space-y-3">
                    <Shimmer className="h-6 w-2/3" />
                    <Shimmer className="h-4 w-full" />
                    <Shimmer className="h-4 w-3/4" />
                  </div>
                ) : currentVideo ? (
                  <>
                    {/* Now-playing label */}
                    <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/80 font-semibold mb-1.5">
                      Now Playing
                    </p>

                    <h2 className="text-base sm:text-xl font-semibold text-white leading-snug mb-2">
                      {currentVideo.title}
                    </h2>

                    {currentVideo.description && (
                      <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
                        {currentVideo.description}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-gray-500 mb-4">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(currentVideo.duration)}
                      </span>

                      <span>
                        {new Date(currentVideo.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>

                      {currentVideo.is_free && (
                        <span className="px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 text-[10px] font-medium">
                          Free Preview
                        </span>
                      )}
                    </div>

                    {/* Prev / Next buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/[0.05]">
                      <button
                        type="button"
                        disabled={!canPrev}
                        onClick={goPrev}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                   text-xs font-medium text-gray-400
                                   bg-white/[0.04] hover:bg-white/[0.07]
                                   disabled:opacity-30 disabled:pointer-events-none transition"
                      >
                        <SkipBack className="w-3.5 h-3.5" /> Previous
                      </button>

                      <button
                        type="button"
                        disabled={!canNext}
                        onClick={goNext}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                   text-xs font-medium text-gray-400
                                   bg-white/[0.04] hover:bg-white/[0.07]
                                   disabled:opacity-30 disabled:pointer-events-none transition"
                      >
                        Next <SkipForward className="w-3.5 h-3.5" />
                      </button>

                      <span className="ml-auto text-[10px] text-gray-600 tabular-nums hidden sm:block">
                        {currentIndex + 1} of {totalLectures}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    Select a lecture from the course content.
                  </p>
                )}
              </div>
            </div>

            {/* Mobile toggle */}
            <div className="mt-3 lg:hidden">
              <button
                type="button"
                onClick={() => setShowMobileContent((p) => !p)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl
                           border border-white/[0.06] bg-white/[0.03] px-3 py-2.5
                           text-xs font-medium text-gray-300 active:scale-[0.99] transition"
              >
                <ListVideo className="w-4 h-4" />
                Course content
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showMobileContent ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </main>

          {/* ── Sidebar ────────────────────────────────────────── */}
          {showSidebar && (
            <aside
              className={`
                w-full lg:w-[320px] xl:w-[350px] shrink-0
                ${showMobileContent ? "block" : "hidden"} lg:block
              `}
            >
              <div
                className="rounded-2xl border border-white/[0.06] bg-[#0c0f18]
                              shadow-xl max-h-[55vh] sm:max-h-[60vh] lg:max-h-[82vh]
                              flex flex-col overflow-hidden mt-3 lg:mt-0"
              >
                {/* Sidebar header */}
                <div className="px-4 pt-3 pb-2 border-b border-white/[0.05]">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Course content
                  </h3>

                  {/* Search */}
                  <div className="relative mb-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search lectures…"
                      className="w-full pl-8 pr-7 py-1.5 rounded-lg text-[12px]
                                 bg-white/[0.04] border border-white/[0.06]
                                 text-gray-300 placeholder:text-gray-600
                                 focus:outline-none focus:border-white/[0.12] transition-colors"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Section list */}
                {loading ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Shimmer key={i} className="w-full h-5" />
                    ))}
                  </div>
                ) : filteredSections.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-xs text-gray-600">
                      {search
                        ? `No results for "${search}"`
                        : "No sections available yet."}
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
                    {filteredSections.map((section) => (
                      <SectionItem
                        key={section.id}
                        section={section}
                        isOpen={expandedSections.has(section.id)}
                        currentVideoId={currentVideo?.id ?? null}
                        onToggle={toggleSection}
                        onSelect={onSelectVideo}
                      />
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
