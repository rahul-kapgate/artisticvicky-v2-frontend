import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  const socials = [
    {
      href: "https://www.instagram.com/artistic.Vickey",
      label: "Instagram",
      handle: "@artistic.Vickey",
      colorClass: "bg-pink-500/10 border-pink-500/20",
      textClass: "text-pink-300",
      icon: (
        <svg viewBox="0 0 24 24" fill="#f472b6" className="w-3.5 h-3.5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      href: "https://www.youtube.com/@ArtisticVickey",
      label: "YouTube",
      handle: "@artisticVickey",
      colorClass: "bg-red-500/10 border-red-500/20",
      textClass: "text-red-300",
      icon: (
        <svg viewBox="0 0 24 24" fill="#f87171" className="w-3.5 h-3.5">
          <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
        </svg>
      ),
    },
    {
      href: "https://www.facebook.com/mayur.tembhurne.148",
      label: "Facebook",
      handle: "mayur.tembhurne.148",
      colorClass: "bg-blue-500/10 border-blue-500/20",
      textClass: "text-blue-300",
      icon: (
        <svg viewBox="0 0 24 24" fill="#60a5fa" className="w-3.5 h-3.5">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      ),
    },
    {
      href: "https://wa.me/9325217691",
      label: "WhatsApp",
      handle: "9325217691",
      colorClass: "bg-green-500/10 border-green-500/20",
      textClass: "text-green-300",
      icon: (
        <svg viewBox="0 0 24 24" fill="#4ade80" className="w-3.5 h-3.5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.12 1.533 5.845L.057 23.428c-.073.28.178.538.46.476l5.698-1.457A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.826 9.826 0 01-5.013-1.374l-.36-.214-3.724.953.984-3.617-.234-.373A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
        </svg>
      ),
    },
  ];

  const contactInfo = [
    { icon: "📧", value: "vikkitembhurne358@gmail.com" },
    { icon: "📱", value: "+91 9325217691" },
  ];

  return (
    <footer
      className="relative overflow-hidden border-t border-indigo-900/30 pt-12 pb-0 text-slate-400"
      style={{
        background: "linear-gradient(to bottom, #050816, #0a0f2c, #10194f)",
      }}
    >
      {/* Blobs */}
      <div className="pointer-events-none absolute -top-20 -left-16 w-72 h-72 bg-blue-600 rounded-full blur-[90px] opacity-[0.07]" />
      <div className="pointer-events-none absolute bottom-10 -right-10 w-60 h-60 bg-purple-600 rounded-full blur-[80px] opacity-[0.07]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link
            to="/"
            onClick={handleHomeClick}
            className="inline-flex items-center gap-1 text-xl font-extrabold tracking-tight mb-3"
          >
            <span className="text-blue-400">AV Art</span>
            <span className="text-white">Academy</span>
          </Link>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            India's #1 online coaching for MAH AAC CET. Learn perspective,
            sketching, aptitude & more from expert artist Vickey.
          </p>
          <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-3 py-1 text-[11px] text-indigo-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            MAH AAC CET Coaching — Active
          </span>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-4">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2">
            {/* Home */}
            <li>
              <button
                onClick={() => {
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
                className="text-[13px] text-slate-500 hover:text-cyan-300 transition-colors flex items-center gap-1 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
                  →
                </span>
                Home
              </button>
            </li>

            {/* Courses */}
            <li>
              <button
                onClick={() => {
                  if (location.pathname !== "/") {
                    navigate("/");
                    setTimeout(() => {
                      document
                        .getElementById("courses")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 400);
                  } else {
                    document
                      .getElementById("courses")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-[13px] text-slate-500 hover:text-cyan-300 transition-colors flex items-center gap-1 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
                  →
                </span>
                Courses
              </button>
            </li>

            {/* About */}
            <li>
              <button
                onClick={() => {
                  if (location.pathname !== "/") {
                    navigate("/");
                    setTimeout(() => {
                      document
                        .getElementById("about")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 400);
                  } else {
                    document
                      .getElementById("about")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-[13px] text-slate-500 hover:text-cyan-300 transition-colors flex items-center gap-1 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
                  →
                </span>
                About
              </button>
            </li>

            {/* Regular links (these pages exist as routes) */}
            {[
              { label: "Contact Us", href: "/contact" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Use", href: "/terms" },
              { label: "Refund Policy", href: "/refund-policy" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  className="text-[13px] text-slate-500 hover:text-cyan-300 transition-colors flex items-center gap-1 group"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
                    →
                  </span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-4">
            Follow Us
          </h3>
          <div className="flex flex-col gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 hover:translate-x-1 transition-all duration-200"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${s.colorClass}`}
                >
                  {s.icon}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${s.textClass}`}>
                    {s.label}
                  </p>
                  <p className="text-[11px] text-slate-600">{s.handle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-4">
            Contact
          </h3>
          <div className="flex flex-col gap-3">
            {contactInfo.map((c, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[12px]">
                <span className="text-sm flex-shrink-0 mt-0.5">{c.icon}</span>
                <span className="text-slate-400 leading-snug">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-10 py-4 border-t border-indigo-900/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[12px] text-slate-700">
          © {new Date().getFullYear()}{" "}
          <span className="text-indigo-500">AV Art Academy</span>. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
