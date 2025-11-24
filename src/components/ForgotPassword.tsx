import { useState, useEffect, useRef } from "react";
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/utils/axiosConfig";
import { toast } from "sonner";

export default function ForgotPassword({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const onOpenChange = setControlledOpen ?? setInternalOpen;

  const [step, setStep] = useState<"request" | "verify">("request");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Reset form
  const resetForm = () => {
    setStep("request");
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrors({
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Auto reset when dialog closes
  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errs = { ...errors, email: "" };

    if (!email.trim()) {
      errs.email = "Please enter your registered email.";
    } else if (!emailRegex.test(email)) {
      errs.email = "Enter a valid email address.";
    }

    setErrors(errs);
    return !errs.email;
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    try {
      await apiClient.post("/api/auth/forgot-password/initiate", {
        email,
      });

      toast.success("OTP sent to your email 📩");
      setStep("verify");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!otp.trim()) {
      errs.otp = "Please enter OTP.";
    }

    if (newPassword.length < 6) {
      errs.newPassword = "Password must be at least 6 characters.";
    }

    if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setErrors(errs);

    if (Object.values(errs).some((v) => v)) return;

    setLoading(true);
    try {
      await apiClient.post("/api/auth/forgot-password/verify", {
        email,
        otp,
        newPassword,
      });

      toast.success("Password reset successfully 🎉");
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#1A1446] via-[#22185A] to-[#2D1D70] text-gray-100 shadow-[0_0_25px_rgba(100,70,255,0.3)] max-w-md w-[95%] sm:w-[90%] md:w-[420px] backdrop-blur-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent tracking-wide">
            {step === "request" ? "Forgot Password?" : "Reset Password"}
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-2 text-sm sm:text-base">
            {step === "request"
              ? "Enter your registered email address to receive an OTP."
              : "Enter the OTP sent to your email and choose a new password."}
          </DialogDescription>
        </DialogHeader>

        {step === "request" ? (
          <form onSubmit={handleRequest} className="space-y-4 mt-4">
            {/* Email field */}
            <div>
              <label className="block mb-2 text-gray-200 text-sm sm:text-base font-medium">
                Email
              </label>
              <div
                className={`flex items-center bg-white/5 border ${
                  errors.email ? "border-red-400" : "border-white/20"
                } rounded-xl px-3 py-2 sm:py-2.5`}
              >
                <Mail className="text-cyan-300 mr-2" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none text-gray-100 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full font-semibold text-base sm:text-lg bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 hover:opacity-90 shadow-lg transition-all duration-300 flex justify-center items-center gap-2"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4 mt-4">
            {/* OTP boxes */}
            <OtpInput
              label="Enter OTP"
              length={6}
              value={otp}
              onChange={(v) => {
                setOtp(v);
                setErrors((prev) => ({ ...prev, otp: "" }));
              }}
              error={errors.otp}
            />

            {/* New Password */}
            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={(v) => {
                setNewPassword(v);
                setErrors((prev) => ({ ...prev, newPassword: "" }));
              }}
              error={errors.newPassword}
              show={showNewPassword}
              toggleShow={() => setShowNewPassword((s) => !s)}
            />

            {/* Confirm Password */}
            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(v) => {
                setConfirmPassword(v);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              error={errors.confirmPassword}
              show={showConfirmPassword}
              toggleShow={() => setShowConfirmPassword((s) => !s)}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full font-semibold text-base sm:text-lg bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 hover:opacity-90 shadow-lg transition-all duration-300 flex justify-center items-center gap-2"
            >
              {loading ? "Verifying..." : "Reset Password"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Reusable Fields For This Component ---------- */

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
        className={`flex items-center bg-white/5 border ${
          error ? "border-red-400" : "border-white/20"
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

function OtpInput({
  label,
  length = 6,
  value,
  onChange,
  error,
}: {
  label: string;
  length?: number;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const digits = (value || "").padEnd(length, "").slice(0, length).split("");

  const handleChangeDigit = (index: number, digit: string) => {
    const cleaned = digit.replace(/[^0-9]/g, "");
    const newDigits = [...digits];

    if (cleaned.length > 1) {
      // handle paste "123456"
      let cursor = index;
      for (let i = 0; i < cleaned.length && cursor < length; i++, cursor++) {
        newDigits[cursor] = cleaned[i];
      }
      onChange(newDigits.join(""));
      if (inputsRef.current[cursor - 1]) {
        inputsRef.current[cursor - 1]?.focus();
      }
      return;
    }

    newDigits[index] = cleaned || "";
    onChange(newDigits.join(""));

    if (cleaned && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-gray-200 text-sm sm:text-base font-medium text-center">
        {label}
      </label>

      <div className="flex justify-center gap-2 sm:gap-3">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-2xl font-semibold rounded-xl bg-white/5 border ${
              error ? "border-red-400" : "border-cyan-400/40"
            } text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 transition-all`}
            value={digits[i]}
            onChange={(e) => handleChangeDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
