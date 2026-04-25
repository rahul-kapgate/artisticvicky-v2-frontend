const trustStats = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#f97316">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
    bg: "bg-orange-50",
    num: "4.9 ★",
    label: "Average Rating\nfrom Students",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    bg: "bg-blue-50",
    num: "200+",
    label: "Students Enrolled\nAcross India",
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4ade80"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    iconClass: "bg-green-500/10 border border-green-500/20",
    num: "500+",
    label: "Mock tests taken by students",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none"
        stroke="#a855f7"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    bg: "bg-purple-50",
    num: "50+",
    label: "Video Lessons\n& Mock Tests",
  },
];

const badges = [
  {
    label: "Made in India",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    dot: "bg-orange-500",
  },
  {
    label: "Live Classes",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-500 animate-pulse",
  },
  {
    label: "Doubt Support",
    color: "bg-green-50 border-green-200 text-green-700",
    dot: "bg-green-500",
  },
  {
    label: "Expert Mentorship",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    dot: "bg-purple-500",
  },
  {
    label: "Affordable Fees",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    dot: "bg-orange-400",
  },
  {
    label: "Pan India Students",
    color: "bg-slate-50 border-slate-200 text-slate-600",
    dot: "bg-slate-400",
  },
  {
    label: "Proven Results",
    color: "bg-green-50 border-green-200 text-green-700",
    dot: "bg-green-500",
  },
  {
    label: "Online & Flexible",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-500 animate-pulse",
  },
];

function IndiaFlag() {
  return (
    <div className="flex flex-col w-[22px] h-[15px] rounded-[3px] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.08)] flex-shrink-0">
      <div className="flex-1 bg-[#FF9933]" />
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="w-[5px] h-[5px] rounded-full border border-[#000080]" />
      </div>
      <div className="flex-1 bg-[#138808]" />
    </div>
  );
}

export default function TrustStrip() {
  return (
    <section className="relative overflow-hidden bg-white border-y border-slate-100 py-14 px-6">
      {/* Dot pattern background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Top label */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <IndiaFlag />
          <span className="text-[11px] font-bold text-slate-400 tracking-[0.12em] uppercase">
            Made in India · Crafted in Bengaluru
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-center text-[26px] font-extrabold text-slate-900 tracking-tight mb-1">
          Trusted by <span className="text-orange-500">1,200+</span> Art
          Students
        </h2>
        <p className="text-center text-[13px] text-slate-400 mb-9">
          Real students. Real results. India's most loved MAH AAC CET coaching.
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-9">
          {trustStats.map((stat, i) => (
            <div
              key={i}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center hover:-translate-y-1 hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              <div
                className={`w-12 h-12 ${stat.bg} rounded-[14px] flex items-center justify-center mx-auto mb-3`}
              >
                {stat.icon}
              </div>
              <p className="text-[22px] font-extrabold text-slate-900 leading-none mb-1">
                {stat.num}
              </p>
              <p className="text-[12px] text-slate-500 font-medium leading-snug whitespace-pre-line">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-7">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[11px] font-semibold text-slate-300 tracking-[0.08em] uppercase whitespace-nowrap">
            Why Students Choose Us
          </span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Badge pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {badges.map((b, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold border ${b.color} hover:scale-105 transition-transform duration-150`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${b.dot}`}
              />
              {b.label}
            </span>
          ))}
        </div>

        {/* Bottom brand strip */}
        <div className="flex items-center justify-center gap-2 pt-5 border-t border-slate-100">
          <span className="text-[16px] font-extrabold text-slate-900">
            AV Art <span className="text-indigo-500">Academy</span>
          </span>
          <span className="text-slate-300 text-sm">·</span>
          <span className="text-[12px] text-slate-400">Built with</span>
          <span className="text-red-500 text-[13px]">♥</span>
          <span className="text-[12px] text-slate-400">
            in Bengaluru, India
          </span>
        </div>
      </div>
    </section>
  );
}
