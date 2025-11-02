import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Mail, Phone, User, Shield } from "lucide-react";

export default function UserProfile() {
  const { user } = useContext(AuthContext);

  return (
    <section className="min-h-screen pt-28 pb-16 px-6 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100">
      <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(100,70,255,0.3)] p-8 sm:p-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-6">
          👤 User Profile
        </h1>

        {user ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-semibold">
                {user.email?.[0]?.toUpperCase() || user.mobile?.[0] || "U"}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-100">
                  {user.email?.split("@")[0] || "User"}
                </h2>
                <p className="text-gray-400 text-sm">Member since 2025</p>
              </div>
            </div>

            <div className="space-y-4 text-gray-200">
              {user.email && (
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-cyan-300" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.mobile && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-green-400" />
                  <span>{user.mobile}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-purple-400" />
                <span>{user.is_admin ? "Admin" : "Standard User"}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-300">No user data found. Please log in.</p>
        )}
      </div>
    </section>
  );
}
