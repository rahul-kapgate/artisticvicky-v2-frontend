import { useEffect, useState } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import AttemptsList from "@/components/AttemptsList";
import PixelAvatar from "@/components/PixelAvatar";

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

  const profileCompletion = profile
    ? Math.round(
        (["user_name", "email", "mobile"].filter(
          (key) => (profile as any)[key]
        ).length /
          3) *
          100
      )
    : 0;

  return (
    <section className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : profile && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              {/* LEFT */}
              <div className="flex items-center gap-4">
                <PixelAvatar username={profile.user_name} size={80} />

                <div>
                  <h2 className="text-xl md:text-2xl font-semibold">
                    {profile.user_name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Joined {new Date(profile.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-wrap gap-2">
                {profile.is_admin && (
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-400 text-black font-semibold">
                    Admin
                  </span>
                )}
                <span className="px-3 py-1 text-xs rounded-full bg-indigo-500/20 border border-indigo-400">
                  {profileCompletion}% Complete
                </span>
              </div>
            </div>
          )}
        </div>

        {/* DETAILS GRID */}
        {!loading && profile && (
          <div className="grid md:grid-cols-1 gap-6">

            {/* CONTACT CARD */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-lg font-semibold">Contact Info</h3>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                <Mail size={18} />
                <span className="truncate">{profile.email}</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                <Phone size={18} />
                <span>{profile.mobile}</span>
              </div>
            </div>
          </div>
        )}

        {/* ATTEMPTS */}
        {profile && (
          <div className="space-y-6">
            <AttemptsList studentId={profile.id} type="mock" />
            <AttemptsList studentId={profile.id} type="pyq" />
          </div>
        )}

      </div>
    </section>
  );
}
