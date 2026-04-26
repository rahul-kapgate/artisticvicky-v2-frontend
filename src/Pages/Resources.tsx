import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom"; 
import { apiClient } from "@/utils/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  FileText,
  BookOpen,
  ScrollText,
  Video,
  Library,
  Search,
  X,
} from "lucide-react";
import PdfViewer from "@/components/PdfViewer";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  file_url: string;
  file_name: string;
  mime_type: string;
  course_id: number; 
  created_at: string;
}

const RESOURCE_TYPES = ["All", "Notes", "E-books", "PYQ", "Sessions"] as const;
type ResourceType = (typeof RESOURCE_TYPES)[number];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const getResourceStreamUrl = (resourceId: number) => {
  const baseURL = apiClient.defaults.baseURL?.replace(/\/+$/, "") || "";
  return `${baseURL}/api/resource/${resourceId}/file`;
};

const typeIcons: Record<string, React.ReactNode> = {
  Notes: <ScrollText className="w-4 h-4" />,
  "E-books": <BookOpen className="w-4 h-4" />,
  PYQ: <FileText className="w-4 h-4" />,
  Sessions: <Video className="w-4 h-4" />,
};

const typeAccents: Record<string, string> = {
  Notes: "from-amber-400 to-orange-500",
  "E-books": "from-emerald-400 to-teal-500",
  PYQ: "from-rose-400 to-pink-500",
  Sessions: "from-violet-400 to-purple-500",
};

/* ------------------------------------------------------------------ */
/*  Skeleton card                                                      */
/* ------------------------------------------------------------------ */
function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-white/[0.08]" />
        <div className="h-3 w-16 rounded bg-white/[0.08]" />
      </div>
      <div className="h-4 w-3/4 rounded bg-white/[0.08] mb-2" />
      <div className="h-3 w-full rounded bg-white/[0.06] mb-1" />
      <div className="h-3 w-2/3 rounded bg-white/[0.06] mb-6" />
      <div className="h-9 w-full rounded-xl bg-white/[0.06]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Resource card                                                      */
/* ------------------------------------------------------------------ */
function ResourceCard({
  resource,
  index,
  onView,
}: {
  resource: Resource;
  index: number;
  onView: (r: Resource) => void;
}) {
  const accent = typeAccents[resource.type] ?? "from-cyan-400 to-blue-500";
  const icon = typeIcons[resource.type] ?? <FileText className="w-4 h-4" />;

  return (
    <Card
      className="group relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.07]
                 rounded-2xl p-5 flex flex-col justify-between
                 hover:bg-white/[0.07] hover:border-white/[0.14]
                 transition-all duration-300 ease-out shadow-lg shadow-black/10"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Accent stripe */}
      <div
        className={`absolute top-0 left-5 right-5 h-[2px] rounded-b bg-gradient-to-r ${accent} opacity-50 group-hover:opacity-100 transition-opacity`}
      />

      <div>
        {/* Type badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase
                         bg-gradient-to-r ${accent} bg-clip-text text-transparent`}
          >
            {icon}
            {resource.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-gray-100 leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-4">
          {resource.description || "No description provided."}
        </p>

        {/* Date */}
        <p className="text-[11px] text-gray-500 tabular-nums">
          {new Date(resource.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <Button
        onClick={() => onView(resource)}
        className={`mt-4 w-full bg-gradient-to-r ${accent} text-white text-sm font-medium
                    rounded-xl py-2.5 opacity-85 hover:opacity-100
                    transition-opacity duration-200 shadow-none`}
      >
        View Resource
      </Button>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function Resources() {
  // ✅ Pull courseId from /my-courses/:courseId/resources
  const { courseId } = useParams<{ courseId: string }>();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ResourceType>("All");
  const [search, setSearch] = useState("");
  const [activeResource, setActiveResource] = useState<Resource | null>(null);

  // ✅ Fetch resources filtered by courseId from the backend
  useEffect(() => {
    if (!courseId) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get<{
          success: boolean;
          data: Resource[];
        }>("/api/resource/all-resources", {
          params: { course_id: courseId }, // ✅ pass as query param
        });
        if (!cancelled && data.success) setResources(data.data);
      } catch {
        toast.error("Failed to load resources");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId]); // ✅ re-fetch if courseId changes

  /* Derived counts — memoised */
  const typeCounts = useMemo(() => {
    const map: Record<string, number> = { All: resources.length };
    for (const r of resources) map[r.type] = (map[r.type] || 0) + 1;
    return map;
  }, [resources]);

  /* Filtered list — memoised (type + search only, course filter is done server-side) */
  const filtered = useMemo(() => {
    let list =
      selectedType === "All"
        ? resources
        : resources.filter((r) => r.type === selectedType);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [resources, selectedType, search]);

  const handleView = useCallback((r: Resource) => setActiveResource(r), []);

  // ✅ Guard: no courseId in URL
  if (!courseId) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Invalid course URL.</p>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-[#0a0f1e] text-gray-100 pt-[14vh] pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/[0.06] blur-[120px]" />
          <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.05] blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Library className="w-6 h-6 text-cyan-400" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Learning Resources
              </h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base max-w-lg">
              Browse notes, e-books, past papers, and recorded sessions — all in
              one place.
            </p>
          </div>

          {/* Toolbar: filters + search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            {/* Type pills */}
            <div className="flex flex-wrap gap-2">
              {RESOURCE_TYPES.map((type) => {
                const active = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`
                      px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide
                      border transition-all duration-200
                      ${
                        active
                          ? "bg-white/[0.12] border-white/20 text-white"
                          : "bg-transparent border-white/[0.08] text-gray-400 hover:text-gray-200 hover:border-white/[0.14]"
                      }
                    `}
                  >
                    {type}
                    {typeCounts[type] != null && (
                      <span className="ml-1.5 text-[10px] opacity-60">
                        {typeCounts[type]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative sm:ml-auto w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources…"
                className="w-full pl-9 pr-8 py-2 rounded-xl text-sm
                           bg-white/[0.05] border border-white/[0.08]
                           text-gray-200 placeholder:text-gray-500
                           focus:outline-none focus:border-white/20 focus:bg-white/[0.07]
                           transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                {search
                  ? `No results for "${search}"`
                  : `No resources found for ${selectedType}.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((res, i) => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  index={i}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PDF Viewer Overlay */}
      {activeResource && (
        <PdfViewer
          url={getResourceStreamUrl(activeResource.id)}
          title={activeResource.title}
          onClose={() => setActiveResource(null)}
        />
      )}
    </>
  );
}
