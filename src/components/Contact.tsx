import React from "react";

const contacts = [
  {
    label: "WhatsApp",
    href: "https://wa.me/9325217691",
    text: "9325217691",
    iconColor: "rgba(34,197,94,0.15)",
    iconBorder: "rgba(34,197,94,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#4ade80" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.12 1.533 5.845L.057 23.428c-.073.28.178.538.46.476l5.698-1.457A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.826 9.826 0 01-5.013-1.374l-.36-.214-3.724.953.984-3.617-.234-.373A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:vikkitembhurne358@gmail.com",
    text: "vikkitembhurne358@gmail.com",
    iconColor: "rgba(59,130,246,0.15)",
    iconBorder: "rgba(59,130,246,0.3)",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "WhatsApp Group",
    href: "https://chat.whatsapp.com/H7MmQmlgJ5W2KgvIRKqZc7",
    text: "Join our community group",
    iconColor: "rgba(34,197,94,0.15)",
    iconBorder: "rgba(34,197,94,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#4ade80" className="w-5 h-5">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/artistic.Vickey/",
    text: "@artistic.Vickey",
    iconColor: "rgba(236,72,153,0.15)",
    iconBorder: "rgba(236,72,153,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#f472b6" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@artisticVickey",
    text: "@artisticVickey",
    iconColor: "rgba(239,68,68,0.15)",
    iconBorder: "rgba(239,68,68,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#f87171" className="w-5 h-5">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/mayur.tembhurne.148",
    text: "mayur.tembhurne.148",
    iconColor: "rgba(59,130,246,0.15)",
    iconBorder: "rgba(59,130,246,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#60a5fa" className="w-5 h-5">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    href: "https://in.linkedin.com/in/vickey-tembhurne-597b61407",
    label: "LinkedIn",
    text: "vickey-tembhurne",
    iconColor: "rgba(59,130,246,0.15)",
    iconBorder: "rgba(59,130,246,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#60a5fa" className="w-3.5 h-3.5">
        <path d="M20.447 20.452H16.89v-5.569c0-1.328-.026-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.345V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 110-4.126 2.063 2.063 0 010 4.126zM7.119 20.452H3.555V9H7.12v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col justify-center items-center px-6 py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #050816, #10194f, #1a237e, #10194f, #050816)",
      }}
    >
      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-20 -left-16 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-cyan-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/60 rounded-full blur-3xl animate-pulse" />
      </div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block mb-3 px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase text-purple-300 border border-purple-500/40 bg-purple-500/10">
            Get in Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            Connect with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
              Vickey
            </span>{" "}
            🎨
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-base leading-relaxed">
            Reach out through any platform — whether you want to learn,
            collaborate, or just say hi!
          </p>
          <div className="mx-auto mt-5 h-[3px] w-14 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 group"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)",
                borderColor: "rgba(99,102,241,0.22)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: item.iconColor,
                  border: `1px solid ${item.iconBorder}`,
                }}
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-200">
                  {item.label}
                </p>
                <p className="text-xs text-slate-400 break-all leading-snug mt-0.5">
                  {item.text}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
