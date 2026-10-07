import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Trash2, X, ShieldAlert } from "lucide-react";

import {
  requestDeleteAccountOtp,
  verifyDeleteAccountOtp,
} from "@/services/accountDeletion.service";

type Step = "idle" | "confirm" | "otp" | "success";

const DeleteAccountSection = () => {
  const [step, setStep] = useState<Step>("idle");

  const [otp, setOtp] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [deletionScheduledAt, setDeletionScheduledAt] = useState<string | null>(
    null,
  );

  const requestOtpMutation = useMutation({
    mutationFn: requestDeleteAccountOtp,

    onSuccess: () => {
      setErrorMessage("");
      setOtp("");
      setStep("otp");
    },

    onError: (error: any) => {
      setErrorMessage(
        error?.response?.data?.message || "Failed to send verification code.",
      );
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: () => verifyDeleteAccountOtp(otp),

    onSuccess: (data) => {
      setErrorMessage("");

      if (data.deletionScheduledAt) {
        setDeletionScheduledAt(data.deletionScheduledAt);
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setStep("success");
    },

    onError: (error: any) => {
      setErrorMessage(
        error?.response?.data?.message ||
          "Invalid or expired verification code.",
      );
    },
  });

  const closeModal = () => {
    if (requestOtpMutation.isPending || verifyOtpMutation.isPending) {
      return;
    }

    setStep("idle");
    setOtp("");
    setErrorMessage("");
  };

  const formattedDeletionDate = deletionScheduledAt
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(new Date(deletionScheduledAt))
    : null;

  return (
    <>
      {/* ==========================================
          DELETE ACCOUNT SECTION
      ========================================== */}

      <section className="mt-10 overflow-hidden rounded-2xl border border-[#2a3158] bg-[#090e23]">
        <div className="h-[2px] w-full bg-gradient-to-r from-red-500/70 via-red-500/20 to-transparent" />

        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                <AlertTriangle size={19} className="text-red-400" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7485b3]">
                  Account
                </p>

                <h2 className="mt-1 text-lg font-semibold text-[#f2f5ff]">
                  Delete Account
                </h2>
              </div>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[#8492b8]">
              Your account will be scheduled for permanent deletion. You will
              have 30 days to reactivate it before your account and associated
              data are permanently removed.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setStep("confirm")}
            className="
              inline-flex shrink-0 items-center justify-center gap-2
              rounded-xl border border-red-500/40
              bg-red-500/10 px-5 py-3
              text-sm font-semibold text-red-400
              transition-all duration-200
              hover:border-red-500/60
              hover:bg-red-500
              hover:text-white
            "
          >
            <Trash2 size={17} />
            Delete Account
          </button>
        </div>
      </section>

      {/* CONFIRMATION */}

      {step === "confirm" && (
        <Modal onClose={closeModal}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
            <AlertTriangle size={23} className="text-red-400" />
          </div>

          <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-[#6f80aa]">
            Account deletion
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Delete your account?
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#8c99bb]">
            We'll send a verification code to your registered email address
            before scheduling your account for deletion.
          </p>

          <div className="mt-5 flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.07] p-4">
            <ShieldAlert size={19} className="mt-0.5 shrink-0 text-amber-400" />

            <p className="text-sm leading-6 text-[#c6b98b]">
              You will have <strong className="text-amber-300">30 days</strong>{" "}
              to reactivate your account before permanent deletion.
            </p>
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              disabled={requestOtpMutation.isPending}
              className="rounded-xl border border-[#30385f] bg-[#0b1128] px-5 py-2.5 text-sm font-medium text-[#9aa8ca] transition hover:border-[#43517f] hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={requestOtpMutation.isPending}
              onClick={() => requestOtpMutation.mutate()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {requestOtpMutation.isPending && (
                <Loader2 size={16} className="animate-spin" />
              )}
              Send Verification Code
            </button>
          </div>
        </Modal>
      )}

      {/* OTP */}

      {step === "otp" && (
        <Modal onClose={closeModal}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#5067d8]/30 bg-[#5067d8]/10">
            <ShieldAlert size={22} className="text-[#7d91ff]" />
          </div>

          <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-[#6f80aa]">
            Verification
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Enter verification code
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#8c99bb]">
            Enter the 6-digit OTP sent to your registered email address.
          </p>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(event) => {
              const value = event.target.value.replace(/\D/g, "");

              setOtp(value);
              setErrorMessage("");
            }}
            placeholder="000000"
            className="
              mt-6 w-full rounded-xl
              border border-[#30385f]
              bg-[#070c1e]
              px-4 py-4
              text-center text-2xl font-semibold
              tracking-[0.5em]
              text-white
              outline-none
              transition
              placeholder:text-[#394365]
              focus:border-[#586bd6]
              focus:ring-2
              focus:ring-[#586bd6]/20
            "
          />

          {errorMessage && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          <button
            type="button"
            disabled={otp.length !== 6 || verifyOtpMutation.isPending}
            onClick={() => verifyOtpMutation.mutate()}
            className="
              mt-6 inline-flex w-full items-center
              justify-center gap-2 rounded-xl
              bg-gradient-to-r
              from-[#4354c7]
              to-[#6675e6]
              px-4 py-3
              text-sm font-semibold text-white
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {verifyOtpMutation.isPending && (
              <Loader2 size={16} className="animate-spin" />
            )}
            Verify & Schedule Deletion
          </button>

          <button
            type="button"
            disabled={requestOtpMutation.isPending}
            onClick={() => requestOtpMutation.mutate()}
            className="mt-4 w-full text-center text-sm font-medium text-[#7487d8] transition hover:text-[#9eacff]"
          >
            Resend verification code
          </button>
        </Modal>
      )}

      {/* SUCCESS */}

      {step === "success" && (
        <Modal showClose={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#5067d8]/30 bg-[#5067d8]/10">
            <Trash2 size={21} className="text-[#8294ff]" />
          </div>

          <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-[#6f80aa]">
            Request confirmed
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Account deletion scheduled
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#8c99bb]">
            Your AV Art Academy account is now scheduled for permanent deletion.
          </p>

          {formattedDeletionDate && (
            <div className="mt-5 rounded-xl border border-[#29325b] bg-[#070c1e] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#66759e]">
                Permanent deletion date
              </p>

              <p className="mt-2 text-lg font-semibold text-[#dce4ff]">
                {formattedDeletionDate}
              </p>
            </div>
          )}

          <p className="mt-5 text-sm leading-6 text-[#8c99bb]">
            You can reactivate your account by signing in again before the
            deletion date.
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#4354c7] to-[#6675e6] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Continue
          </button>
        </Modal>
      )}
    </>
  );
};

export default DeleteAccountSection;

interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  showClose?: boolean;
}

const Modal = ({ children, onClose, showClose = true }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#02050f]/80 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#29325a] bg-[#090e23] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6675e6]/60 to-transparent" />

        {showClose && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg border border-[#29325a] bg-[#0c122c] p-2 text-[#69789f] transition hover:text-white"
          >
            <X size={17} />
          </button>
        )}

        {children}
      </div>
    </div>
  );
};
