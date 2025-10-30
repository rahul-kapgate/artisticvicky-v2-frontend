import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Gradient Background */}
      <div className="bg-gradient-to-r from-purple-100 via-purple-50 to-pink-100/60 backdrop-blur-md border-b border-purple-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent">
            ArtisticVicky
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 font-medium">
            <a
              href="#courses"
              className="text-purple-800 hover:text-purple-600 transition-colors duration-200"
            >
              Courses
            </a>
            <a
              href="#mycourses"
              className="text-purple-800 hover:text-purple-600 transition-colors duration-200"
            >
              My Courses
            </a>
            <a
              href="#about"
              className="text-purple-800 hover:text-purple-600 transition-colors duration-200"
            >
              About
            </a>
          </nav>

          {/* Right Side: Login + Menu Button */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 rounded-lg font-semibold border border-purple-300 text-purple-700 hover:bg-purple-100 transition-all duration-200 shadow-sm">
              Login
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-purple-700 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-purple-50 via-pink-50 to-white backdrop-blur-sm border-t border-purple-200/60 shadow-inner animate-fadeIn">
          <nav className="flex flex-col items-center space-y-4 py-4 text-purple-800 font-medium">
            {[
              { href: "#courses", label: "Courses" },
              { href: "#mycourses", label: "My Courses" },
              { href: "#about", label: "About" },
              { href: "#contact", label: "Contact" },
              { href: "#artmaterial", label: "Art Material Link" },
              { href: "#artworks", label: "Artworks" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="hover:text-purple-600 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
