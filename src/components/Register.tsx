import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import { toast } from "sonner";

export default function Register({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const onOpenChange = setControlledOpen ?? setInternalOpen;

  const [step, setStep] = useState<"initiate" | "verify">("initiate");
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    user_name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  // ✅ Reset form function
  const resetForm = () => {
    setStep("initiate");
    setFormData({
      user_name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      otp: "",
    });
    setErrors({
      user_name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      otp: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // ✅ Auto reset form when dialog closes
  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const validateInitiate = () => {
    const errs = { user_name: "", email: "", mobile: "", password: "", confirmPassword: "", otp: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.user_name.trim()) errs.user_name = "Please enter your name.";
    if (!emailRegex.test(formData.email)) errs.email = "Enter a valid email address.";
    if (!phoneRegex.test(formData.mobile)) errs.mobile = "Enter a valid 10-digit mobile number.";
    if (formData.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";

    setErrors(errs);
    return Object.values(errs).every((e) => e === "");
  };

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInitiate()) return;
    setLoading(true);

    try {
      const res = await apiClient.post("/api/auth/signup/initiate", {
        user_name: formData.user_name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });

      if (res.data?.message) {
        toast.success("OTP sent to your email 📩");
        setStep("verify");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp.trim()) {
      setErrors((p) => ({ ...p, otp: "Please enter OTP." }));
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/api/auth/signup/verify", {
        email: formData.email,
        otp: formData.otp,
      });

      if (res.data?.message) {
        toast.success("Account created successfully 🎉");
        resetForm();
        onOpenChange(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 rounded-lg font-semibold border border-cyan-400 text-cyan-100 hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-600 transition-all duration-300 shadow-sm">
          Register
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
    rounded-3xl border border-white/10
    bg-gradient-to-b from-[#1A1446] via-[#22185A] to-[#2D1D70]
    text-gray-100 shadow-[0_0_25px_rgba(100,70,255,0.3)]
    backdrop-blur-xl
    max-w-md w-[95%] sm:w-[90%] md:w-[420px]
    mx-auto px-4 sm:px-6 py-6 sm:py-8
    max-h-[90vh] overflow-y-auto hide-scrollbar
  "
      >

        {/* Responsive header */}
        <DialogHeader className="text-center space-y-1">
          <DialogTitle className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent tracking-wide">
            {step === "initiate" ? "Create Your Account ✨" : "Verify OTP 🔐"}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm sm:text-base mt-1 sm:mt-2">
            {step === "initiate"
              ? "Register using your details below"
              : "Enter the OTP sent to your email"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4 sm:space-y-5">
          {step === "initiate" ? (
            <form onSubmit={handleInitiate} className="space-y-4">
              <Field
                label="Full Name"
                icon={<User className="text-cyan-300 mr-2" size={18} />}
                value={formData.user_name}
                onChange={(v) => handleChange("user_name", v)}
                error={errors.user_name}
                placeholder="John Doe"
              />

              <Field
                label="Email"
                icon={<Mail className="text-cyan-300 mr-2" size={18} />}
                value={formData.email}
                onChange={(v) => handleChange("email", v)}
                error={errors.email}
                placeholder="you@example.com"
              />

              <Field
                label="Mobile"
                icon={<Phone className="text-cyan-300 mr-2" size={18} />}
                value={formData.mobile}
                onChange={(v) => handleChange("mobile", v)}
                error={errors.mobile}
                placeholder="9876543210"
              />

              <PasswordField
                label="Password"
                value={formData.password}
                onChange={(v) => handleChange("password", v)}
                error={errors.password}
                show={showPassword}
                toggleShow={() => setShowPassword(!showPassword)}
              />

              <PasswordField
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(v) => handleChange("confirmPassword", v)}
                error={errors.confirmPassword}
                show={showConfirmPassword}
                toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-full font-semibold text-base sm:text-lg bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 hover:opacity-90 shadow-lg transition-all duration-300 flex justify-center items-center gap-2"
              >
                {loading ? "Sending OTP..." : "Register"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <Field
                label="Enter OTP"
                icon={<CheckCircle className="text-cyan-300 mr-2" size={18} />}
                value={formData.otp}
                onChange={(v) => handleChange("otp", v)}
                error={errors.otp}
                placeholder="Enter OTP"
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-full font-semibold text-base sm:text-lg bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 hover:opacity-90 shadow-lg transition-all duration-300 flex justify-center items-center gap-2"
              >
                {loading ? "Verifying..." : "Verify & Register"}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Reusable Fields ---------- */
function Field({
  label,
  icon,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block mb-1 text-gray-200 text-sm sm:text-base font-medium">
        {label}
      </label>
      <div
        className={`flex items-center bg-white/5 border ${error ? "border-red-400" : "border-white/20"
          } rounded-xl px-3 py-2 sm:py-2.5`}
      >
        {icon}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-gray-100 placeholder-gray-400 text-sm sm:text-base"
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  error,
  show,
  toggleShow,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  show: boolean;
  toggleShow: () => void;
}) {
  return (
    <div>
      <label className="block mb-1 text-gray-200 text-sm sm:text-base font-medium">
        {label}
      </label>
      <div
        className={`flex items-center bg-white/5 border ${error ? "border-red-400" : "border-white/20"
          } rounded-xl px-3 py-2 sm:py-2.5`}
      >
        <Lock className="text-purple-300 mr-2" size={18} />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-transparent outline-none text-gray-100 placeholder-gray-400 text-sm sm:text-base"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="text-gray-400 hover:text-purple-300 ml-2"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
