import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/sonner";

/**
 * Layout wrapper for all pages
 * - Renders Header and Footer by default
 * - Hides them for specific routes (e.g. fullscreen pages)
 */
export default function Layout() {
  const location = useLocation();

  // 🚫 Routes where we don't want Header/Footer
  const noLayoutRoutes = ["/my-courses/:id/mock-test"];

  // ✅ Check dynamic route match
  const hideLayout = noLayoutRoutes.some((pattern) => {
    const regex = new RegExp("^" + pattern.replace(":id", "[^/]+") + "$");
    return regex.test(location.pathname);
  });

  return (
    <>
      <Toaster richColors position="top-center" />
      {!hideLayout && <Header />}

      <main className={hideLayout ? "min-h-screen" : ""}>
        {/* <Outlet /> renders the nested page */}
        <Outlet />
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}
