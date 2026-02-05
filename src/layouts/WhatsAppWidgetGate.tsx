import { matchPath, useLocation } from "react-router-dom";
import WhatsAppWidget from "./WhatsAppWidget";

const HIDE_ON: string[] = [
  "/my-courses/:id/videos",
  "/my-courses/:id/mock-test",
  "/my-courses/:id/pyq-mock-test",
  "/mock-test/result/:attempt_id",
  "/pyq-mock-test/result/:attempt_id",
];

export default function WhatsAppWidgetGate() {
  const location = useLocation();

  const shouldHide = HIDE_ON.some((pattern) =>
    matchPath({ path: pattern, end: false }, location.pathname)
  );

  if (shouldHide) return null;

  return (
    <WhatsAppWidget
      phone="9325217691"
      title="Artistic Vickey"
      description="Interested in our courses? Chat with us on WhatsApp to learn more!"
      message="Hi, I’m interested in admissions. Please share details."
      newTab
    />
  );
}
