import { useState } from "react";
import { Menu, X } from "lucide-react";
function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#F0F8FF]/80 backdrop-blur-sm border-b border-[#BFDFFF] shadow-sm">
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
          {/* Login Button (Visible on all screens) */}
          <button className="px-4 py-2 rounded-md font-semibold border border-[#93C5FD] text-[#1E3A8A] hover:bg-[#E0F2FE] transition">
            Login
          </button>

          {/* Hamburger Menu (Mobile only) */}
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
            <a
              href="#courses"
              className="hover:text-[#2563EB] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Courses
            </a>
            <a
              href="#mycourses"
              className="hover:text-[#2563EB] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              My Courses
            </a>
            <a
              href="#about"
              className="hover:text-[#2563EB] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className="hover:text-[#2563EB] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            <a
              href="#artmaterial"
              className="hover:text-[#2563EB] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Art Matarial link
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
