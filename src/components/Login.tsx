import { useState, useContext, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function Login({
  open,
  onOpenChange,
  onOpenRegister,
  onOpenForgotPassword,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOpenRegister?: () => void;
  onOpenForgotPassword?: () => void;
}) {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Controlled or internal open state
  const [internalOpen, setInternalOpen] = useState(false);
  const actualOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = onOpenChange ?? setInternalOpen;

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    identifier: "",
    password: "",
  });

  const completeLogin = useCallback(
    (data: {
      accessToken: string;
      refreshToken: string;
      user: {
        id?: number;
        user_name?: string;
        email?: string;
        mobile?: string | null;
        is_admin?: boolean;
        avatar_id?: number;
        auth_provider?: "local" | "google" | "local_google";
        profile_picture?: string | null;
      };
    }) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      login(data.user);

      toast.success("Login successful 🎉", {
        description: "Welcome back!",
      });

      handleOpenChange(false);
      navigate("/");
    },
    [handleOpenChange, login, navigate],
  );

  // ✅ Reset when dialog closes
  useEffect(() => {
    if (!actualOpen) {
      setIdentifier("");
      setPassword("");
      setShowPassword(false);
      setFieldErrors({ identifier: "", password: "" });
    }
  }, [actualOpen]);

  // ✅ Validation
  const validateFields = () => {
    const errors = { identifier: "", password: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]\d{9}$/;

    if (!identifier.trim()) {
      errors.identifier = "Please enter email or mobile number.";
    } else if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      errors.identifier = "Enter a valid email or 10-digit mobile number.";
    }

    if (!password.trim()) {
      errors.password = "Please enter your password.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(errors);
    return !errors.identifier && !errors.password;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;
    setLoading(true);

    try {
      const res = await apiClient.post("/api/auth/login", {
        identifier,
        password,
      });

      if (res.data.accessToken && res.data.refreshToken && res.data.user) {
        completeLogin(res.data);
      } else {
        toast.error(res.data.message || "Invalid login response.");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useCallback(
    async (credential: string) => {
      if (googleLoading) {
        return;
      }

      setGoogleLoading(true);

      try {
        const res = await apiClient.post("/api/auth/google", {
          credential,
        });

        if (
          !res.data?.accessToken ||
          !res.data?.refreshToken ||
          !res.data?.user
        ) {
          throw new Error("Invalid Google login response");
        }

        completeLogin(res.data);
      } catch (err: any) {
        console.error("Google login failed:", err);

        toast.error(
          err.response?.data?.message ||
            "Google login failed. Please try again.",
        );
      } finally {
        setGoogleLoading(false);
      }
    },
    [completeLogin, googleLoading],
  );

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      {/* ✅ Only show Login button when uncontrolled */}
      {open === undefined && (
        <DialogTrigger asChild>
          <Button className="px-4 py-2 rounded-lg font-semibold border border-blue-400 text-blue-100 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-sm">
            Login
          </Button>
        </DialogTrigger>
      )}

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
            <div
              className={`flex items-center bg-white/5 border ${
                fieldErrors.identifier ? "border-red-400" : "border-white/20"
              } rounded-xl px-3 py-2 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/40 transition-all duration-300`}
            >
              {identifier === "" ? (
                <User className="text-cyan-300 mr-2" size={18} />
              ) : identifier.includes("@") ? (
                <Mail className="text-cyan-300 mr-2" size={18} />
              ) : (
                <Phone className="text-cyan-300 mr-2" size={18} />
              )}
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, identifier: "" }));
                }}
                placeholder="you@example.com or 9876543210"
                className="w-full bg-transparent outline-none text-gray-100 placeholder-gray-400"
              />
            </div>
            {fieldErrors.identifier && (
              <p className="text-xs text-red-400 mt-1">
                {fieldErrors.identifier}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-gray-200 font-medium">
              Password
            </label>
            <div
              className={`flex items-center bg-white/5 border ${
                fieldErrors.password ? "border-red-400" : "border-white/20"
              } rounded-xl px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/40 transition-all duration-300`}
            >
              <Lock className="text-purple-300 mr-2" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-gray-100 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-purple-300 transition-colors ml-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-red-400 mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/*forgot password  */}
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={() => {
                onOpenForgotPassword?.();
              }}
              className="text-xs text-cyan-300 hover:text-cyan-200 underline-offset-2 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full font-semibold text-lg bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 hover:opacity-90 shadow-lg hover:shadow-fuchsia-500/30 transition-all duration-300 flex justify-center items-center gap-2"
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <LogIn size={18} /> Login
              </>
            )}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/15" />

          <span className="text-xs uppercase tracking-wider text-gray-400">
            or
          </span>

          <div className="h-px flex-1 bg-white/15" />
        </div>

        <GoogleLoginButton
          onCredential={handleGoogleLogin}
          disabled={loading || googleLoading}
        />

        {googleLoading && (
          <p className="mt-2 text-center text-sm text-gray-400">
            Signing in with Google...
          </p>
        )}

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => {
              // ✅ Close login
              handleOpenChange(false);
              // ✅ Ask parent (Header) to open Register
              onOpenRegister?.();
            }}
            className="text-cyan-300 hover:text-cyan-200 font-semibold underline-offset-2 hover:underline"
          >
            Register
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
