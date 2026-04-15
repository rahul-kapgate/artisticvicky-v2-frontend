import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { apiClient } from "@/utils/axiosConfig";
import type { Course } from "@/types/course";
import {
  Calendar,
  Clock,
  Globe,
  Layers,
  Users,
  Star,
  Video,
  Presentation,
  ExternalLink,
  BookOpen,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BarChart3,
  FileText,
  Trophy,
  Timer,
  Target,
  TrendingUp,
  Lock,
  PlayCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import Login from "@/components/Login";
import Register from "@/components/Register";
import CourseApprovedReviews from "@/components/CourseApprovedReviews";

const FREE_MOCK_COURSE_ID = "12";
const PYQ_MOCK_COURSE_ID = "13";
const RESOURCES_COURSE_ID = "16";
const TOTAL_FREE_MOCK_TESTS = 1;
const MOCK_TOTAL_MARKS = 40;
const MOCK_DURATION_MINS = 60;

// PYQ years — 2006 to 2026
const PYQ_YEARS = Array.from({ length: 21 }, (_, i) => 2026 - i);

type MockAttempt = {
  id: number;
  student_id: number;
  course_id: number;
  score: number;
  submitted_at: string;
  courses?: { course_name: string };
};

type MasterclassDetails = {
  id: number;
  course_id: number;
  masterclass_start_at: string;
  masterclass_end_at: string;
  meeting_provider: "zoom" | "google_meet" | "custom" | null;
  meeting_url: string | null;
  meeting_visible_before_minutes: number;
  approval_required: boolean;
  ppt_file_url: string | null;
  ppt_file_name: string | null;
  masterclass_status: "draft" | "published" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
};

type CourseSection = {
  id?: number;
  title: string;
  lessons_count?: number;
  lessons?: { title: string }[];
};

type CourseWithMasterclass = Course & {
  course_type?: "course" | "masterclass";
  masterclass_details?: MasterclassDetails | null;
  students_enrolled?: number[];
  tags?: string[];
  rating?: number;
  price_without_discount?: number;
  created_at?: string;
  category?: string;
  duration?: string;
  language?: string;
  image?: string;
  description?: string;
  price?: number;
  level?: string | null;
  sections?: string[];
};

const SECTION_LABELS: Record<string, { label: string; icon: string }> = {
  resources: { label: "Study Resources", icon: "📚" },
  videos: { label: "Video Lectures", icon: "🎥" },
  "mock-test": { label: "Mock Tests", icon: "📝" },
  "pyq-mock-test": { label: "PYQ Mock Tests", icon: "📋" },
  "live-test": { label: "Live Tests", icon: "⚡" },
};

const WHAT_YOU_LEARN = [
  "Master Object Drawing techniques used in MAH AAC CET",
  "Design Practical exercises with expert feedback",
  "Memory Drawing strategies and tips",
  "General Knowledge topics specific to BFA entrance",
  "Time management and exam strategy",
  "Portfolio building and presentation skills",
];

const SAMPLE_CURRICULUM: CourseSection[] = [
  {
    title: "Module 1 — Object Drawing Basics",
    lessons_count: 4,
    lessons: [
      { title: "Introduction to Object Drawing" },
      { title: "Shading and Rendering Techniques" },
      { title: "Common Objects Practice" },
      { title: "Past Year Questions Walkthrough" },
    ],
  },
  {
    title: "Module 2 — Design Practical",
    lessons_count: 4,
    lessons: [
      { title: "Color Theory & Application" },
      { title: "Pattern Design Fundamentals" },
      { title: "Composition Principles" },
      { title: "Practice Problems" },
    ],
  },
  {
    title: "Module 3 — Memory Drawing",
    lessons_count: 3,
    lessons: [
      { title: "Observation & Recall Techniques" },
      { title: "Outdoor Scene Practice" },
      { title: "Exam Strategy for Memory Drawing" },
    ],
  },
  {
    title: "Module 4 — General Knowledge",
    lessons_count: 3,
    lessons: [
      { title: "Indian Art History" },
      { title: "Famous Artists & Movements" },
      { title: "Architecture & Design Basics" },
    ],
  },
];

/* ── Score helpers ── */
function getScoreColor(score: number, total: number) {
  const pct = (score / total) * 100;
  if (pct >= 75)
    return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
  if (pct >= 50) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
  return "text-red-400 bg-red-400/10 border-red-400/30";
}

function getScoreLabel(score: number, total: number) {
  const pct = (score / total) * 100;
  if (pct >= 75) return "Excellent";
  if (pct >= 50) return "Good";
  if (pct >= 35) return "Average";
  return "Needs Work";
}

/* ════════════════════════════════════════
   MOCK TEST PAGE  (course id = 12)
════════════════════════════════════════ */
function MockTestCoursePage({
  course,
  currentUser,
  isEnrolled,
  attempts,
  attemptsLoading,
  freeMockTestsLeft,
  usedMockTests,
  onTakeMockTest,
  onOpenLogin,
}: {
  course: CourseWithMasterclass;
  currentUser: any;
  isEnrolled: boolean;
  attempts: MockAttempt[];
  attemptsLoading: boolean;
  freeMockTestsLeft: number;
  usedMockTests: number;
  onTakeMockTest: () => void;
  onOpenLogin: () => void;
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

  const isMockButtonDisabled =
    !!currentUser && freeMockTestsLeft <= 0 && !isEnrolled;

  const bestScore = attempts.length
    ? Math.max(...attempts.map((a) => a.score))
    : null;
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)
    : null;

  const openWhatsApp = () => {
    const msg = `Hi, I am interested in "${course.course_name}".\nPrice: ₹${course.price}`;
    window.open(
      `https://wa.me/9325217691?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const handleCTA = () => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    if (isEnrolled || freeMockTestsLeft > 0) {
      onTakeMockTest();
      return;
    }
    openWhatsApp();
  };

  return (
    <section className="bg-gradient-to-b from-[#0a1628] via-[#0f1b3d] to-[#1a237e] text-gray-100 min-h-screen">
      {/* ── Hero ── */}
      <div className="relative w-full h-[240px] sm:h-[340px] md:h-[400px] overflow-hidden">
        <img
          src={course.image || ""}
          alt={course.course_name}
          className="w-full h-full object-cover brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />
        {/* Back button — Mock Test */}
        <button
          onClick={() => window.history.back()}
          className="absolute mt-20 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-black/60 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6 sm:pb-10 max-w-6xl mx-auto">
          <span className="inline-block bg-orange-500/20 border border-orange-400/30 text-orange-200 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            📝 Mock Test Series
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight max-w-3xl mb-2">
            {course.course_name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <FileText className="w-3.5 h-3.5 text-orange-300" />
              {MOCK_TOTAL_MARKS} Questions
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Timer className="w-3.5 h-3.5 text-orange-300" />
              {MOCK_DURATION_MINS} Minutes
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Users className="w-3.5 h-3.5 text-orange-300" />
              {course.students_enrolled?.length ?? 0} students
            </span>
            {course.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-yellow-300">
                  {course.rating}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exam stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: <FileText className="w-5 h-5 text-orange-300" />,
                label: "Questions",
                value: String(MOCK_TOTAL_MARKS),
              },
              {
                icon: <Timer className="w-5 h-5 text-orange-300" />,
                label: "Duration",
                value: `${MOCK_DURATION_MINS} min`,
              },
              {
                icon: <Target className="w-5 h-5 text-orange-300" />,
                label: "Total Marks",
                value: String(MOCK_TOTAL_MARKS),
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-orange-300" />,
                label: "Language",
                value: course.language || "English",
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
              >
                <div className="flex justify-center mb-2">{icon}</div>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Topics covered */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-400" />
              Topics Covered in Mock Tests
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Art History — Indian & International",
                "Famous Artists & Their Works",
                "Design Fundamentals & Principles",
                "Architecture & Sculpture",
                "Current Art Affairs",
                "Color Theory & Terminology",
                "MAH AAC CET Pattern Questions",
                "Speed & Accuracy Practice",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-200 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-3">
              About this Mock Test
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

          {/* ── Attempt History ── */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-400" />
              Your Attempts
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Track your progress across all mock test attempts
            </p>

            {!currentUser ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                <Lock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400 mb-3">
                  Login to see your attempt history
                </p>
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition"
                >
                  Login to Continue
                </button>
              </div>
            ) : attemptsLoading ? (
              <div className="space-y-2 animate-pulse">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-white/5" />
                ))}
              </div>
            ) : attempts.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">
                  No attempts yet. Take your first mock test!
                </p>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                    <p className="text-xl font-bold text-orange-300">
                      {attempts.length}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Attempts</p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                    <p className="text-xl font-bold text-emerald-300">
                      {bestScore ?? "—"}
                      <span className="text-xs text-gray-400">
                        /{MOCK_TOTAL_MARKS}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Best Score</p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                    <p className="text-xl font-bold text-cyan-300">
                      {avgScore ?? "—"}
                      <span className="text-xs text-gray-400">
                        /{MOCK_TOTAL_MARKS}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Avg Score</p>
                  </div>
                </div>

                {/* List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 [scrollbar-width:thin]">
                  {attempts.map((attempt, idx) => {
                    const pct = Math.round(
                      (attempt.score / MOCK_TOTAL_MARKS) * 100,
                    );
                    const colorClass = getScoreColor(
                      attempt.score,
                      MOCK_TOTAL_MARKS,
                    );
                    const label = getScoreLabel(
                      attempt.score,
                      MOCK_TOTAL_MARKS,
                    );
                    return (
                      <div
                        key={attempt.id}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-400/20 flex items-center justify-center text-xs font-bold text-orange-300 shrink-0">
                          {attempts.length - idx}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400">
                            {new Date(attempt.submitted_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                            {" • "}
                            {new Date(attempt.submitted_at).toLocaleTimeString(
                              "en-IN",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                          <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pct >= 75 ? "bg-emerald-400" : pct >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <div
                          className={`shrink-0 rounded-lg border px-2.5 py-1 text-center ${colorClass}`}
                        >
                          <p className="text-sm font-bold leading-none">
                            {attempt.score}/{MOCK_TOTAL_MARKS}
                          </p>
                          <p className="text-[10px] mt-0.5">{label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Reviews */}
          <CourseApprovedReviews courseId={Number(course.id)} />

          {/* Instructor */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-orange-400" />
              Your Instructor
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xl font-bold text-white shrink-0">
                V
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Vicky Sir</h3>
                <p className="text-orange-300 text-sm mb-2">
                  MAH AAC CET Expert & BFA Coach
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" /> 5.0 Rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-orange-400" /> 500+
                    Students
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-orange-400" /> 3
                    Courses
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Expert MAH AAC CET coach helping students unlock their
                  creative potential and secure BFA admissions across
                  Maharashtra's top visual arts colleges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4 order-first lg:order-last">
          {/* Free attempt card — non-enrolled only */}
          {!isEnrolled && (
            <div className="relative overflow-hidden rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/15 via-red-500/10 to-pink-500/10 p-5 shadow-xl">
              <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-orange-400/20 blur-3xl" />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-red-500/20 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-orange-200 mb-4">
                  🎁 1 Free Mock Test
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Total", value: TOTAL_FREE_MOCK_TESTS },
                    {
                      label: "Used",
                      value: attemptsLoading ? "…" : usedMockTests,
                    },
                    {
                      label: "Left",
                      value: attemptsLoading ? "…" : freeMockTestsLeft,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/10 bg-white/10 p-2.5 text-center"
                    >
                      <p className="text-base font-bold text-orange-300">
                        {value}
                      </p>
                      <p className="text-[10px] text-gray-300">{label}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleCTA}
                  disabled={isMockButtonDisabled}
                  className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition mb-2 ${
                    isMockButtonDisabled
                      ? "bg-gray-600 opacity-60 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-red-500 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isMockButtonDisabled
                    ? "No Free Tests Left"
                    : "Start Free Mock Test 🚀"}
                </button>
                <p className="text-center text-xs text-gray-400">
                  {!currentUser
                    ? "Login to take the free mock test"
                    : freeMockTestsLeft > 0
                      ? "Try before you enroll — no payment needed"
                      : "Free attempt used. Enroll for unlimited tests."}
                </p>
              </div>
            </div>
          )}

          {/* Price + Enroll / Start Test */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-4">
            {!isEnrolled && (
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
                      ₹
                      {(course.price_without_discount || 0) -
                        (course.price || 0)}{" "}
                      off
                    </span>
                  </div>
                )}
              </div>
            )}

            {isEnrolled ? (
              <button
                onClick={onTakeMockTest}
                className="w-full py-3 rounded-xl text-base font-semibold text-white bg-orange-600 hover:bg-orange-500 transition flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <PlayCircle className="w-5 h-5" />
                Start Mock Test
              </button>
            ) : (
              <button
                onClick={openWhatsApp}
                className="w-full py-3 rounded-xl text-base font-semibold text-white bg-orange-600 hover:bg-orange-500 transition active:scale-[0.98]"
              >
                Enroll for Unlimited Tests 🚀
              </button>
            )}


            <div className="pt-2 border-t border-white/10">
              <p className="text-sm font-semibold text-white mb-3">
                What you get:
              </p>
              <div className="space-y-2">
                {[
                  { icon: "📝", text: "40 questions per test" },
                  { icon: "⏱️", text: "60 minute timed exam" },
                  { icon: "📊", text: "Instant score & result" },
                  { icon: "🔄", text: "Unlimited attempts (enrolled)" },
                  { icon: "📈", text: "Attempt history & progress" },
                  { icon: "🏆", text: "Best score tracking" },
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

          {/* Test details */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-400" />
              Test Details
            </p>
            <div className="space-y-2.5">
              <MetaRow
                icon={<Layers className="w-4 h-4 text-orange-400" />}
                label="Category"
                value={course.category || "N/A"}
              />
              <MetaRow
                icon={<FileText className="w-4 h-4 text-orange-400" />}
                label="Questions"
                value={String(MOCK_TOTAL_MARKS)}
              />
              <MetaRow
                icon={<Timer className="w-4 h-4 text-orange-400" />}
                label="Duration"
                value={`${MOCK_DURATION_MINS} mins`}
              />
              <MetaRow
                icon={<Globe className="w-4 h-4 text-orange-400" />}
                label="Language"
                value={course.language || "N/A"}
              />
              <MetaRow
                icon={<Clock className="w-4 h-4 text-orange-400" />}
                label="Access"
                value={course.duration || "N/A"}
              />
              <MetaRow
                icon={<Users className="w-4 h-4 text-orange-400" />}
                label="Students"
                value={String(course.students_enrolled?.length ?? 0)}
              />
              <MetaRow
                icon={<Star className="w-4 h-4 text-yellow-400" />}
                label="Rating"
                value={`${course.rating || 0} ⭐`}
              />
              <MetaRow
                icon={<Calendar className="w-4 h-4 text-orange-400" />}
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

/* ════════════════════════════════════════
   PYQ MOCK TEST PAGE  (course id = 13)
════════════════════════════════════════ */
function PYQMockCoursePage({
  course,
  currentUser,
  isEnrolled,
  onOpenLogin,
  onNavigateToPYQ,
}: {
  course: CourseWithMasterclass;
  currentUser: any;
  isEnrolled: boolean;
  onOpenLogin: () => void;
  onNavigateToPYQ: (year: number) => void;
}) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

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

  const openWhatsApp = () => {
    const msg = `Hi, I am interested in "${course.course_name}".\nPrice: ₹${course.price}`;
    window.open(
      `https://wa.me/9325217691?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const handleStartPYQ = (year: number) => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    if (!isEnrolled) {
      openWhatsApp();
      return;
    }
    onNavigateToPYQ(year);
  };

  return (
    <section className="bg-gradient-to-b from-[#0a1628] via-[#0f1b3d] to-[#1a237e] text-gray-100 min-h-screen">
      {/* ── Hero ── */}
      <div className="relative w-full h-[240px] sm:h-[340px] md:h-[400px] overflow-hidden">
        <img
          src={course.image || ""}
          alt={course.course_name}
          className="w-full h-full object-cover brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />
        {/* Back button — PYQ */}
        <button
          onClick={() => window.history.back()}
          className="absolute mt-20 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-black/60 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6 sm:pb-10 max-w-6xl mx-auto">
          <span className="inline-block bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            📋 PYQ Mock Test Series
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight max-w-3xl mb-2">
            {course.course_name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <FileText className="w-3.5 h-3.5 text-violet-300" />
              2006 – 2026 Papers
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Timer className="w-3.5 h-3.5 text-violet-300" />
              {MOCK_DURATION_MINS} Minutes Each
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Users className="w-3.5 h-3.5 text-violet-300" />
              {course.students_enrolled?.length ?? 0} students
            </span>
            {course.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-yellow-300">
                  {course.rating}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: <FileText className="w-5 h-5 text-violet-300" />,
                label: "Years Available",
                value: "21 Papers",
              },
              {
                icon: <Timer className="w-5 h-5 text-violet-300" />,
                label: "Duration Each",
                value: `${MOCK_DURATION_MINS} min`,
              },
              {
                icon: <Target className="w-5 h-5 text-violet-300" />,
                label: "Questions Each",
                value: String(MOCK_TOTAL_MARKS),
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-violet-300" />,
                label: "Language",
                value: course.language || "English",
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
              >
                <div className="flex justify-center mb-2">{icon}</div>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* What's covered */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" />
              What PYQ Papers Cover
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Object Drawing — real exam questions",
                "Design Practical — past patterns & styles",
                "Memory Drawing — scene-based questions",
                "General Knowledge — art & architecture",
                "Color Theory & famous paintings",
                "Indian & International Art History",
                "MAH AAC CET exact question format",
                "Trending topics from recent years",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-200 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-3">
              About this PYQ Series
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

          {/* Reviews */}
          <CourseApprovedReviews courseId={Number(course.id)} />

          {/* Instructor */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-violet-400" />
              Your Instructor
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
                V
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Vicky Sir</h3>
                <p className="text-violet-300 text-sm mb-2">
                  MAH AAC CET Expert & BFA Coach
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" /> 5.0 Rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-violet-400" /> 500+
                    Students
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-violet-400" /> 3
                    Courses
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Expert MAH AAC CET coach helping students unlock their
                  creative potential and secure BFA admissions across
                  Maharashtra's top visual arts colleges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4 order-first lg:order-last">
          {/* Price + CTA */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-4">
            {!isEnrolled && (
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
                      ₹
                      {(course.price_without_discount || 0) -
                        (course.price || 0)}{" "}
                      off
                    </span>
                  </div>
                )}
              </div>
            )}

            {isEnrolled ? (
              <div className="rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-center">
                <p className="text-sm font-semibold text-violet-200">
                  ✅ You're Enrolled
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Select any year above to start practicing
                </p>
              </div>
            ) : (
              <button
                onClick={!currentUser ? onOpenLogin : openWhatsApp}
                className="w-full py-3 rounded-xl text-base font-semibold text-white bg-violet-600 hover:bg-violet-500 transition active:scale-[0.98]"
              >
                Enroll for Full Access 🚀
              </button>
            )}


            <div className="pt-2 border-t border-white/10">
              <p className="text-sm font-semibold text-white mb-3">
                What you get:
              </p>
              <div className="space-y-2">
                {[
                  { icon: "📋", text: "21 years of PYQ papers (2006–2026)" },
                  { icon: "⏱️", text: "60 minute timed exam per paper" },
                  { icon: "📊", text: "Instant score & answer review" },
                  { icon: "🔄", text: "Unlimited re-attempts" },
                  { icon: "📈", text: "Understand real exam pattern" },
                  { icon: "🏆", text: "Strategic advantage over competition" },
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

          {/* Years quick access — enrolled only */}
          {isEnrolled && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
              <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                Quick Access
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {PYQ_YEARS.slice(0, 9).map((year) => (
                  <button
                    key={year}
                    onClick={() => handleStartPYQ(year)}
                    className="rounded-lg border border-white/10 bg-white/5 hover:border-violet-400/30 hover:bg-violet-500/15 py-2 text-center text-xs font-semibold text-gray-300 hover:text-violet-200 transition"
                  >
                    {year}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Showing latest 9 — scroll left for more
              </p>
            </div>
          )}

          {/* Details */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              Course Details
            </p>
            <div className="space-y-2.5">
              <MetaRow
                icon={<Layers className="w-4 h-4 text-violet-400" />}
                label="Category"
                value={course.category || "N/A"}
              />
              <MetaRow
                icon={<FileText className="w-4 h-4 text-violet-400" />}
                label="Papers"
                value="2006 – 2026 (21 years)"
              />
              <MetaRow
                icon={<Timer className="w-4 h-4 text-violet-400" />}
                label="Duration"
                value={`${MOCK_DURATION_MINS} mins each`}
              />
              <MetaRow
                icon={<Target className="w-4 h-4 text-violet-400" />}
                label="Questions"
                value={`${MOCK_TOTAL_MARKS} per paper`}
              />
              <MetaRow
                icon={<Globe className="w-4 h-4 text-violet-400" />}
                label="Language"
                value={course.language || "N/A"}
              />
              <MetaRow
                icon={<Clock className="w-4 h-4 text-violet-400" />}
                label="Access"
                value={course.duration || "N/A"}
              />
              <MetaRow
                icon={<Users className="w-4 h-4 text-violet-400" />}
                label="Students"
                value={String(course.students_enrolled?.length ?? 0)}
              />
              <MetaRow
                icon={<Star className="w-4 h-4 text-yellow-400" />}
                label="Rating"
                value={`${course.rating || 0} ⭐`}
              />
              <MetaRow
                icon={<Calendar className="w-4 h-4 text-violet-400" />}
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

/* ════════════════════════════════════════
   RESOURCES COURSE PAGE  (course id = 16)
════════════════════════════════════════ */
const RESOURCE_ITEMS = [
  {
    icon: "📋",
    title: "PYQ Question Papers",
    desc: "Previous Year Question Papers from 2006 to 2026 in clean, print-ready PDF format.",
    badge: "21 Years",
    color: "from-violet-500/15 to-purple-500/10 border-violet-400/20",
    badgeColor: "bg-violet-400/15 text-violet-200 border-violet-400/25",
  },
  {
    icon: "📝",
    title: "Exam Notes",
    desc: "Concise, topic-wise notes covering Art History, Design, GK, and more — curated for MAH AAC CET.",
    badge: "All Topics",
    color: "from-cyan-500/15 to-blue-500/10 border-cyan-400/20",
    badgeColor: "bg-cyan-400/15 text-cyan-200 border-cyan-400/25",
  },
  {
    icon: "📚",
    title: "E-Books",
    desc: "Comprehensive e-books on Object Drawing, Design Practical, and Memory Drawing techniques.",
    badge: "3 Books",
    color: "from-emerald-500/15 to-teal-500/10 border-emerald-400/20",
    badgeColor: "bg-emerald-400/15 text-emerald-200 border-emerald-400/25",
  },
  {
    icon: "🗒️",
    title: "Session Notes",
    desc: "Handwritten and digital notes from live sessions, summarizing key concepts and tips from each class.",
    badge: "Updated Live",
    color: "from-orange-500/15 to-amber-500/10 border-orange-400/20",
    badgeColor: "bg-orange-400/15 text-orange-200 border-orange-400/25",
  },
];

function ResourcesCoursePage({
  course,
  currentUser,
  isEnrolled,
  onOpenLogin,
}: {
  course: CourseWithMasterclass;
  currentUser: any;
  isEnrolled: boolean;
  onOpenLogin: () => void;
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

  const openWhatsApp = () => {
    const msg = `Hi, I am interested in "${course.course_name}".\nPrice: ₹${course.price}`;
    window.open(
      `https://wa.me/9325217691?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const handleAccess = () => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    if (!isEnrolled) {
      openWhatsApp();
      return;
    }
    navigate(`/my-courses/${course.id}`);
  };

  return (
    <section className="bg-gradient-to-b from-[#0a1628] via-[#0f1b3d] to-[#1a237e] text-gray-100 min-h-screen">
      {/* ── Hero ── */}
      <div className="relative w-full h-[240px] sm:h-[340px] md:h-[400px] overflow-hidden">
        <img
          src={course.image || ""}
          alt={course.course_name}
          className="w-full h-full object-cover brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />
        {/* Back button — Resources */}
        <button
          onClick={() => window.history.back()}
          className="absolute mt-20 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-black/60 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6 sm:pb-10 max-w-6xl mx-auto">
          <span className="inline-block bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            📚 Study Resources
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight max-w-3xl mb-2">
            {course.course_name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
              PYQ Papers
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              Notes & E-Books
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Users className="w-3.5 h-3.5 text-emerald-300" />
              {course.students_enrolled?.length ?? 0} students
            </span>
            {course.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-yellow-300">
                  {course.rating}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: <FileText className="w-5 h-5 text-emerald-300" />,
                label: "PYQ Papers",
                value: "21 Years",
              },
              {
                icon: <BookOpen className="w-5 h-5 text-emerald-300" />,
                label: "E-Books",
                value: "3 Books",
              },
              {
                icon: <Trophy className="w-5 h-5 text-emerald-300" />,
                label: "Session Notes",
                value: "Every Class",
              },
              {
                icon: <Star className="w-5 h-5 text-yellow-300" />,
                label: "Rating",
                value: `${course.rating || 4.9} ⭐`,
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
              >
                <div className="flex justify-center mb-2">{icon}</div>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* What's inside */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              What's Inside
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RESOURCE_ITEMS.map(
                ({ icon, title, desc, badge, color, badgeColor }) => (
                  <div
                    key={title}
                    className={`relative rounded-2xl border bg-gradient-to-br p-5 ${color}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{icon}</span>
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

                    {/* Lock overlay for non-enrolled */}
                    {!isEnrolled && (
                      <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1">
                          <Lock className="w-5 h-5 text-white/60" />
                          <span className="text-[10px] text-white/60 font-medium">
                            Enroll to unlock
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Access CTA — enrolled */}
          {isEnrolled && (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/8 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base mb-1">
                  ✅ You have full access!
                </h3>
                <p className="text-sm text-gray-300">
                  Click below to open your resources dashboard and download your
                  materials.
                </p>
              </div>
              <button
                onClick={handleAccess}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition active:scale-[0.98] flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Open Resources
              </button>
            </div>
          )}

          {/* About */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-3">
              About this Resource Pack
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

          {/* Topics / What you get checklist */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              What You'll Get
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "MAH AAC CET PYQ papers 2006–2026 (PDF)",
                "Clean, print-ready format for offline study",
                "Topic-wise notes for every subject",
                "Art History quick reference e-book",
                "Design Practical illustrated guide",
                "Memory Drawing tips & examples",
                "Session notes updated after every live class",
                "GK cheat sheets for last-minute revision",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-200 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <CourseApprovedReviews courseId={Number(course.id)} />

          {/* Instructor */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              Curated By
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
                V
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Vicky Sir</h3>
                <p className="text-emerald-300 text-sm mb-2">
                  MAH AAC CET Expert & BFA Coach
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" /> 5.0 Rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-400" /> 500+
                    Students
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> 3
                    Courses
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  All resources are personally curated and updated by Vicky Sir
                  to match the latest MAH AAC CET syllabus and exam pattern.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4 order-first lg:order-last">
          {/* Price + CTA */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-4">
            {!isEnrolled && (
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
                      ₹
                      {(course.price_without_discount || 0) -
                        (course.price || 0)}{" "}
                      off
                    </span>
                  </div>
                )}
              </div>
            )}

            {isEnrolled ? (
              <button
                onClick={handleAccess}
                className="w-full py-3 rounded-xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <BookOpen className="w-5 h-5" />
                Access My Resources
              </button>
            ) : (
              <button
                onClick={!currentUser ? onOpenLogin : openWhatsApp}
                className="w-full py-3 rounded-xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition active:scale-[0.98]"
              >
                Get Full Access 🚀
              </button>
            )}


            <div className="pt-2 border-t border-white/10">
              <p className="text-sm font-semibold text-white mb-3">
                This pack includes:
              </p>
              <div className="space-y-2">
                {[
                  { icon: "📋", text: "PYQ papers 2006–2026 (PDF)" },
                  { icon: "📝", text: "Topic-wise exam notes" },
                  { icon: "📚", text: "3 subject e-books" },
                  { icon: "🗒️", text: "Live session notes" },
                  { icon: "🔄", text: "Lifetime access & updates" },
                  { icon: "📥", text: "Instant download after enroll" },
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

          {/* Details card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Resource Details
            </p>
            <div className="space-y-2.5">
              <MetaRow
                icon={<FileText className="w-4 h-4 text-emerald-400" />}
                label="PYQ Papers"
                value="2006–2026"
              />
              <MetaRow
                icon={<BookOpen className="w-4 h-4 text-emerald-400" />}
                label="Format"
                value="PDF / Digital"
              />
              <MetaRow
                icon={<Globe className="w-4 h-4 text-emerald-400" />}
                label="Language"
                value="English / Hindi"
              />
              <MetaRow
                icon={<Clock className="w-4 h-4 text-emerald-400" />}
                label="Access"
                value="Lifetime"
              />
              <MetaRow
                icon={<Users className="w-4 h-4 text-emerald-400" />}
                label="Students"
                value={String(course.students_enrolled?.length ?? 0)}
              />
              <MetaRow
                icon={<Star className="w-4 h-4 text-yellow-400" />}
                label="Rating"
                value={`${course.rating || 0} ⭐`}
              />
              <MetaRow
                icon={<Calendar className="w-4 h-4 text-emerald-400" />}
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

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseWithMasterclass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  const [freeMockTestsLeft, setFreeMockTestsLeft] = useState(
    TOTAL_FREE_MOCK_TESTS,
  );
  const [usedMockTests, setUsedMockTests] = useState(0);
  const [attempts, setAttempts] = useState<MockAttempt[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const currentUser = user || storedUser;
  const isMockCourse = String(id) === FREE_MOCK_COURSE_ID;
  const isPYQCourse = String(id) === PYQ_MOCK_COURSE_ID;
  const isResourcesCourse = String(id) === RESOURCES_COURSE_ID;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await apiClient.get(`/api/course/${id}`);
        const fetchedCourse: CourseWithMasterclass = data?.data;
        setCourse(fetchedCourse);

        const enrolledList = fetchedCourse?.students_enrolled || [];
        const userEnrolled =
          !!currentUser?.id && enrolledList.includes(Number(currentUser.id));
        setIsEnrolled(userEnrolled);

        const isFreeMock =
          String(fetchedCourse?.id) === FREE_MOCK_COURSE_ID &&
          fetchedCourse?.course_type !== "masterclass";

        if (isFreeMock && currentUser?.id) {
          setAttemptsLoading(true);
          try {
            const res = await apiClient.get(
              `/api/mock-test/attempts/${currentUser.id}`,
            );
            const data: MockAttempt[] = res.data?.data || [];
            setAttempts(data);
            setUsedMockTests(data.length);
            // if enrolled, unlimited — free limit only applies to non-enrolled
            if (!userEnrolled) {
              setFreeMockTestsLeft(
                Math.max(TOTAL_FREE_MOCK_TESTS - data.length, 0),
              );
            } else {
              setFreeMockTestsLeft(999); // unlimited
            }
          } catch {
            setAttempts([]);
            setUsedMockTests(0);
            setFreeMockTestsLeft(TOTAL_FREE_MOCK_TESTS);
          } finally {
            setAttemptsLoading(false);
          }
        }
      } catch {
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id, currentUser?.id]);

  if (loading) {
    return (
      <section className="pt-20 pb-8 px-4 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="w-full h-64 bg-gray-700 rounded-2xl mb-6" />
          <div className="h-8 bg-gray-700 rounded w-2/3 mb-4" />
          <div className="h-4 bg-gray-700 rounded w-full mb-3" />
        </div>
      </section>
    );
  }

  if (error) return <p className="text-center text-red-400 mt-10">{error}</p>;
  if (!course)
    return <p className="text-center text-gray-300 mt-10">Course not found.</p>;

  const handleTakeMockTest = () => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }
    if (!isEnrolled && freeMockTestsLeft <= 0) return;
    navigate(`/my-courses/${course.id}/mock-test`, {
      state: { source: "free-mock", courseId: course.id },
    });
  };

  const openWhatsApp = () => {
    const msg = `Hi, I am interested in "${course.course_name}".\nCurrent price: ₹${course.price ?? 0}${
      course.price_without_discount &&
      course.price_without_discount > (course.price || 0)
        ? `\nOriginal price: ₹${course.price_without_discount}`
        : ""
    }`;
    window.open(
      `https://wa.me/9325217691?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const handleNavigateToPYQ = (year: number) => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }
    navigate(`/my-courses/${course.id}/pyq-mock-test`, {
      state: { year, courseId: course.id },
    });
  };

  /* ── Route to mock test page ── */
  if (isMockCourse) {
    return (
      <>
        <MockTestCoursePage
          course={course}
          currentUser={currentUser}
          isEnrolled={isEnrolled}
          attempts={attempts}
          attemptsLoading={attemptsLoading}
          freeMockTestsLeft={freeMockTestsLeft}
          usedMockTests={usedMockTests}
          onTakeMockTest={handleTakeMockTest}
          onOpenLogin={() => setLoginOpen(true)}
        />
        <Login
          open={loginOpen}
          onOpenChange={setLoginOpen}
          onOpenRegister={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
          }}
        />
        <Register open={registerOpen} onOpenChange={setRegisterOpen} />
      </>
    );
  }

  /* ── Route to PYQ mock test page ── */
  if (isPYQCourse) {
    return (
      <>
        <PYQMockCoursePage
          course={course}
          currentUser={currentUser}
          isEnrolled={isEnrolled}
          onOpenLogin={() => setLoginOpen(true)}
          onNavigateToPYQ={handleNavigateToPYQ}
        />
        <Login
          open={loginOpen}
          onOpenChange={setLoginOpen}
          onOpenRegister={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
          }}
        />
        <Register open={registerOpen} onOpenChange={setRegisterOpen} />
      </>
    );
  }

  /* ── Route to resources page ── */
  if (isResourcesCourse) {
    return (
      <>
        <ResourcesCoursePage
          course={course}
          currentUser={currentUser}
          isEnrolled={isEnrolled}
          onOpenLogin={() => setLoginOpen(true)}
        />
        <Login
          open={loginOpen}
          onOpenChange={setLoginOpen}
          onOpenRegister={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
          }}
        />
        <Register open={registerOpen} onOpenChange={setRegisterOpen} />
      </>
    );
  }

  /* ── Regular course / masterclass ── */
  const isMasterclass = course.course_type === "masterclass";
  const masterclass = course.masterclass_details || null;

  const createdDate = course.created_at
    ? new Date(course.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  const formatDateTime = (value?: string | null) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatProvider = (value?: string | null) => {
    if (!value) return "N/A";
    return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const isPptVisible = () =>
    isMasterclass &&
    isEnrolled &&
    masterclass?.masterclass_status === "completed" &&
    !!masterclass?.ppt_file_url;

  const handleMainButton = () => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }
    if (isEnrolled) navigate(`/my-courses/${course.id}`);
    else openWhatsApp();
  };

  const getMainButtonText = () => {
    if (isMasterclass)
      return isEnrolled ? "View Masterclass 🚀" : "Book Masterclass 🚀";
    return isEnrolled ? "Continue Learning 🚀" : "Enroll Now 🚀";
  };

  const discount =
    course.price_without_discount &&
    course.price_without_discount > (course.price || 0)
      ? Math.round(
          ((course.price_without_discount - (course.price || 0)) /
            course.price_without_discount) *
            100,
        )
      : null;

  return (
    <section className="bg-gradient-to-b from-[#0a1628] via-[#0f1b3d] to-[#1a237e] text-gray-100 min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[260px] sm:h-[360px] md:h-[440px] overflow-hidden">
        <img
          src={course.image || ""}
          alt={course.course_name}
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="absolute mt-20 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-black/60 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6 sm:pb-10 max-w-6xl mx-auto">
          <span className="inline-block bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            {isMasterclass ? "Live Masterclass" : course.category || "Course"}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight max-w-3xl mb-2">
            {course.course_name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            {course.rating ? (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-yellow-300">
                  {course.rating}
                </span>
              </span>
            ) : null}
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-cyan-400" />
              {course.students_enrolled?.length ?? 0} students
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Created {createdDate}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {!isMasterclass && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
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
          )}

          {!isMasterclass && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Course Curriculum
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                {SAMPLE_CURRICULUM.length} modules •{" "}
                {SAMPLE_CURRICULUM.reduce(
                  (s, m) => s + (m.lessons_count || 0),
                  0,
                )}{" "}
                lessons
              </p>
              {course.sections && course.sections.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {course.sections.map((sec) => {
                    const info = SECTION_LABELS[sec];
                    if (!info) return null;
                    return (
                      <span
                        key={sec}
                        className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-400/20 text-cyan-200 text-xs px-3 py-1.5 rounded-full"
                      >
                        {info.icon} {info.label}
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="space-y-2">
                {SAMPLE_CURRICULUM.map((module, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedModule(expandedModule === idx ? null : idx)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition text-left"
                    >
                      <div>
                        <span className="font-semibold text-sm text-white">
                          {module.title}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          {module.lessons_count} lessons
                        </span>
                      </div>
                      {expandedModule === idx ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {expandedModule === idx && module.lessons && (
                      <div className="bg-black/20 divide-y divide-white/5">
                        {module.lessons.map((lesson, li) => (
                          <div
                            key={li}
                            className="px-4 py-2.5 flex items-center gap-2.5"
                          >
                            <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="text-sm text-gray-300">
                              {lesson.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isMasterclass && masterclass && (
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-6 space-y-3">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Video className="w-5 h-5 text-cyan-400" />
                Masterclass Details
              </h2>
              <MetaItem
                icon={<Calendar className="w-4 h-4 text-cyan-400 shrink-0" />}
                label="Starts At"
                value={formatDateTime(masterclass.masterclass_start_at)}
              />
              <MetaItem
                icon={<Calendar className="w-4 h-4 text-cyan-400 shrink-0" />}
                label="Ends At"
                value={formatDateTime(masterclass.masterclass_end_at)}
              />
              <MetaItem
                icon={<Video className="w-4 h-4 text-cyan-400 shrink-0" />}
                label="Meeting Provider"
                value={formatProvider(masterclass.meeting_provider)}
              />
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold text-white mb-3">
              About this {isMasterclass ? "Masterclass" : "Course"}
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {course.description ||
                "This course provides a deep dive into the subject with practical examples."}
            </p>
          </div>

          <CourseApprovedReviews courseId={Number(course.id)} />

          {isPptVisible() && (
            <div className="rounded-2xl border border-cyan-400/20 bg-white/5 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-cyan-500/15 p-3 border border-cyan-400/20">
                  <Presentation className="w-6 h-6 text-cyan-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-cyan-300">
                    Masterclass Presentation
                  </h3>
                  <p className="mt-1 text-gray-300 text-sm">
                    The session is completed. Access the presentation file
                    below.
                  </p>
                  <a
                    href={masterclass?.ppt_file_url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 font-semibold text-white text-sm hover:bg-cyan-500 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {masterclass?.ppt_file_name || "Open PPT"}
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              Your Instructor
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
                V
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Vicky Sir</h3>
                <p className="text-cyan-300 text-sm mb-2">
                  MAH AAC CET Expert & BFA Coach
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" /> 5.0 Rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" /> 500+
                    Students
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> 3 Courses
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Expert MAH AAC CET coach helping students unlock their
                  creative potential and secure BFA admissions across
                  Maharashtra's top visual arts colleges.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit space-y-4 order-first lg:order-last">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-4">
            {(!currentUser || !isEnrolled) && (
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
                    <span className="text-emerald-100/70">•</span>
                    <span>
                      ₹
                      {(course.price_without_discount || 0) -
                        (course.price || 0)}{" "}
                      off
                    </span>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleMainButton}
              className={`w-full px-6 py-3 rounded-xl text-base font-semibold text-white transition-all shadow-md active:scale-[0.98] ${isEnrolled ? "bg-green-600 hover:bg-green-500" : "bg-cyan-600 hover:bg-cyan-500"}`}
            >
              {getMainButtonText()}
            </button>
            {!isEnrolled && (
              <button
                onClick={openWhatsApp}
                className="w-full px-6 py-3 rounded-xl text-base font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Message on WhatsApp
              </button>
            )}
            {!isMasterclass &&
              course.sections &&
              course.sections.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-sm font-semibold text-white mb-3">
                    This course includes:
                  </p>
                  <div className="space-y-2">
                    {course.sections.map((sec) => {
                      const info = SECTION_LABELS[sec];
                      if (!info) return null;
                      return (
                        <div
                          key={sec}
                          className="flex items-center gap-2 text-sm text-gray-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          {info.icon} {info.label}
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      🏆 Certificate on completion
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      📅 Access till exam
                    </div>
                  </div>
                </div>
              )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Course Details
            </p>
            <div className="space-y-2.5">
              <MetaRow
                icon={<Layers className="w-4 h-4 text-cyan-400" />}
                label="Category"
                value={course.category || "N/A"}
              />
              <MetaRow
                icon={<Clock className="w-4 h-4 text-cyan-400" />}
                label="Duration"
                value={course.duration || "N/A"}
              />
              <MetaRow
                icon={<Globe className="w-4 h-4 text-cyan-400" />}
                label="Language"
                value={course.language || "N/A"}
              />
              <MetaRow
                icon={<BarChart3 className="w-4 h-4 text-cyan-400" />}
                label="Level"
                value={course.level || "All Levels"}
              />
              <MetaRow
                icon={<Users className="w-4 h-4 text-cyan-400" />}
                label="Students"
                value={String(course.students_enrolled?.length ?? 0)}
              />
              {!isMasterclass && (
                <MetaRow
                  icon={<Star className="w-4 h-4 text-yellow-400" />}
                  label="Rating"
                  value={`${course.rating || 0} ⭐`}
                />
              )}
              <MetaRow
                icon={<Calendar className="w-4 h-4 text-cyan-400" />}
                label="Created"
                value={createdDate}
              />
              {course.tags && course.tags.length > 0 && (
                <div className="flex items-start gap-2 pt-1">
                  <Calendar className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400">Class Days</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {course.tags.map((day, i) => (
                        <span
                          key={i}
                          className="bg-cyan-800/40 text-cyan-200 px-2 py-0.5 rounded-md text-xs"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {course.tags && course.tags.length > 0 && (
                <MetaRow
                  icon={<Clock className="w-4 h-4 text-cyan-400" />}
                  label="Class Time"
                  value="7:30 PM"
                />
              )}
            </div>
          </div>
        </aside>
      </div>

      <Login
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onOpenRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
      <Register open={registerOpen} onOpenChange={setRegisterOpen} />
    </section>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm text-gray-300">
        <strong className="text-white/90">{label}:</strong> {value}
      </span>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
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
