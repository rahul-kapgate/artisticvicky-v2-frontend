import { Instagram, Youtube, Facebook } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white via-purple-50 to-purple-100/50 backdrop-blur-md border-t border-purple-200/50 shadow-inner py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* 1️⃣ Brand Info */}
        <div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent mb-3 tracking-tight">
          <span className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 bg-clip-text text-transparent">
              Artistic Vicky
            </span>
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Explore creativity and learning with <strong>ArtisticVicky</strong> — 
            where imagination meets inspiration.
          </p>
        </div>

        {/* 2️⃣ Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-purple-800 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li><a href="#privacy" className="hover:text-purple-600 transition">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-purple-600 transition">Terms of Use</a></li>
            <li><a href="#contact" className="hover:text-purple-600 transition">Contact Us</a></li>
            <li><a href="#refund" className="hover:text-purple-600 transition">Refund Policy</a></li>
          </ul>
        </div>

        {/* 3️⃣ Follow Us */}
        <div>
          <h3 className="text-lg font-semibold text-purple-800 mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-5">
            <a
              href="https://www.instagram.com/artistic.vicky"
              target="_blank"
              rel="noreferrer"
              className="text-purple-700 hover:text-pink-500 transition-transform transform hover:scale-110"
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://www.youtube.com/@ArtisticVicky"
              target="_blank"
              rel="noreferrer"
              className="text-purple-700 hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <Youtube size={22} />
            </a>
            <a
              href="https://www.facebook.com/mayur.tembhurne.148"
              target="_blank"
              rel="noreferrer"
              className="text-purple-700 hover:text-blue-600 transition-transform transform hover:scale-110"
            >
              <Facebook size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="border-t border-purple-200 mt-10 pt-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-purple-700">ArtisticVicky</span>. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
