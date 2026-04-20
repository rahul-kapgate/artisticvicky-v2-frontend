import { useEffect, useState } from "react";
import { AlertCircle, Bell, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { apiClient } from "@/utils/axiosConfig";

type PublicNotification = {
  id: number;
  title: string;
  short_text: string;
  url?: string | null;
  category?: string | null;
  is_important: boolean;
  published_at: string;
};

type PublicNotificationResponse = {
  last_updated_at: string | null;
  items: PublicNotification[];
};

const formatDate = (iso: string | null | undefined) => {
  if (!iso) return "";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export default function NotificationsSection() {
  const [notifications, setNotifications] = useState<PublicNotification[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiClient.get<PublicNotificationResponse>(
          "/api/notifications/public",
          { params: { limit: 6 } }
        );

        setNotifications(res.data.items || []);
        setLastUpdatedAt(res.data.last_updated_at || null);
      } catch (err: any) {
        console.error("Error fetching notifications:", err);
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load notifications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // 🔹 Shared wrapper – this is the part you said is working great
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <section className="py-10 px-6 bg-gradient-to-b from-[#020617] via-[#020617] to-[#020817] text-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-[#020617] via-[#02091f] to-[#050b24] shadow-[0_0_35px_rgba(8,47,73,0.55)] overflow-hidden">
          {/* top glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
          <div className="relative px-4 sm:px-6 py-6 sm:py-7">
            {children}
          </div>
        </div>
      </div>
    </section>
  );

  if (loading) {
    return (
      <Wrapper>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400/60">
            <Bell className="w-5 h-5 text-cyan-300" />
          </span>
          <h2 className="text-2xl font-semibold">Latest Updates</h2>
        </div>
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-slate-800/50 border border-slate-700/60"
            />
          ))}
        </div>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 border border-red-400/70">
            <AlertCircle className="w-5 h-5 text-red-300" />
          </span>
          <h2 className="text-2xl font-semibold">Latest Updates</h2>
        </div>
        <p className="text-red-300 text-sm">{error}</p>
      </Wrapper>
    );
  }

  if (!notifications.length) {
    return (
      <Wrapper>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400/60">
            <Bell className="w-5 h-5 text-cyan-300" />
          </span>
          <h2 className="text-2xl font-semibold">Latest Updates</h2>
        </div>
        <p className="text-gray-300 text-sm">
          No notifications at the moment. Stay tuned for MAH AAC CET updates ✨
        </p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-400/60 shadow-[0_0_18px_rgba(34,211,238,0.45)]">
            <Bell className="w-5 h-5 text-cyan-200" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Latest Updates &amp; Notifications
            </h2>
            <p className="text-xs text-gray-300 mt-1">
              Important announcements related to MAH AAC CET and Artistic Vickey.
            </p>
          </div>
        </div>

        {lastUpdatedAt && (
          <p className="text-xs text-gray-300">
            Updated on{" "}
            <span className="font-medium text-cyan-200">
              {formatDate(lastUpdatedAt)}
            </span>
          </p>
        )}
      </div>

      {/* 📋 Real table – clean and aligned */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-2"
      >
        <div className="overflow-x-auto rounded-xl border border-slate-700/80 bg-slate-950/60">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-700/80 bg-slate-900/80">
                <th className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-wide text-slate-300/80">
                  Date
                </th>
                <th className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-wide text-slate-300/80">
                  Notification
                </th>
                <th className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-wide text-slate-300/80">
                  Category
                </th>
                <th className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-wide text-right text-slate-300/80">
                  Link
                </th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr
                  key={n.id}
                  className={`border-b border-slate-800/80 last:border-b-0 hover:bg-slate-900/80 transition-colors ${
                    n.is_important
                      ? "bg-slate-900/70"
                      : ""
                  }`}
                >
                  {/* Date */}
                  <td className="px-3 sm:px-4 py-2 align-top whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full mt-[2px] ${
                          n.is_important ? "bg-red-400" : "bg-cyan-300"
                        }`}
                      />
                      <span className="text-xs text-gray-300">
                        {formatDate(n.published_at)}
                      </span>
                    </div>
                  </td>

                  {/* Notification text */}
                  <td className="px-3 sm:px-4 py-2 align-top">
                    <div className="text-xs sm:text-sm text-gray-100">
                      {n.url ? (
                        <a
                          href={n.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-cyan-300/60 decoration-2 underline-offset-4 hover:text-cyan-200"
                        >
                          {n.short_text || n.title}
                        </a>
                      ) : (
                        n.short_text || n.title
                      )}
                    </div>
                    {n.is_important && (
                      <div className="mt-0.5 text-[10px] text-red-300 font-medium">
                        IMPORTANT
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-3 sm:px-4 py-2 align-top whitespace-nowrap">
                    {n.category ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-900 border border-slate-600 text-[11px] text-gray-200">
                        {n.category}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">—</span>
                    )}
                  </td>

                  {/* Link column */}
                  <td className="px-3 sm:px-4 py-2 align-top text-right whitespace-nowrap">
                    {n.url ? (
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border border-cyan-400/70 text-cyan-200 hover:bg-cyan-500/10"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </Wrapper>
  );
}
