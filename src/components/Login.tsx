import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Lock, LogIn } from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [open, setOpen] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post("/api/auth/login", {
        identifier,
        password,
      });

      if (res.data.accessToken) {
        // ✅ Store tokens & user details
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setOpen(false);
        navigate("/");
      } else {
        throw new Error(res.data.message || "Invalid credentials");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isEmail = identifier.includes("@");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-5 py-2 font-semibold rounded-full bg-gradient-to-r from-[#6D28D9] via-[#7E3AF2] to-[#4F46E5] text-white shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300">
          Login
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#1A1446] via-[#22185A] to-[#2D1D70] text-gray-100 shadow-[0_0_25px_rgba(100,70,255,0.3)] max-w-md backdrop-blur-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent tracking-wide">
            Welcome Back ✨
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-2">
            Log in with your email or mobile number
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-5 mt-6">
          {/* Identifier */}
          <div>
            <label className="block mb-2 text-gray-200 font-medium">
              Email or Mobile Number
            </label>
            <div className="flex items-center bg-white/5 border border-white/20 rounded-xl px-3 py-2 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/40 transition-all duration-300">
              {isEmail ? (
                <Mail className="text-cyan-300 mr-2" size={18} />
              ) : (
                <Phone className="text-cyan-300 mr-2" size={18} />
              )}
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com or 9876543210"
                className="w-full bg-transparent outline-none text-gray-100 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-gray-200 font-medium">
              Password
            </label>
            <div className="flex items-center bg-white/5 border border-white/20 rounded-xl px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/40 transition-all duration-300">
              <Lock className="text-purple-300 mr-2" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-gray-100 placeholder-gray-400"
              />
            </div>
          </div>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full font-semibold text-lg bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 hover:opacity-90 shadow-lg hover:shadow-fuchsia-500/30 transition-all duration-300 flex justify-center items-center gap-2"
          >
            {loading ? "Logging in..." : (<><LogIn size={18} /> Login</>)}
          </Button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => {
              setOpen(false);
              navigate("/register");
            }}
            className="text-cyan-300 hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
}
