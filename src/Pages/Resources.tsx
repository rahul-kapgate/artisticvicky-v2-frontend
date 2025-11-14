import { useEffect, useState } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import PdfViewer from "@/components/PdfViewer";

interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  file_url: string;
  file_name: string;
  mime_type: string;
  created_at: string;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("All");

  const [activeResource, setActiveResource] = useState<Resource | null>(null);

  // ✅ Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get<{ success: boolean; data: Resource[] }>(
          "/api/resource/all-resources"
        );
        if (data.success) setResources(data.data);
      } catch {
        toast.error("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filtered =
    selectedType === "All"
      ? resources
      : resources.filter((r) => r.type === selectedType);

  return (
    <>
    <section className="bg-gradient-to-b from-[#0f1b3d] via-[#152a52] to-[#1a237e] text-gray-100 pt-[16vh] pb-[4rem] px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header + Filter */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-10 gap-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-cyan-300 flex items-center gap-3 justify-center sm:justify-start">
            <FileText className="w-7 h-7 sm:w-8 sm:h-8" /> Learning Resources
          </h1>

          <div className="flex flex-wrap justify-center sm:justify-end gap-2">
            <Button
              variant={selectedType === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("All")}
            >
              All
            </Button>
            {["Notes", "E-books", "PYQ", "Sessions"].map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Resource Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-48 rounded-xl bg-white/10" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm sm:text-base">
            No resources found for <span className="font-semibold">{selectedType}</span>.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((res) => (
              <Card
                key={res.id}
                className="bg-[#1b2b5f]/70 border border-white/10 p-4 sm:p-5 rounded-xl flex flex-col justify-between hover:scale-[1.02] transition-all shadow-md"
              >
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-cyan-300 mb-2">
                    {res.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {res.description || "No description provided."}
                  </p>
                  <p className="text-xs text-gray-400 italic">
                    {res.type} • {new Date(res.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={() => setActiveResource(res)}
                  className="mt-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:opacity-90 text-sm py-2"
                >
                  View 
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>

    {/* PDF Viewer Overlay */}
    {activeResource && (
      <PdfViewer
        url={activeResource.file_url}
        title={activeResource.title}
        onClose={() => setActiveResource(null)}
      />
    )}
  </>
  );
}
