import { useEffect, useState, useMemo } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { toast } from "sonner";
import {
  PlayCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  ListVideo,
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

          // Default: open all sections & play first lecture
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
    // supports youtu.be, ?v=, /embed/
    const shortMatch = url.match(/youtu\.be\/([0-9A-Za-z_-]{11})/);
    if (shortMatch) return shortMatch[1];

    const match = url.match(
      /(?:v=|\/embed\/|\/watch\/|\/)([0-9A-Za-z_-]{11})(?:[?&]|$)/
    );
    return match ? match[1] : null;
  };

  const totalLectures = useMemo(
    () =>
      sections.reduce(
        (sum, s) => sum + (s.video_lectures ? s.video_lectures.length : 0),
        0
      ),
    [sections]
  );

  const toggleSection = (id: number) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "Duration N/A";
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs > 0) return `${hrs}h ${remMins}m`;
    return `${mins} min`;
  };

  return (
    <section className="min-h-screen bg-slate-950 text-gray-100 pt-[15vh] pb-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* 🎬 Left: Player + current lecture details */}
        <main className="flex-1 min-w-0">
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            {loading ? (
              <Skeleton className="w-full aspect-video bg-slate-800" />
            ) : currentVideo ? (
              <div
                className="relative w-full aspect-video bg-black"
                // ❌ Block right-click (copy video URL)
                onContextMenu={(e) => e.preventDefault()}
              >
                <iframe
                  src={
                    extractVideoId(currentVideo.youtube_url)
                      ? `https://www.youtube.com/embed/${extractVideoId(
                        currentVideo.youtube_url
                      )}?rel=0&modestbranding=1&iv_load_policy=3&fs=0`
                      : currentVideo.youtube_url
                  }
                  title={currentVideo.title}
                  className="absolute inset-0 w-full h-full"
                  // Keep needed permissions, but no fullscreen button
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />

                {/* 🔒 Overlay over TOP bar (title + watch later/share/info) */}
                <div
                  className="absolute top-0 left-0 w-full h-15 z-10"
                  onClick={(e) => e.preventDefault()}
                />

                {/* 🔒 Overlay over bottom-right where YT logo/share usually is */}
                <div
                  className="absolute bottom-0 right-0 w-[22%] h-9 z-10"
                  onClick={(e) => e.preventDefault()}
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
                  <h1 className="text-lg sm:text-2xl font-semibold text-white mb-2">
                    {currentVideo.title}
                  </h1>
                  <p className="text-sm text-slate-300 mb-4">
                    {currentVideo.description || "No description provided."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(currentVideo.duration)}</span>
                    </div>
                    <span>
                      Published on{" "}
                      {new Date(currentVideo.created_at).toLocaleDateString()}
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
                <ChevronUpIcon />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </main>

        {/* 📚 Right: Course Content sidebar */}
        <aside
          className={`
            w-full lg:w-[360px] xl:w-[380px]
            ${showMobileContent ? "block" : "hidden"}
            lg:block
          `}
        >
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl max-h-[55vh] sm:max-h-[60vh] lg:max-h-[80vh] flex flex-col overflow-hidden mt-3 lg:mt-0">
            <div className="px-4 py-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white">
                Course content
              </h2>
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
                      const lectureCount =
                        section.video_lectures?.length ?? 0;

                      return (
                        <div key={section.id} className="text-sm">
                          {/* Section header */}
                          <button
                            type="button"
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 hover:bg-slate-800/80 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {isOpen ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                              <span className="font-medium text-slate-100 text-left">
                                {section.title}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {lectureCount} lecture
                              {lectureCount !== 1 && "s"}
                            </span>
                          </button>

                          {/* Lectures */}
                          {isOpen && (
                            <div className="bg-slate-900/70">
                              {section.video_lectures?.length ? (
                                section.video_lectures.map((video, index) => {
                                  const isActive =
                                    currentVideo?.id === video.id;
                                  return (
                                    <button
                                      key={video.id}
                                      type="button"
                                      onClick={() => setCurrentVideo(video)}
                                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs border-t border-slate-800/60 hover:bg-slate-800/60 transition-colors ${isActive
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
                                            {formatDuration(video.duration)}
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
      </div>
    </section>
  );
}

// Small helper so JSX above compiles – or you can just inline ChevronDown for both states
function ChevronUpIcon() {
  return <ChevronDown className="w-4 h-4 rotate-180" />;
}
