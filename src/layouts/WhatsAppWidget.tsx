import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

type WhatsAppWidgetProps = {
  phone: string; // digits only, e.g. "919820779554"
  title?: string;
  description?: string;
  message?: string;
  newTab?: boolean;

  /** left or right side */
  side?: "left" | "right";

  /** show footer line */
  showFooter?: boolean;

  /** internal route for privacy policy */
  privacyPath?: string;
};

function buildWhatsAppLink(phone: string, text?: string) {
  const base = `https://wa.me/${phone}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export default function WhatsAppWidget({
  phone,
  title = "Artistic Vickey",
  description = `Interested in our art or design courses?
Chat with us on WhatsApp to learn more about admissions, batches, and workshops!`,
  message = "Hi, I’m interested in admissions. Please share details.",
  newTab = true,
  side = "left",
  showFooter = true,
  privacyPath = "/privacy-policy",
}: WhatsAppWidgetProps) {
  const [open, setOpen] = useState(false);

  const waLink = useMemo(() => buildWhatsAppLink(phone, message), [phone, message]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const sideBtn = side === "left" ? "left-6" : "right-6";
  const sidePanel = side === "left" ? "left-6" : "right-6";

  return (
    <>
      {/* Floating WhatsApp button (better icon + WhatsApp green) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open WhatsApp support"
        className={[
          "fixed bottom-6 z-50 grid h-14 w-14 place-items-center rounded-full",
          "bg-[#25D366] text-white shadow-lg",
          "hover:brightness-95 active:scale-95 transition",
          sideBtn,
        ].join(" ")}
      >
        <FaWhatsapp className="h-7 w-7" />
      </button>

      {/* Dialog */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[60]">
            {/* overlay */}
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
              aria-label="Close dialog"
            />

            {/* panel */}
            <div
              className={[
                "absolute bottom-24 w-[380px] max-w-[92vw]",
                "rounded-2xl overflow-hidden shadow-2xl border border-black/10",
                sidePanel,
              ].join(" ")}
              role="dialog"
              aria-modal="true"
            >
              {/* header */}
              <div className="bg-[#075E54] px-5 py-4 flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg leading-none">
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="text-white/90 hover:text-white rounded-md px-2 py-1"
                >
                  ✕
                </button>
              </div>

              {/* chat area */}
              <div className="bg-[#ECE5DD] px-5 py-5 min-h-[320px]">
                <div className="max-w-[300px] rounded-xl bg-[#DCF8C6] px-4 py-4 text-[15px] leading-7 text-black/80 shadow-sm">
                  {description.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              {/* bottom area */}
              <div className="bg-white px-6 py-6">
                <a
                  href={waLink}
                  target={newTab ? "_blank" : undefined}
                  rel={newTab ? "noopener noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] text-white font-semibold text-lg py-3 shadow-sm hover:brightness-95"
                >
                  <FaWhatsapp className="h-6 w-6" />
                  WhatsApp Us
                </a>

                {showFooter && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-black/60">
                    <span className="inline-block h-3 w-3 rounded-full bg-[#25D366] shadow-[0_0_0_2px_rgba(37,211,102,0.15)]" />
                    <span>Online</span>
                    <span>|</span>
                    <Link
                      to={privacyPath}
                      className="hover:underline text-black/60"
                      onClick={() => setOpen(false)}
                    >
                      Privacy policy
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
