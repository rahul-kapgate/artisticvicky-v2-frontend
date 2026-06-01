import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/sonner";
import TrustStrip from "./TrustStrip";

export default function Layout() {
  const location = useLocation();

  // Routes where Header/Footer should be hidden
  const noLayoutRoutes = [
    "/my-courses/:id/mock-test",
    "/my-courses/:id/pyq-mock-test",
  ];

  const hideLayout = noLayoutRoutes.some((pattern) => {
    const regex = new RegExp("^" + pattern.replace(":id", "[^/]+") + "$");
    return regex.test(location.pathname);
  });

  // Show TrustStrip only on Home page
  const showTrustStrip = location.pathname === "/";

  return (
    <>
      <Toaster richColors position="bottom-right" />

      {!hideLayout && <Header />}

      <main className={hideLayout ? "min-h-screen" : ""}>
        <Outlet />
      </main>

      {!hideLayout && (
        <>
          <Footer />
          {showTrustStrip && <TrustStrip />}
        </>
      )}
    </>
  );
}
