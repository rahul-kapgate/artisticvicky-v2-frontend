// src/utils/loadRazorpay.ts

/**
 * Lazily load the Razorpay checkout script.
 * Resolves to true once window.Razorpay is available, false on failure.
 * Safe to call multiple times — only injects the script once.
 */
let razorpayPromise: Promise<boolean> | null = null;

export function loadRazorpay(): Promise<boolean> {
  if (razorpayPromise) return razorpayPromise;

  razorpayPromise = new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") return resolve(false);

    // Already loaded
    if ((window as any).Razorpay) return resolve(true);

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => {
        razorpayPromise = null; // allow retry
        resolve(false);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      razorpayPromise = null; // allow retry
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return razorpayPromise;
}