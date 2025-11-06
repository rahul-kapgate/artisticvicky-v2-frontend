import { useEffect, useState } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import MockTestAttempts from "@/components/MockTestAttempts";


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

  return (
    <section className="min-h-screen pt-28 pb-16 px-6 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100">
      <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(100,70,255,0.3)] p-8 sm:p-10 transition-all duration-300">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-6">
          👤 User Profile
        </h1>

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
          <div className="space-y-6">
            {/* Avatar + Basic Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-semibold shadow-md">
                {profile.user_name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-100">
                  {profile.user_name}
                </h2>
                <p className="text-gray-400 text-sm">
                  Member since{" "}
                  {new Date(profile.created_at).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4 text-gray-200">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-cyan-300" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-green-400" />
                <span>{profile.mobile}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-center mt-10">
            No user data found. Please log in.
          </p>
        )}
      </div>
      {profile && (
        <MockTestAttempts studentId={profile.id} />
      )}


    </section>
  );
}
