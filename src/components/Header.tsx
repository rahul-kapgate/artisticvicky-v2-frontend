import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

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
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      {/* Dark Blue Gradient Header */}
      <div className="bg-gradient-to-r from-[#0a0f2c] via-[#10194f] to-[#1a237e] backdrop-blur-md border-b border-blue-900/40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-1"
          >
            <span className="text-blue-600">
              Artistic
            </span>
            <span className="text-white">Vickey</span>
          </Link>


          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            {[
              { href: "#courses", label: "Courses" },
              { href: "#mycourses", label: "My Courses" },
              { href: "#about", label: "About" },
              { href: "contact", label: "Contact" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-gray-200 hover:text-cyan-300 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-gradient-to-r from-cyan-300 to-blue-400 hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 rounded-lg font-semibold border border-blue-400 text-blue-100 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-sm">
              Login
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-cyan-300 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0f2c]/95 backdrop-blur-lg border-t border-blue-900/40 shadow-inner animate-fadeIn">
          <nav className="flex flex-col items-center space-y-4 py-4 text-gray-200 font-medium">
            {[
              { href: "#courses", label: "Courses" },
              { href: "#mycourses", label: "My Courses" },
              { href: "#about", label: "About" },
              { href: "contact", label: "Contact" },
              { href: "#artmaterial", label: "Art Material" },
              { href: "#artworks", label: "Artworks" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="hover:text-cyan-300 transition-colors duration-200"
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
