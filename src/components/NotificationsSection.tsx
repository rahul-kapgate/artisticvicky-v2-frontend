import { useEffect, useState } from "react";
import { AlertCircle, Bell } from "lucide-react";
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
          "api/notifications/public",
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

  if (loading) {
    return (
      <section className="py-10 px-6 bg-gradient-to-b from-[#1a237e] via-[#020617] to-[#020617] text-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20">
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 px-6 bg-gradient-to-b from-[#1a237e] via-[#020617] to-[#020617] text-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10">
              <AlertCircle className="w-5 h-5 text-red-300" />
            </span>
            <h2 className="text-2xl font-semibold">Latest Updates</h2>
          </div>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      </section>
    );
  }

  if (!notifications.length) {
    return (
      <section className="py-10 px-6 bg-gradient-to-b from-[#1a237e] via-[#020617] to-[#020617] text-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20">
              <Bell className="w-5 h-5 text-cyan-300" />
            </span>
            <h2 className="text-2xl font-semibold">Latest Updates</h2>
          </div>
          <p className="text-gray-300 text-sm">
            No notifications at the moment. Stay tuned for MAH AAC CET updates ✨
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-6 bg-gradient-to-b from-[#1a237e] via-[#020617] to-[#020617] text-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-400/40">
              <Bell className="w-5 h-5 text-cyan-300" />
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

        {/* List */}
        <motion.ul
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`group rounded-xl border px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-slate-900/60 hover:bg-slate-900/90 transition-all duration-200 ${
                n.is_important
                  ? "border-red-400/60 shadow-[0_0_15px_rgba(248,113,113,0.25)]"
                  : "border-slate-700/80"
              }`}
            >
              {/* Dot + date */}
              <div className="flex items-center gap-3 min-w-[120px]">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    n.is_important ? "bg-red-400" : "bg-cyan-300"
                  }`}
                />
                <span className="text-xs text-gray-300">
                  {formatDate(n.published_at)}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-sm text-gray-100">
                  {n.url ? (
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-cyan-300/60 decoration-2 underline-offset-4 group-hover:text-cyan-200"
                    >
                      {n.short_text || n.title}
                    </a>
                  ) : (
                    n.short_text || n.title
                  )}
                </p>
                {n.category && (
                  <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">
                    {n.category}
                  </p>
                )}
              </div>

              {/* Badge */}
              {n.is_important && (
                <span className="inline-flex items-center justify-center text-[10px] px-2 py-1 rounded-full bg-red-500/15 text-red-200 border border-red-400/60">
                  IMPORTANT
                </span>
              )}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
