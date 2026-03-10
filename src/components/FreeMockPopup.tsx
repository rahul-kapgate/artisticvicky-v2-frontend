import { useContext, useEffect, useRef, useState } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "@/context/AuthContext";

const DISMISS_KEY = "free_mock_popup_dismissed_until";
const DISMISS_DAYS = 5;

type AuthMode = "login" | "register";

function FreeMockPopup() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const hasShownRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const openAuthModal = (mode: AuthMode) => {
    window.dispatchEvent(
      new CustomEvent("open-auth-modal", {
        detail: { mode },
      }),
    );
  };

  const dismissForDays = () => {
    const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(until));
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissForDays();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (user) return;

    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) return;

    const showPopup = () => {
      if (hasShownRef.current) return;
      hasShownRef.current = true;
      setOpen(true);
    };

    timerRef.current = window.setTimeout(showPopup, 12000);

    const handleScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = window.scrollY / maxScroll;
      if (progress >= 0.35) showPopup();
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      if (e.clientY <= 10) showPopup();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [user]);

  if (user) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close popup backdrop"
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismissForDays}
          />

          <div className="fixed inset-0 z-[101] flex items-end justify-center px-3 py-3 sm:items-center sm:px-4">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-md"
            >
              <div
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#09112d] via-[#111b56] to-[#19257f] text-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-fuchsia-500/20 blur-3xl" />

                <button
                  onClick={dismissForDays}
                  className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
                  aria-label="Close popup"
                >
                  <X size={18} />
                </button>

                <div className="relative p-5 sm:p-6">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200 border border-cyan-300/20">
                    <Sparkles size={14} />
                    Free Mock Test
                  </div>

                  <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                    Get <span className="text-cyan-300">3 Free Mock Tests</span>
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-200">
                    Register to start free practice.
                    <br />
                    Already registered? Login and continue.
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white/10 p-3 text-center border border-white/10">
                      <div className="text-lg font-semibold text-cyan-300">3</div>
                      <div className="text-xs text-slate-200">Attempts</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3 text-center border border-white/10">
                      <div className="text-lg font-semibold text-cyan-300">Quick</div>
                      <div className="text-xs text-slate-200">Signup</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3 text-center border border-white/10">
                      <div className="text-lg font-semibold text-cyan-300">Easy</div>
                      <div className="text-xs text-slate-200">Start</div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => {
                        setOpen(false);
                        openAuthModal("register");
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 sm:flex-1"
                    >
                      Register Free
                      <ArrowRight size={16} />
                    </button>

                    <button
                      onClick={() => {
                        setOpen(false);
                        openAuthModal("login");
                      }}
                      className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15 sm:flex-1"
                    >
                      Login
                    </button>
                  </div>

                  <p className="mt-4 text-center text-[11px] text-slate-300">
                    Free practice before full course.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default FreeMockPopup;