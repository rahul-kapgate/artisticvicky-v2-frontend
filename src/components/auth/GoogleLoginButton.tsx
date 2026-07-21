import { useEffect, useRef } from "react";

interface GoogleLoginButtonProps {
  onCredential: (credential: string) => void | Promise<void>;
  disabled?: boolean;
}

export default function GoogleLoginButton({
  onCredential,
  disabled = false,
}: GoogleLoginButtonProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let retryTimeout: ReturnType<typeof setTimeout> | undefined;
    let resizeObserver: ResizeObserver | undefined;

    const renderGoogleButton = () => {
      if (
        !window.google ||
        !wrapperRef.current ||
        !buttonContainerRef.current
      ) {
        retryTimeout = setTimeout(renderGoogleButton, 200);
        return;
      }

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error(
          "VITE_GOOGLE_CLIENT_ID is missing from frontend environment",
        );
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response.credential) {
            console.error("Google credential was not returned");
            return;
          }

          await onCredential(response.credential);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      const availableWidth = wrapperRef.current.clientWidth;

      // Google button supports numeric pixel width.
      // Keep it inside the available mobile/container width.
      const buttonWidth = Math.max(
        220,
        Math.min(availableWidth, 380),
      );

      buttonContainerRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(
        buttonContainerRef.current,
        {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width: buttonWidth,
        },
      );
    };

    renderGoogleButton();

    if (wrapperRef.current) {
      resizeObserver = new ResizeObserver(() => {
        renderGoogleButton();
      });

      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }

      resizeObserver?.disconnect();
      window.google?.accounts.id.cancel();
    };
  }, [onCredential]);

  return (
    <div
      ref={wrapperRef}
      className={`w-full min-w-0 overflow-hidden ${
        disabled
          ? "pointer-events-none opacity-60"
          : ""
      }`}
    >
      <div
        ref={buttonContainerRef}
        className="flex w-full justify-center overflow-hidden"
      />
    </div>
  );
}