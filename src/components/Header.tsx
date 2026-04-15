import { useState, useEffect, useContext } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Login from "./Login";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ArtAvatar from "@/components/avatar/ArtAvatar";
import { apiClient } from "@/utils/axiosConfig";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [avatarId, setAvatarId] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  console.log(user);

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  // Fetch avatar_id when user logs in
  useEffect(() => {
    if (!user) {
      setAvatarId(0);
      return;
    }
    const fetchAvatar = async () => {
      try {
        const res = await apiClient.get("/api/user/profile");
        if (res.data?.success && res.data.user) {
          setAvatarId(res.data.user.avatar_id ?? 0);
        }
      } catch {
        // silently fall back to default avatar
      }
    };
    fetchAvatar();
  }, [user]);

  // Re-sync avatar when user navigates back from profile page
  // (in case they changed it)
  useEffect(() => {
    if (!user) return;
    const fetchAvatar = async () => {
      try {
        const res = await apiClient.get("/api/user/profile");
        if (res.data?.success && res.data.user) {
          setAvatarId(res.data.user.avatar_id ?? 0);
        }
      } catch {
        // ignore
      }
    };
    fetchAvatar();
  }, [location.pathname]);

  // Hide/Show header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".profile-menu")) {
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleOpenAuthModal = (e: Event) => {
      const customEvent = e as CustomEvent<{
        mode?: "login" | "register" | "forgot";
      }>;
      const mode = customEvent.detail?.mode || "login";
      setIsOpen(false);
      setLoginOpen(mode === "login");
      setRegisterOpen(mode === "register");
      setForgotOpen(mode === "forgot");
    };
    window.addEventListener(
      "open-auth-modal",
      handleOpenAuthModal as EventListener,
    );
    return () => {
      window.removeEventListener(
        "open-auth-modal",
        handleOpenAuthModal as EventListener,
      );
    };
  }, []);

  const handleNavClick = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-gradient-to-r from-[#0a0f2c] via-[#10194f] to-[#1a237e] backdrop-blur-md border-b border-blue-900/40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              if (location.pathname !== "/") {
                navigate("/");
                setTimeout(
                  () => window.scrollTo({ top: 0, behavior: "smooth" }),
                  300,
                );
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-1 cursor-pointer select-none"
          >
            <span className="text-blue-600">Artistic</span>
            <span className="text-white">Vickey</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            <button
              onClick={() => handleNavClick("courses")}
              className="text-gray-200 hover:text-cyan-300 transition-colors duration-200"
            >
              Courses
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className="text-gray-200 hover:text-cyan-300 transition-colors duration-200"
            >
              About
            </button>
            <Link
              to="/contact"
              className="text-gray-200 hover:text-cyan-300 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Desktop */}
                <div className="hidden sm:flex items-center gap-3">
                  {/* Art Avatar → navigate to profile */}
                  <button
                    onClick={() => navigate("/profile")}
                    className="rounded-xl overflow-hidden hover:ring-2 hover:ring-cyan-400 hover:ring-offset-2 hover:ring-offset-transparent transition-all"
                    title="View profile"
                  >
                    <ArtAvatar avatarId={avatarId} size={36} />
                  </button>

                  <Button
                    onClick={() => navigate("/my-courses")}
                    className="px-4 py-2 rounded-lg font-semibold border border-blue-400 text-blue-100 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-sm"
                  >
                    My Courses
                  </Button>

                  <Button
                    onClick={logout}
                    className="px-4 py-2 rounded-lg font-semibold border border-blue-400 text-blue-100 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-sm"
                  >
                    Logout
                  </Button>
                </div>

                {/* Mobile */}
                <div className="relative sm:hidden profile-menu">
                  <button
                    onClick={() => navigate("/profile")}
                    className="rounded-xl overflow-hidden hover:ring-2 hover:ring-cyan-400 transition-all"
                    title="View profile"
                  >
                    <ArtAvatar avatarId={avatarId} size={36} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setRegisterOpen(false);
                    setLoginOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg font-semibold border border-blue-400 text-blue-100 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-sm"
                >
                  Login
                </Button>

                <Login
                  open={loginOpen}
                  onOpenChange={setLoginOpen}
                  onOpenRegister={() => {
                    setLoginOpen(false);
                    setRegisterOpen(true);
                  }}
                  onOpenForgotPassword={() => {
                    setLoginOpen(false);
                    setForgotOpen(true);
                  }}
                />
                <Register open={registerOpen} onOpenChange={setRegisterOpen} />
                <ForgotPassword
                  open={forgotOpen}
                  onOpenChange={setForgotOpen}
                />
              </>
            )}

            {/* Hamburger */}
            <button
              className="md:hidden text-cyan-300 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0f2c]/95 backdrop-blur-lg border-t border-blue-900/40 shadow-inner animate-fadeIn">
          <nav className="flex flex-col items-center space-y-4 py-4 text-gray-200 font-medium">
            {user && (
              <button
                onClick={() => {
                  navigate("/my-courses");
                  setIsOpen(false);
                }}
                className="hover:text-cyan-300 transition-colors duration-200"
              >
                My Courses
              </button>
            )}
            <button
              onClick={() => handleNavClick("courses")}
              className="hover:text-cyan-300 transition-colors duration-200"
            >
              Courses
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className="hover:text-cyan-300 transition-colors duration-200"
            >
              About
            </button>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="hover:text-cyan-300 transition-colors duration-200"
            >
              Contact Us
            </Link>
            {user && (
              <Button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="hover:text-cyan-300 transition-colors duration-200"
              >
                Logout
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
