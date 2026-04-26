import { useNavigate } from "react-router-dom";
import React from "react";
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
  FileText,
  PlayCircle,
  Video,
  Target,
  TrendingUp,
  Trophy,
  Palette,
  PenTool,
  Zap,
  Award,
} from "lucide-react";
import CourseApprovedReviews from "@/components/CourseApprovedReviews";

/* ─────────────────────────────────────────────
   Shared helpers (already exist in CourseDetails.tsx —
   import from there if extracted to a shared module,
   or keep duplicated here if this file is standalone)
───────────────────────────────────────────── */

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
            Your access to this course has been temporarily blocked by the
            administrator. You're still enrolled, but cannot open the course
            content until access is restored.
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
      <span className="text-xs text-gray-200 font-medium text-right">
        {value}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Course-specific constants
───────────────────────────────────────────── */

const WHAT_YOU_LEARN = [
  "Object Drawing — shapes, perspective, shading & detailing from real objects",
  "Memory Drawing — human figures, scenes, background & composition",
  "Still Life Drawing — arrangement, light, tone & presentation",
  "Elementary & Intermediate exam patterns, marking scheme & tips",
  "Chapter-wise practice with important questions & model answers",
  "Speed, accuracy & presentation skills for exam-day performance",
];

const COURSE_FEATURES = [
  {
    icon: <PenTool className="w-5 h-5" />,
    title: "Clear Concept Explanations",
    desc: "Every topic is broken down with simple language, visual demonstrations, and step-by-step guidance in Hindi & English.",
    color: "from-amber-500/15 to-orange-500/10 border-amber-400/25",
    iconColor: "text-amber-300",
    badge: "Bilingual",
    badgeColor: "bg-amber-400/15 text-amber-200 border-amber-400/25",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Exam-Oriented Practice",
    desc: "Chapter-wise practice sets aligned with the actual exam pattern, marking scheme, and question types from the board.",
    color: "from-cyan-500/15 to-blue-500/10 border-cyan-400/25",
    iconColor: "text-cyan-300",
    badge: "Pattern-Based",
    badgeColor: "bg-cyan-400/15 text-cyan-200 border-cyan-400/25",
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Regular Tests & Feedback",
    desc: "Periodic tests with personalised feedback help you identify weak areas, track progress, and improve before the actual exam.",
    color: "from-emerald-500/15 to-teal-500/10 border-emerald-400/25",
    iconColor: "text-emerald-300",
    badge: "With Feedback",
    badgeColor: "bg-emerald-400/15 text-emerald-200 border-emerald-400/25",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Speed & Presentation Tips",
    desc: "Learn how to manage time in the exam hall, present drawings neatly, and score extra marks through technique and presentation.",
    color: "from-violet-500/15 to-purple-500/10 border-violet-400/25",
    iconColor: "text-violet-300",
    badge: "Pro Tips",
    badgeColor: "bg-violet-400/15 text-violet-200 border-violet-400/25",
  },
];



/* ════════════════════════════════════════
   ELEMENTARY / INTERMEDIATE COURSE PAGE
   (course id = 27)
════════════════════════════════════════ */
export function ElementaryCoursePage({
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
    sections?: string[];
  };
  currentUser: any;
  isEnrolled: boolean;
  isBlocked: boolean;
  onOpenLogin: () => void;
  onEnroll: () => void;
  onContactSupport: () => void;
  isPaying: boolean;
}) {
  const navigate = useNavigate();

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
      navigate(`/my-courses/${course.id}`);
      return;
    }
    onEnroll();
  };

  const getButtonLabel = () => {
    if (isPaying) return "Processing…";
    if (isEnrolled) return "Continue Learning 🚀";
    return "Enroll Now 🚀";
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
        {/* Warm amber overlay to give this course its own visual identity */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/55 to-amber-900/15" />

        <button
          onClick={() => window.history.back()}
          className="absolute mt-20 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-black/60 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6 sm:pb-10 max-w-6xl mx-auto">
          <span className="inline-block bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            🎨 Drawing Grade Exam Prep
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight max-w-3xl mb-2">
            {course.course_name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Palette className="w-3.5 h-3.5 text-amber-300" />
              Elementary & Intermediate
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Video className="w-3.5 h-3.5 text-amber-300" />
              Video Lectures
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Users className="w-3.5 h-3.5 text-amber-300" />
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
                icon: <Palette className="w-5 h-5 text-amber-300" />,
                label: "Grade Level",
                value: "Elem & Inter",
              },
              {
                icon: <Video className="w-5 h-5 text-amber-300" />,
                label: "Includes",
                value: "Video + Resources",
              },
              {
                icon: <Globe className="w-5 h-5 text-amber-300" />,
                label: "Language",
                value: course.language || "Hindi / English",
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-amber-300" />,
                label: "Tests",
                value: "Regular + Mock",
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
              >
                <div className="flex justify-center mb-2">{icon}</div>
                <p className="text-sm font-bold text-white leading-snug">
                  {value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* What You'll Learn */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              What You'll Learn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WHAT_YOU_LEARN.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-200 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Features */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Course Highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COURSE_FEATURES.map(
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
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* About */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-3">
              About this Course
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
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/8 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base mb-1">
                  ✅ You're enrolled!
                </h3>
                <p className="text-sm text-gray-300">
                  Head to your course dashboard to access videos, resources, and
                  practice material.
                </p>
              </div>
              <button
                onClick={() => navigate(`/my-courses/${course.id}`)}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition active:scale-[0.98] flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                Go to Course
              </button>
            </div>
          )}

          {/* Reviews */}
          <CourseApprovedReviews courseId={Number(course.id)} />

          {/* Mentor */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              Your Mentor
            </h2>
            <div className="flex items-start gap-4">
              <img
                src="/vicky.jpg"
                alt="Vickey Sir"
                className="w-14 h-14 rounded-full object-cover object-top shrink-0"
              />
              <div>
                <h3 className="font-bold text-white text-base">Vickey Sir</h3>
                <p className="text-amber-300 text-sm mb-2">
                  Drawing Grade Exam Expert & Art Coach
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" /> 5.0 Rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-400" /> 500+
                    Students
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" /> 3+
                    Courses
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Expert art educator specialising in Drawing Grade Exam preparation
                  and MAH AAC CET coaching. Vickey Sir has helped hundreds of
                  students clear Elementary & Intermediate grade exams with
                  confidence and high scores.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4 order-first lg:order-last">
          {isBlocked && (
            <BlockedAccessBanner onContactSupport={onContactSupport} />
          )}

             {/* Price + CTA card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-4">
            {!isEnrolled && !isBlocked && (
              <div className="text-center">
                <div className="flex items-end justify-center gap-3">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-emerald-400">
                      ₹{course.price}
                    </span>
                    <span className="text-sm text-gray-400 pb-1">/month</span>
                  </div>
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
                      ₹
                      {(course.price_without_discount || 0) - (course.price || 0)}{" "}
                      off
                    </span>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1.5">
                  Billed monthly
                </p>
              </div>
            )}
 
            {!isBlocked && (
              <button
                onClick={handleCTA}
                disabled={isPaying}
                className={`w-full py-3 rounded-xl text-base font-semibold text-white transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 ${
                  isEnrolled
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400"
                } ${isPaying ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isPaying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing…
                  </>
                ) : (
                  getButtonLabel()
                )}
              </button>
            )}
 
            {!isEnrolled && !isBlocked && (
              <button
                onClick={onContactSupport}
                className="w-full px-6 py-3 rounded-xl text-base font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Ask on WhatsApp
              </button>
            )}

            {/* What's included */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-sm font-semibold text-white mb-3">
                This course includes:
              </p>
              <div className="space-y-2">
                {[
                  { icon: "🎥", text: "Video lectures for every topic" },
                  { icon: "📚", text: "Study resources & notes" },
                  { icon: "📝", text: "Chapter-wise practice sets" },
                  { icon: "🧪", text: "Regular tests with feedback" },
                  { icon: "🏆", text: "Full-length mock exams" },
                  { icon: "📅", text: "Access till your exam" },
                  { icon: "🌐", text: "Hindi & English support" },
                  { icon: "🎓", text: "Certificate on completion" },
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

          {/* Course details meta */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              Course Details
            </p>
            <div className="space-y-2.5">
              <MetaRow
                icon={<Layers className="w-4 h-4 text-amber-400" />}
                label="Category"
                value={course.category || "Elementary Intermediate"}
              />
              <MetaRow
                icon={<Palette className="w-4 h-4 text-amber-400" />}
                label="Level"
                value={course.level || "All Levels"}
              />
              <MetaRow
                icon={<Globe className="w-4 h-4 text-amber-400" />}
                label="Language"
                value={course.language || "Hindi / English"}
              />
              <MetaRow
                icon={<Clock className="w-4 h-4 text-amber-400" />}
                label="Access"
                value={course.duration || "Till Exam"}
              />
              <MetaRow
                icon={<Trophy className="w-4 h-4 text-amber-400" />}
                label="Certificate"
                value="On Completion"
              />
              <MetaRow
                icon={<Users className="w-4 h-4 text-amber-400" />}
                label="Students"
                value={String(course.students_enrolled?.length ?? 0)}
              />
              <MetaRow
                icon={<Star className="w-4 h-4 text-yellow-400" />}
                label="Rating"
                value={
                  course.rating && course.rating > 0
                    ? `${course.rating} ⭐`
                    : "New Course"
                }
              />
              <MetaRow
                icon={<Calendar className="w-4 h-4 text-amber-400" />}
                label="Created"
                value={createdDate}
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}