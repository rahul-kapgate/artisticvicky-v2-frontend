import { useEffect, useState } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import AttemptsList from "@/components/AttemptsList";

interface UserProfileData {
  id: number;
  user_name: string;
  email: string;
  mobile: string;
  is_admin: boolean;
  created_at: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get("/api/user/profile");
        if (res.data?.success && res.data.user) {
          setProfile(res.data.user);
        } else {
          setError("No user profile found.");
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to load profile.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const profileCompletion =
    profile
      ? Math.round(
          (["user_name", "email", "mobile"].filter(
            (key) => (profile as any)[key]
          ).length /
            3) *
            100
        )
      : 0;

  return (
    <section className="min-h-screen pt-28 pb-16 px-6 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100">
      <div className="max-w-[95vw] mx-auto">
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_35px_rgba(79,70,255,0.5)] p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_0_45px_rgba(109,92,255,0.8)] hover:-translate-y-0.5">
          {/* subtle glowing blobs */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -top-16 -left-20 h-40 w-40 bg-cyan-500/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-16 -right-20 h-40 w-40 bg-purple-500/20 blur-3xl rounded-full" />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-sky-400 to-purple-400 bg-clip-text text-transparent">
                👤 User Profile
              </h1>
            </div>

            {/* --- Loading State (Skeletons) --- */}
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-40 bg-white/10" />
                    <Skeleton className="h-4 w-24 bg-white/10" />
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <Skeleton className="h-4 w-56 bg-white/10" />
                  <Skeleton className="h-4 w-52 bg-white/10" />
                  <Skeleton className="h-4 w-40 bg-white/10" />
                </div>
              </div>
            ) : error ? (
              <div className="text-center text-red-400 mt-10">{error}</div>
            ) : profile ? (
              <div className="space-y-8">
                {/* Top row: Avatar + basic info + badge */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-500 flex items-center justify-center text-2xl font-semibold shadow-lg">
                        {profile.user_name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 text-[10px] px-2 py-0.5 font-medium text-white shadow-md">
                        Active
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-50">
                        {profile.user_name}
                      </h2>
                      <p className="text-gray-300 text-sm">
                        Member since{" "}
                        {new Date(profile.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-start sm:justify-end">
                    {profile.is_admin && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-semibold text-gray-900 shadow">
                        ★ Admin
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-100">
                      {profileCompletion}% complete
                    </span>
                  </div>
                </div>

                {/* Contact info */}
                <div className="grid gap-4 sm:grid-cols-2 text-sm text-gray-200">
                  <div className="space-y-1.5">
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                      Email
                    </p>
                    <button
                      type="button"
                      className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition"
                    >
                      <Mail size={16} className="text-cyan-300" />
                      <span className="truncate group-hover:underline">
                        {profile.email}
                      </span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                      Mobile
                    </p>
                    <button
                      type="button"
                      className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition"
                    >
                      <Phone size={16} className="text-green-400" />
                      <span className="group-hover:underline">
                        {profile.mobile}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 text-center mt-10">
                No user data found. Please log in.
              </p>
            )}
          </div>
        </div>
      </div>

      {profile && (
        <>
          <AttemptsList studentId={profile.id} type="mock" />
          <AttemptsList studentId={profile.id} type="pyq" />
        </>
      )}
    </section>
  );
}
