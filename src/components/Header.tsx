import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide header when scrolling down, show when scrolling up
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
      className={`fixed top-0 left-0 w-full z-50 bg-[#F0F8FF]/80 backdrop-blur-sm border-b border-[#BFDFFF] shadow-sm transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1D4ED8]">
          artisticvicky
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-[#1E3A8A] font-medium">
          <a href="#courses" className="hover:text-[#2563EB] transition-colors duration-200">
            Courses
          </a>
          <a href="#mycourses" className="hover:text-[#2563EB] transition-colors duration-200">
            My Courses
          </a>
          <a href="#about" className="hover:text-[#2563EB] transition-colors duration-200">
            About
          </a>
        </nav>

        {/* Right Side: Login + Menu Button */}
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 rounded-md font-semibold border border-[#93C5FD] text-[#1E3A8A] hover:bg-[#E0F2FE] transition">
            Login
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[#1E3A8A] focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#F0F8FF]/90 backdrop-blur-sm border-t border-[#BFDFFF] shadow-inner">
          <nav className="flex flex-col items-center space-y-4 py-4 text-[#1E3A8A] font-medium">
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
                className="hover:text-[#2563EB] transition-colors duration-200"
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
