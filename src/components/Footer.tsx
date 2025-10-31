import { Instagram, Youtube, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0a0f2c] via-[#10194f] to-[#1a237e] border-t border-blue-900/40 shadow-inner py-12 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

        {/* 1️⃣ Brand Info */}
        <div>
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight flex justify-center md:justify-start mb-3"
          >
            <span className="text-blue-400">Artistic</span>
            <span className="text-white ml-1">Vickey</span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Explore creativity and learning with{" "}
            <strong className="text-blue-300">ArtisticVickey</strong> — where imagination meets inspiration.
          </p>
        </div>

        {/* 2️⃣ Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="#privacy" className="hover:text-cyan-300 transition">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms" className="hover:text-cyan-300 transition">Terms of Use</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-cyan-300 transition">Contact Us</a>
            </li>
            <li>
              <a href="#refund" className="hover:text-cyan-300 transition">Refund Policy</a>
            </li>
          </ul>
        </div>

        {/* 3️⃣ Follow Us */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-5">
            <a
              href="https://www.instagram.com/artistic.Vickey"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-pink-500 transition-transform transform hover:scale-110"
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://www.youtube.com/@ArtisticVickey"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <Youtube size={22} />
            </a>
            <a
              href="https://www.facebook.com/mayur.tembhurne.148"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-blue-500 transition-transform transform hover:scale-110"
            >
              <Facebook size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="border-t border-blue-800 mt-10 pt-4 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-300">ArtisticVickey</span>. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
