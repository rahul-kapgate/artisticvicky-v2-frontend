import {
  ArrowLeft,
  Star,
  Users,
  CheckCircle2,
  MessageCircle,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Globe,
  Layers,
  BarChart3,
  Ban,
  Loader2,
  Phone,
  Target,
  TrendingUp,
  FileText,
  PlayCircle,
  Shield,
  Zap,
  HeartHandshake,
  ClipboardList,
  Award,
} from "lucide-react";

// ── Re-export / re-use these from your existing file ────────────────────────
// BlockedAccessBanner, PayButton, MetaRow — paste them here if splitting files,
// or import from their source if you've extracted them to their own module.
// For a single-file drop-in they are included below.

/* ── Shared helpers (already exist in CourseDetails.tsx) ── */
function BlockedAccessBanner({
  onContactSupport,
}: {
  onContactSupport: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-red-500/20 p-2 border border-red-400/30 shrink-0">
          <Ban className="w-5 h-5 text-red-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-red-200">Access Suspended</h3>
          <p className="text-sm text-red-100/80 mt-1 leading-relaxed">
            Your access to this mentorship programme has been temporarily blocked
            by the administrator. Contact support to restore it.
          </p>
        </div>
      </div>
      <button
        onClick={onContactSupport}
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] transition flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Contact Support on WhatsApp
      </button>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-xs text-gray-400">
        {icon}
        {label}
      </span>
      <span className="text-xs text-gray-200 font-medium text-right">{value}</span>
    </div>
  );
}

/* ── Mentorship feature cards ── */
const MENTORSHIP_FEATURES = [
  {
    icon: <Target className="w-5 h-5" />,
    title: "1:1 Personal Guidance",
    desc: "Dedicated mentor sessions tailored to your weak areas, learning pace, and exam timeline.",
    color: "from-rose-500/15 to-pink-500/10 border-rose-400/25",
    iconColor: "text-rose-300",
    badge: "Personal",
    badgeColor: "bg-rose-400/15 text-rose-200 border-rose-400/25",
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    title: "Customized Study Plan",
    desc: "A day-by-day study roadmap built around your strengths, exam date, and preparation gaps.",
    color: "from-amber-500/15 to-orange-500/10 border-amber-400/25",
    iconColor: "text-amber-300",
    badge: "Structured",
    badgeColor: "bg-amber-400/15 text-amber-200 border-amber-400/25",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Priority Doubt Solving",
    desc: "Get your doubts answered fast — no waiting, no confusion. Direct access to your mentor.",
    color: "from-cyan-500/15 to-blue-500/10 border-cyan-400/25",
    iconColor: "text-cyan-300",
    badge: "Fast",
    badgeColor: "bg-cyan-400/15 text-cyan-200 border-cyan-400/25",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Performance Tracking",
    desc: "Weekly check-ins with score analysis, weak topic identification, and improvement strategy.",
    color: "from-emerald-500/15 to-teal-500/10 border-emerald-400/25",
    iconColor: "text-emerald-300",
    badge: "Analytics",
    badgeColor: "bg-emerald-400/15 text-emerald-200 border-emerald-400/25",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Form Filling & CAP Rounds",
    desc: "Step-by-step guidance through the MAH AAC CET application, seat allotment, and CAP rounds.",
    color: "from-violet-500/15 to-purple-500/10 border-violet-400/25",
    iconColor: "text-violet-300",
    badge: "Admission",
    badgeColor: "bg-violet-400/15 text-violet-200 border-violet-400/25",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Direct Mentor Support",
    desc: "Call or chat with your mentor directly. Available via WhatsApp, call, and chat — till your exam.",
    color: "from-indigo-500/15 to-blue-500/10 border-indigo-400/25",
    iconColor: "text-indigo-300",
    badge: "Always On",
    badgeColor: "bg-indigo-400/15 text-indigo-200 border-indigo-400/25",
  },
];

const TIMELINE_STEPS = [
  {
    phase: "Week 1",
    title: "Onboarding & Assessment",
    desc: "We assess your current level, identify gaps, and build your personalised study roadmap.",
    icon: "🔍",
  },
  {
    phase: "Ongoing",
    title: "Guided Preparation",
    desc: "Daily study tasks, weekly doubt sessions, mock test reviews, and strategy tweaks.",
    icon: "📚",
  },
  {
    phase: "Pre-Exam",
    title: "Revision & Mock Drills",
    desc: "Intensive revision plan, full-length mock tests, and time management coaching.",
    icon: "🎯",
  },
  {
    phase: "Post-Exam",
    title: "Admission & CAP Guidance",
    desc: "Form filling, college shortlisting, CAP round strategy, and seat selection support.",
    icon: "🏛️",
  },
];

const WHAT_YOU_GET = [
  "1:1 personalised mentorship sessions",
  "Custom study plan updated weekly",
  "Priority doubt solving via WhatsApp/call",
  "Weekly performance tracking & reports",
  "MAH AAC CET form filling assistance",
  "CAP round strategy & seat selection help",
  "College shortlisting based on your score",
  "Guidance till final admission is secured",
];

/* ════════════════════════════════════════
   MENTORSHIP COURSE PAGE  (course id = 26)
════════════════════════════════════════ */
export function MentorshipCoursePage({
  course,
  currentUser,
  isEnrolled,
  isBlocked,
  onOpenLogin,
  onEnroll,
  onContactSupport,
  isPaying,
}: {
  course: {
    id: number | string;
    course_name: string;
    description?: string;
    price?: number;
    price_without_discount?: number;
    image?: string;
    category?: string;
    language?: string;
    duration?: string;
    level?: string | null;
    rating?: number;
    students_enrolled?: number[] | null;
    created_at?: string;
  };
  currentUser: any;
  isEnrolled: boolean;
  isBlocked: boolean;
  onOpenLogin: () => void;
  onEnroll: () => void;
  onContactSupport: () => void;
  isPaying: boolean;
}) {

  const createdDate = course.created_at
    ? new Date(course.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  const discount =
    course.price_without_discount &&
    course.price_without_discount > (course.price || 0)
      ? Math.round(
          ((course.price_without_discount - (course.price || 0)) /
            course.price_without_discount) *
            100,
        )
      : null;

  const hasActiveAccess = isEnrolled && !isBlocked;

  const handleCTA = () => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    if (isBlocked) return;
    if (isEnrolled) {
      // Enrolled users → WhatsApp to connect with mentor
      onContactSupport();
      return;
    }
    onEnroll();
  };

  return (
    <section className="bg-gradient-to-b from-[#0a1628] via-[#0f1b3d] to-[#1a237e] text-gray-100 min-h-screen">
      {/* ── Hero ── */}
      <div className="relative w-full h-[240px] sm:h-[340px] md:h-[420px] overflow-hidden">
        <img
          src={course.image || ""}
          alt={course.course_name}
          className="w-full h-full object-cover brightness-40"
        />
        {/* Warm rose-amber overlay to differentiate from other courses */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/50 to-rose-900/20" />

        <button
          onClick={() => window.history.back()}
          className="absolute mt-20 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-black/60 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6 sm:pb-10 max-w-6xl mx-auto">
          <span className="inline-block bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            🎓 Personal Mentorship Programme
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight max-w-3xl mb-2">
            {course.course_name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-300" />
              1:1 Personal Guidance
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Shield className="w-3.5 h-3.5 text-rose-300" />
              Till Admission
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Users className="w-3.5 h-3.5 text-rose-300" />
              {course.students_enrolled?.length ?? 0} students
            </span>
            {course.rating && course.rating > 0 ? (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-yellow-300">
                  {course.rating}
                </span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left / Main content ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: <HeartHandshake className="w-5 h-5 text-rose-300" />,
                label: "Mentorship Type",
                value: "1:1 Personal",
              },
              {
                icon: <Clock className="w-5 h-5 text-rose-300" />,
                label: "Duration",
                value: course.duration || "Till Exam",
              },
              {
                icon: <Globe className="w-5 h-5 text-rose-300" />,
                label: "Language",
                value: course.language || "Hindi, English",
              },
              {
                icon: <Award className="w-5 h-5 text-rose-300" />,
                label: "Includes",
                value: "CAP Support",
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
              >
                <div className="flex justify-center mb-2">{icon}</div>
                <p className="text-sm font-bold text-white leading-snug">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* What's Included — feature cards */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-400" />
              What's Included in Your Mentorship
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MENTORSHIP_FEATURES.map(
                ({ icon, title, desc, color, iconColor, badge, badgeColor }) => (
                  <div
                    key={title}
                    className={`relative rounded-2xl border bg-gradient-to-br p-5 ${color}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className={iconColor}>{icon}</span>
                        <h3 className="font-bold text-white text-sm leading-snug">
                          {title}
                        </h3>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeColor}`}
                      >
                        {badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{desc}</p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* How it works — Timeline */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-rose-400" />
              How the Mentorship Works
            </h2>
            <div className="relative space-y-0">
              {TIMELINE_STEPS.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  {/* Vertical line */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-lg shrink-0">
                      {step.icon}
                    </div>
                    {idx < TIMELINE_STEPS.length - 1 && (
                      <div className="w-px flex-1 bg-white/10 my-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300/80">
                      {step.phase}
                    </span>
                    <h3 className="font-bold text-white text-sm mt-0.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What you'll get checklist */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-rose-400" />
              Everything You'll Get
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WHAT_YOU_GET.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-200 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-3">
              About this Programme
            </h2>
            <div className="space-y-2">
              {course.description
                ?.split(/\r?\n/)
                .filter(Boolean)
                .map((line, i) => (
                  <p key={i} className="text-gray-300 text-sm leading-relaxed">
                    {line}
                  </p>
                ))}
            </div>
          </div>

          {/* Enrolled CTA banner */}
          {hasActiveAccess && (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/8 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base mb-1">
                  ✅ You're enrolled in the Mentorship Programme!
                </h3>
                <p className="text-sm text-gray-300">
                  Your mentor will reach out to you on WhatsApp to get started.
                  You can also reach out directly below.
                </p>
              </div>
              <button
                onClick={onContactSupport}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold transition active:scale-[0.98] flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Connect with Mentor
              </button>
            </div>
          )}

          {/* Who is this for */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-400" />
              Who Is This For?
            </h2>
            <div className="space-y-2.5">
              {[
                {
                  emoji: "😰",
                  text: "Students overwhelmed with preparation and unsure where to start",
                },
                {
                  emoji: "📉",
                  text: "Students stuck at a score plateau despite studying regularly",
                },
                {
                  emoji: "🤷",
                  text: "Aspirants confused about the admission process and CAP rounds",
                },
                {
                  emoji: "⏰",
                  text: "Students with limited time who need a fast, focused strategy",
                },
                {
                  emoji: "🏆",
                  text: "Serious candidates who want the best possible college through expert guidance",
                },
              ].map(({ emoji, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg shrink-0">{emoji}</span>
                  <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mentor section */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-rose-400" />
              Your Personal Mentor
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-orange-500 flex items-center justify-center text-xl font-bold text-white shrink-0">
                V
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Vickey Sir</h3>
                <p className="text-rose-300 text-sm mb-2">
                  MAH AAC CET Expert & BFA Coach
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" /> 5.0 Rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-rose-400" /> 500+
                    Students
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-rose-400" /> 10+ Yrs
                    Experience
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Vickey Sir personally mentors every student in this programme.
                  His guidance has helped hundreds of students secure seats in
                  Maharashtra's top BFA colleges, including Sir J.J. School of
                  Art and Abhinav Kala Mahavidyalaya.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4 order-first lg:order-last">
          {/* Blocked banner */}
          {isBlocked && (
            <BlockedAccessBanner onContactSupport={onContactSupport} />
          )}

          {/* Price + CTA card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-4">
            {!isEnrolled && !isBlocked && (
              <div className="text-center">
                <div className="flex items-end justify-center gap-3">
                  <span className="text-4xl font-extrabold text-emerald-400">
                    ₹{course.price}
                  </span>
                  {course.price_without_discount &&
                    course.price_without_discount > (course.price || 0) && (
                      <span className="text-xl text-red-400 line-through pb-0.5">
                        ₹{course.price_without_discount}
                      </span>
                    )}
                </div>
                {discount && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-400/20 px-3 py-1 text-sm text-emerald-200">
                    <span className="font-semibold">Save {discount}%</span>
                    <span className="text-emerald-100/60">•</span>
                    <span>
                      ₹{(course.price_without_discount || 0) - (course.price || 0)} off
                    </span>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  One-time payment · Access till admission
                </p>
              </div>
            )}

            {/* Enrolled state */}
            {hasActiveAccess ? (
              <button
                onClick={onContactSupport}
                className="w-full py-3 rounded-xl text-base font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] transition flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                Connect with Your Mentor
              </button>
            ) : !isBlocked ? (
              <>
                <button
                  onClick={handleCTA}
                  disabled={isPaying}
                  className={`w-full py-3 rounded-xl text-base font-semibold text-white transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 ${isPaying ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    "Get Personal Mentor 🚀"
                  )}
                </button>
              </>
            ) : null}

            {/* What you get checklist (sidebar) */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-sm font-semibold text-white mb-3">
                This programme includes:
              </p>
              <div className="space-y-2">
                {[
                  { icon: "🎯", text: "1:1 personal mentorship" },
                  { icon: "📅", text: "Custom study plan" },
                  { icon: "❓", text: "Priority doubt solving" },
                  { icon: "📊", text: "Weekly performance tracking" },
                  { icon: "📝", text: "Form filling & CAP guidance" },
                  { icon: "📞", text: "Direct mentor call/chat" },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {icon} {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust signals */}
          <div className="rounded-2xl border border-rose-400/15 bg-rose-500/5 p-5">
            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-300" />
              Why Students Trust This
            </p>
            <div className="space-y-2.5 text-sm text-gray-300">
              {[
                "✅ Personalised — not a one-size-fits-all course",
                "✅ Proven results across 500+ students",
                "✅ Covers exam prep AND college admission",
                "✅ Available till you secure admission",
                "✅ Hindi + English support",
              ].map((point, i) => (
                <p key={i} className="text-xs leading-snug">
                  {point}
                </p>
              ))}
            </div>
          </div>

          {/* Programme details */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-rose-400" />
              Programme Details
            </p>
            <div className="space-y-2.5">
              <MetaRow
                icon={<Layers className="w-4 h-4 text-rose-400" />}
                label="Category"
                value={course.category || "Art"}
              />
              <MetaRow
                icon={<HeartHandshake className="w-4 h-4 text-rose-400" />}
                label="Type"
                value="Personal Mentorship"
              />
              <MetaRow
                icon={<Globe className="w-4 h-4 text-rose-400" />}
                label="Language"
                value={course.language || "Hindi, English"}
              />
              <MetaRow
                icon={<Clock className="w-4 h-4 text-rose-400" />}
                label="Access"
                value={course.duration || "Till Admission"}
              />
              <MetaRow
                icon={<Users className="w-4 h-4 text-rose-400" />}
                label="Students"
                value={String(course.students_enrolled?.length ?? 0)}
              />
              <MetaRow
                icon={<Calendar className="w-4 h-4 text-rose-400" />}
                label="Launched"
                value={createdDate}
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}