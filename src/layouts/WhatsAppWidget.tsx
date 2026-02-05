import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type WhatsAppWidgetProps = {
  /** phone in international format, digits only. Example: "919820779554" */
  phone: string;
  /** title in the dialog */
  title?: string;
  /** small description text */
  description?: string;
  /** prefilled message (will be URL-encoded) */
  message?: string;
  /** open WhatsApp in new tab */
  newTab?: boolean;
};

function buildWhatsAppLink(phone: string, text?: string) {
  const base = `https://wa.me/${phone}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export default function WhatsAppWidget({
  phone,
  title = "Technical Support",
  description = "Interested in our courses? Chat with us on WhatsApp to learn more about admissions, batches, and workshops!",
  message,
  newTab = true,
}: WhatsAppWidgetProps) {
  const [open, setOpen] = useState(false);

  const prefilled = useMemo(() => {
    return message ?? "Hi! I want to know more.";
  }, [message]);

  const waLink = useMemo(
    () => buildWhatsAppLink(phone, prefilled),
    [phone, prefilled]
  );

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* Floating button (LEFT) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open WhatsApp support"
        className="fixed bottom-6 left-6 z-50 grid h-14 w-14 place-items-center rounded-full shadow-lg border border-black/10 bg-white hover:scale-[1.02] active:scale-[0.98] transition"
      >
        {/* Simple WhatsApp-like icon (SVG) */}
        <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M19.11 17.3c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.17.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.49s1.08 2.89 1.23 3.09c.15.2 2.12 3.24 5.14 4.54.72.31 1.29.5 1.73.64.73.23 1.39.2 1.91.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.28-.2-.58-.35z"
            fill="#22c55e"
          />
          <path
            d="M16 3C9.37 3 4 8.37 4 15c0 2.33.67 4.5 1.83 6.33L4.6 29l7.86-1.19A11.9 11.9 0 0 0 16 27c6.63 0 12-5.37 12-12S22.63 3 16 3zm0 21.8c-1.95 0-3.76-.56-5.29-1.53l-.38-.24-4.66.71.74-4.53-.25-.39A9.76 9.76 0 0 1 6.2 15C6.2 9.62 10.62 5.2 16 5.2S25.8 9.62 25.8 15 21.38 24.8 16 24.8z"
            fill="#16a34a"
          />
        </svg>
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

            {/* panel (LEFT) */}
            <div className="absolute bottom-24 left-6 w-[320px] rounded-2xl bg-white shadow-xl border border-black/10 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-black/70">{description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-2 py-1 text-sm hover:bg-black/5"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <a
                  href={waLink}
                  target={newTab ? "_blank" : undefined}
                  rel={newTab ? "noopener noreferrer" : undefined}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-white font-medium hover:bg-green-700"
                  onClick={() => setOpen(false)}
                >
                  WhatsApp Us
                </a>

              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
