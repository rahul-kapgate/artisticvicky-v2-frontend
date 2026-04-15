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
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import Login from "@/components/Login";
import Register from "@/components/Register";
import CourseApprovedReviews from "@/components/CourseApprovedReviews";

const FREE_MOCK_COURSE_ID = "12";
const TOTAL_FREE_MOCK_TESTS = 1;

type MockAttempt = {
  id: number;
  student_id: number;
  course_id: number;
  score: number;
  submitted_at: string;
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
  instructor?: {
    name: string;
    bio: string;
    avatar?: string;
    students?: number;
    courses?: number;
    rating?: number;
  };
};

// Map section keys to readable labels and icons
const SECTION_LABELS: Record<string, { label: string; icon: string }> = {
  resources: { label: "Study Resources", icon: "📚" },
  videos: { label: "Video Lectures", icon: "🎥" },
  "mock-test": { label: "Mock Tests", icon: "📝" },
  "pyq-mock-test": { label: "PYQ Mock Tests", icon: "📋" },
  "live-test": { label: "Live Tests", icon: "⚡" },
};

// Static "What You'll Learn" content (customize per course or pull from API)
const WHAT_YOU_LEARN = [
  "Master Object Drawing techniques used in MAH AAC CET",
  "Design Practical exercises with expert feedback",
  "Memory Drawing strategies and tips",
  "General Knowledge topics specific to BFA entrance",
  "Time management and exam strategy",
  "Portfolio building and presentation skills",
];

// Static sample curriculum
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

  useEffect(() => {
    const fetchCourseAndAttempts = async () => {
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

        const isFreeMockCourse =
          String(fetchedCourse?.id) === FREE_MOCK_COURSE_ID &&
          fetchedCourse?.course_type !== "masterclass";

        if (isFreeMockCourse && currentUser?.id) {
          setAttemptsLoading(true);
          try {
            const attemptsRes = await apiClient.get(
              `/api/mock-test/attempts/${currentUser.id}`,
            );
            const attempts: MockAttempt[] = attemptsRes.data?.data || [];
            const used = attempts.length;
            setUsedMockTests(used);
            setFreeMockTestsLeft(Math.max(TOTAL_FREE_MOCK_TESTS - used, 0));
          } catch {
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

    if (id) fetchCourseAndAttempts();
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

  const isMasterclass = course.course_type === "masterclass";
  const masterclass = course.masterclass_details || null;
  const isFreeMockCourse =
    String(course.id) === FREE_MOCK_COURSE_ID && !isMasterclass;

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

  const isMeetingVisible = () => {
    if (!isMasterclass || !masterclass?.masterclass_start_at) return false;
    const start = new Date(masterclass.masterclass_start_at).getTime();
    const visibleAt =
      start - (masterclass.meeting_visible_before_minutes ?? 15) * 60 * 1000;
    return Date.now() >= visibleAt;
  };

  const isPptVisible = () =>
    isMasterclass &&
    isEnrolled &&
    masterclass?.masterclass_status === "completed" &&
    !!masterclass?.ppt_file_url;

  const openWhatsApp = () => {
    if (!course) return;
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

  const handleMainButton = () => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }
    if (isEnrolled) navigate(`/my-courses/${course.id}`);
    else openWhatsApp();
  };

  const handleEnrollNow = () => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }
    openWhatsApp();
  };

  const handleTakeMockTest = () => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }
    if (freeMockTestsLeft <= 0) return;
    navigate(`/my-courses/${course.id}/mock-test`, {
      state: { source: "free-mock", courseId: course.id },
    });
  };

  const getMainButtonText = () => {
    if (isMasterclass) {
      if (isEnrolled) return "View Masterclass 🚀";
      return "Book Masterclass 🚀";
    }
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

  const showFreeMockCard = isFreeMockCourse && !isEnrolled;
  const isMockButtonDisabled = !!currentUser && freeMockTestsLeft <= 0;
  const shouldHighlightEnrollNow = !!currentUser && freeMockTestsLeft <= 0;

  return (
    <section className="bg-gradient-to-b from-[#0a1628] via-[#0f1b3d] to-[#1a237e] text-gray-100 min-h-screen">
      {/* ── Hero ── */}
      <div className="relative w-full h-[260px] sm:h-[360px] md:h-[440px] overflow-hidden">
        <img
          src={course.image || ""}
          alt={course.course_name}
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />
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

      {/* ── Main Layout ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-8">
          {/* What You'll Learn */}
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

          {/* Course Curriculum */}
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

              {/* Sections included */}
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
                        <span>{info.icon}</span>
                        {info.label}
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

          {/* Masterclass schedule info */}
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

          {/* About */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold text-white mb-3">
              About this {isMasterclass ? "Masterclass" : "Course"}
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {course.description ||
                "This course provides a deep dive into the subject with practical examples."}
            </p>
          </div>

          {/* Reviews */}
          <CourseApprovedReviews courseId={Number(course.id)} />

          {/* PPT for completed masterclass */}
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

          {/* Instructor */}
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

        {/* ── Right Sidebar ── */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4 order-first lg:order-last">
          {showFreeMockCard ? (
            /* Free Mock Card */
            <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-sky-500/10 to-indigo-500/15 p-5 shadow-xl">
              <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyan-200">
                  Free Mock Test
                </div>
                <div className="mt-4 flex items-end gap-3">
                  <h3 className="text-5xl font-extrabold leading-none text-cyan-300">
                    {attemptsLoading ? "..." : freeMockTestsLeft}
                  </h3>
                  <p className="pb-1 text-sm text-gray-200">tests left</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-200">
                  Start free practice and check your preparation level.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: "Total", value: TOTAL_FREE_MOCK_TESTS },
                    {
                      label: "Used",
                      value: attemptsLoading ? "..." : usedMockTests,
                    },
                    {
                      label: "Left",
                      value: attemptsLoading ? "..." : freeMockTestsLeft,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center"
                    >
                      <p className="text-base font-semibold text-cyan-300">
                        {value}
                      </p>
                      <p className="text-[11px] text-gray-200">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={handleTakeMockTest}
                    disabled={isMockButtonDisabled}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition ${
                      isMockButtonDisabled
                        ? "cursor-not-allowed bg-gray-600 opacity-70"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    {isMockButtonDisabled
                      ? "No Mock Tests Left"
                      : "Take a Mock Test"}
                  </button>
                  <button
                    onClick={handleEnrollNow}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition shadow-md active:scale-[0.98] ${
                      shouldHighlightEnrollNow
                        ? "bg-cyan-600 hover:bg-cyan-500"
                        : "border border-white/15 bg-white/10 hover:bg-white/15"
                    }`}
                  >
                    Enroll Now
                  </button>
                </div>
                <p className="mt-4 text-center text-xs text-gray-300">
                  {!currentUser
                    ? "Login required to start the mock test."
                    : freeMockTestsLeft > 0
                      ? "Use your free attempts before enrolling."
                      : "Your free mock tests are finished. Enroll to continue."}
                </p>
              </div>
            </div>
          ) : (
            /* Regular Enroll Card */
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-4">
              {(!currentUser || !isEnrolled) && !isFreeMockCourse && (
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
                className={`w-full px-6 py-3 rounded-xl text-base font-semibold text-white transition-all shadow-md active:scale-[0.98] ${
                  isEnrolled
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-cyan-600 hover:bg-cyan-500"
                }`}
              >
                {getMainButtonText()}
              </button>

              {/* WhatsApp button for non-enrolled */}
              {!isEnrolled && (
                <button
                  onClick={openWhatsApp}
                  className="w-full px-6 py-3 rounded-xl text-base font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message on WhatsApp
                </button>
              )}

              {/* Includes section */}
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
          )}

          {/* Course meta card */}
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
