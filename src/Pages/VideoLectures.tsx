import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function VideoLectures() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [showMobileContent, setShowMobileContent] = useState(false);

  // ✅ Desktop: Max view toggle (hide sidebar)
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get<{
          success: boolean;
          data: Section[];
        }>("/api/section");

        if (data.success) {
          const fetchedSections = data.data || [];
          setSections(fetchedSections);

          const firstVideo = fetchedSections[0]?.video_lectures?.[0] || null;
          if (firstVideo) setCurrentVideo(firstVideo);

          setExpandedSections(fetchedSections.map((s) => s.id));
        }
      } catch {
        toast.error("Failed to load video lectures");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const extractVideoId = (url: string): string | null => {
    // supports:
    // - youtu.be/<id>
    // - youtube.com/watch?v=<id>
    // - youtube.com/embed/<id>
    // - youtube.com/shorts/<id>
    const patterns = [
      /youtu\.be\/([0-9A-Za-z_-]{11})/,
      /v=([0-9A-Za-z_-]{11})/,
      /\/embed\/([0-9A-Za-z_-]{11})/,
      /\/shorts\/([0-9A-Za-z_-]{11})/,
    ];

    for (const p of patterns) {
      const m = url.match(p);
      if (m?.[1]) return m[1];
    }
    return null;
  };

  const currentEmbedSrc = useMemo(() => {
    if (!currentVideo) return "";
    const id = extractVideoId(currentVideo.youtube_url);

    // ✅ Standard YouTube embed with settings + fullscreen enabled
    // rel=0 keeps related videos more relevant (still YouTube-controlled)
    // modestbranding=1 is cosmetic (doesn't break settings)
    // fs=1 ensures fullscreen is allowed
    if (id) {
      const params = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        fs: "1",
        playsinline: "1",
      });
      return `https://www.youtube.com/embed/${id}?${params.toString()}`;
    }

    // fallback if url is already an embed link or something custom
    return currentVideo.youtube_url;
  }, [currentVideo]);

  const totalLectures = useMemo(() => {
    return sections.reduce(
      (sum, s) => sum + (s.video_lectures ? s.video_lectures.length : 0),
      0
    );
  }, [sections]);

  const toggleSection = (id: number) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const onSelectVideo = (video: Video) => {
    setCurrentVideo(video);
    // ✅ On mobile, close content after selecting for better viewing
    setShowMobileContent(false);
  };

  return (
    <section className="min-h-screen bg-slate-950 text-gray-100 pt-[12vh] pb-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Top controls */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-white truncate">
              Video Lectures
            </h1>
            <p className="text-[11px] text-slate-400">
              {sections.length} sections • {totalLectures} lectures
            </p>
          </div>

          {/* ✅ Desktop max view toggle */}
          <button
            type="button"
            onClick={() => setShowSidebar((p) => !p)}
            className="hidden lg:inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-100 shadow-sm hover:bg-slate-800/70 transition"
          >
            {showSidebar ? (
              <>
                <PanelRightClose className="w-4 h-4" />
                <span>Max view</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-4 h-4" />
                <span>Show content</span>
              </>
            )}
          </button>
        </div>

        <div
          className={`flex flex-col lg:flex-row gap-4 lg:gap-6 ${
            showSidebar ? "" : "lg:block"
          }`}
        >
          {/* 🎬 Left: Player */}
          <main className="flex-1 min-w-0">
            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              {loading ? (
                <Skeleton className="w-full aspect-video bg-slate-800" />
              ) : currentVideo ? (
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    src={currentEmbedSrc}
                    title={currentVideo.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center text-slate-400 text-sm">
                  No video selected yet.
                </div>
              )}

              {/* Current lecture info */}
              <div className="p-4 sm:p-5">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-7 w-2/3 bg-slate-800" />
                    <Skeleton className="h-4 w-full bg-slate-800" />
                    <Skeleton className="h-4 w-3/4 bg-slate-800" />
                  </div>
                ) : currentVideo ? (
                  <>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-400 mb-1">
                      Now Playing
                    </p>
                    <h2 className="text-lg sm:text-2xl font-semibold text-white mb-2">
                      {currentVideo.title}
                    </h2>
                    <p className="text-sm text-slate-300 mb-4">
                      {currentVideo.description || "No description provided."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>
                          {typeof currentVideo.duration === "number"
                            ? `${currentVideo.duration} min`
                            : "—"}
                        </span>
                      </div>

                      <span>
                        Published on{" "}
                        {new Date(currentVideo.created_at).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </span>

                      {currentVideo.is_free && (
                        <span className="px-2 py-0.5 rounded-full border border-emerald-400/60 text-emerald-300 text-[11px] font-medium">
                          Free Preview
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-400">
                    Select a lecture from the course content to start watching.
                  </p>
                )}
              </div>
            </div>

            {/* 📱 Mobile: toggle for course content */}
            <div className="mt-3 lg:hidden">
              <button
                type="button"
                onClick={() => setShowMobileContent((prev) => !prev)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-100 shadow-sm active:scale-[0.99] transition"
              >
                <ListVideo className="w-4 h-4" />
                <span>Course content</span>
                {showMobileContent ? (
                  <ChevronDown className="w-4 h-4 rotate-180" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </main>

          {/* 📚 Right: Course Content sidebar */}
          {showSidebar && (
            <aside
              className={`
                w-full lg:w-[320px] xl:w-[340px]
                ${showMobileContent ? "block" : "hidden"}
                lg:block
              `}
            >
              <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl max-h-[55vh] sm:max-h-[60vh] lg:max-h-[80vh] flex flex-col overflow-hidden mt-3 lg:mt-0">
                <div className="px-4 py-3 border-b border-slate-800">
                  <h3 className="text-sm font-semibold text-white">
                    Course content
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {sections.length} sections • {totalLectures} lectures
                  </p>
                </div>

                {loading ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className="w-full h-6 rounded bg-slate-800"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto">
                    {sections.length === 0 ? (
                      <p className="text-xs text-slate-400 px-4 py-3">
                        No sections available yet.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-800">
                        {sections.map((section) => {
                          const isOpen = expandedSections.includes(section.id);
                          const lectureCount = section.video_lectures?.length ?? 0;

                          return (
                            <div key={section.id} className="text-sm">
                              {/* Section header */}
                              <button
                                type="button"
                                onClick={() => toggleSection(section.id)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 hover:bg-slate-800/80 transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {isOpen ? (
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                  )}
                                  <span className="font-medium text-slate-100 text-left truncate">
                                    {section.title}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                                  {lectureCount} lecture{lectureCount !== 1 && "s"}
                                </span>
                              </button>

                              {/* Lectures */}
                              {isOpen && (
                                <div className="bg-slate-900/70">
                                  {section.video_lectures?.length ? (
                                    section.video_lectures.map((video, index) => {
                                      const isActive = currentVideo?.id === video.id;

                                      return (
                                        <button
                                          key={video.id}
                                          type="button"
                                          onClick={() => onSelectVideo(video)}
                                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs border-t border-slate-800/60 hover:bg-slate-800/60 transition-colors ${
                                            isActive
                                              ? "bg-slate-800 text-cyan-200"
                                              : "text-slate-200"
                                          }`}
                                        >
                                          <div className="flex items-center justify-center w-5">
                                            {isActive ? (
                                              <CheckCircle2 className="w-4 h-4" />
                                            ) : (
                                              <PlayCircle className="w-4 h-4" />
                                            )}
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                              <span className="truncate">
                                                {index + 1}. {video.title}
                                              </span>
                                              <span className="whitespace-nowrap text-[11px] text-slate-400">
                                                {typeof video.duration === "number"
                                                  ? `${video.duration} min`
                                                  : "—"}
                                              </span>
                                            </div>
                                          </div>
                                        </button>
                                      );
                                    })
                                  ) : (
                                    <p className="px-4 py-2 text-[11px] text-slate-400 italic">
                                      No videos in this section yet.
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
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
