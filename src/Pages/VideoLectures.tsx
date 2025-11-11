import { useEffect, useState } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { toast } from "sonner";
import { PlayCircle, Clock } from "lucide-react";
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
  const [activeSection, setActiveSection] = useState<number | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get<{ success: boolean; data: Section[] }>("/api/section");
        if (data.success) {
          setSections(data.data);
          // Set default: first section + first video
          const first = data.data[0]?.video_lectures?.[0];
          if (first) setCurrentVideo(first);
          setActiveSection(data.data[0]?.id || null);
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
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[?&]|$)/);
    return match ? match[1] : null;
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f1b3d] via-[#152a52] to-[#1a237e] text-gray-100 pt-[12vh] pb-[4rem]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4 sm:px-6">
        {/* 📋 Sidebar */}
        <aside className="lg:w-1/3 xl:w-1/4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-4 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">📚 Sections</h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-8 rounded-md bg-white/10" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id}>
                  <button
                    className={`w-full text-left font-medium px-2 py-1 mb-1 rounded-md transition-all ${
                      activeSection === section.id
                        ? "text-cyan-300"
                        : "text-gray-300 hover:text-cyan-200"
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.title}
                  </button>

                  {/* 🎥 Video list under section */}
                  {activeSection === section.id && (
                    <div className="pl-4 border-l border-white/10 space-y-2 mt-1">
                      {section.video_lectures?.length ? (
                        section.video_lectures.map((video) => (
                          <div
                            key={video.id}
                            onClick={() => setCurrentVideo(video)}
                            className={`flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 text-sm transition-all ${
                              currentVideo?.id === video.id
                                ? "bg-cyan-500/10 text-cyan-300"
                                : "hover:bg-white/5 text-gray-300"
                            }`}
                          >
                            <PlayCircle size={16} />
                            <span className="truncate">{video.title}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 pl-2 italic">
                          No videos yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* 🎬 Video Player */}
        <main className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-4 sm:p-6">
          {loading ? (
            <Skeleton className="w-full h-[60vh] rounded-xl bg-white/10" />
          ) : !currentVideo ? (
            <p className="text-center text-gray-400 mt-10">
              Select a section and video to start watching.
            </p>
          ) : (
            <>
              <div className="w-full aspect-video mb-4 rounded-xl overflow-hidden shadow-lg border border-white/10">
                <iframe
                  src={`https://www.youtube.com/embed/${extractVideoId(currentVideo.youtube_url)}`}
                  title={currentVideo.title}
                  className="w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <h2 className="text-2xl font-semibold text-cyan-300">
                {currentVideo.title}
              </h2>
              <p className="text-gray-300 text-sm mt-2 mb-4 leading-relaxed">
                {currentVideo.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>
                    {currentVideo.duration
                      ? `${Math.floor(currentVideo.duration / 60)} min`
                      : "Duration N/A"}
                  </span>
                </div>
                <span>
                  {new Date(currentVideo.created_at).toLocaleDateString()}
                </span>
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
}
