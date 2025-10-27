import { Instagram, Youtube, Linkedin } from "lucide-react"; // install via: npm install lucide-react

function Footer() {
  return (
    <footer className="bg-[#F0F8FF]/80 backdrop-blur-sm border-t border-[#BFDFFF] shadow-inner py-10 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* 1️⃣ Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-[#1D4ED8] mb-3 tracking-tight">
            artisticvicky
          </h2>
          <p className="text-sm text-[#1E3A8A]/80">
            Explore creativity and learning with ArtisticVicky — where art meets technology.
          </p>
        </div>

        {/* 2️⃣ Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-[#1E3A8A] mb-3">Quick Links</h3>
          <ul className="space-y-2 text-[#1E3A8A]/80 text-sm">
            <li><a href="#privacy" className="hover:text-[#2563EB] transition">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-[#2563EB] transition">Terms of Use</a></li>
            <li><a href="#contact" className="hover:text-[#2563EB] transition">Contact Us</a></li>
            <li><a href="#refund" className="hover:text-[#2563EB] transition">Refund Policy</a></li>
          </ul>
        </div>

        {/* 3️⃣ Follow Us */}
        <div>
          <h3 className="text-lg font-semibold text-[#1E3A8A] mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[#1E3A8A] hover:text-[#2563EB] transition"
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[#1E3A8A] hover:text-[#2563EB] transition"
            >
              <Youtube size={22} />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[#1E3A8A] hover:text-[#2563EB] transition"
            >
              <Linkedin size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="border-t border-[#BFDFFF] mt-8 pt-4 text-center text-sm text-[#1E3A8A]/70">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-[#1D4ED8]">artisticvicky</span>. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
