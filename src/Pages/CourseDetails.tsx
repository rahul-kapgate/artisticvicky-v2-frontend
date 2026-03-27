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
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import Login from "@/components/Login";
import Register from "@/components/Register";
import CourseApprovedReviews from "@/components/CourseApprovedReviews";

const FREE_MOCK_COURSE_ID = "12";
const TOTAL_FREE_MOCK_TESTS = 3;

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
};

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseWithMasterclass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [freeMockTestsLeft, setFreeMockTestsLeft] = useState(
    TOTAL_FREE_MOCK_TESTS,
  );
  const [usedMockTests, setUsedMockTests] = useState(0);
  const [attemptsLoading, setAttemptsLoading] = useState(false);

  const { user } = useContext(AuthContext);

  // Read fallback user from localStorage
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

        // Fetch course details from backend
        const { data } = await apiClient.get(`/api/course/${id}`);
        const fetchedCourse: CourseWithMasterclass = data?.data;
        setCourse(fetchedCourse);

        // Check enrollment state
        const enrolledList = fetchedCourse?.students_enrolled || [];
        const userEnrolled =
          !!currentUser?.id && enrolledList.includes(Number(currentUser.id));
        setIsEnrolled(userEnrolled);

        // Free mock logic applies only to normal course, not masterclass
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
            const left = Math.max(TOTAL_FREE_MOCK_TESTS - used, 0);

            setUsedMockTests(used);
            setFreeMockTestsLeft(left);
          } catch (attemptErr) {
            console.error("Error fetching mock attempts:", attemptErr);
            setUsedMockTests(0);
            setFreeMockTestsLeft(TOTAL_FREE_MOCK_TESTS);
          } finally {
            setAttemptsLoading(false);
          }
        } else {
          setUsedMockTests(0);
          setFreeMockTestsLeft(TOTAL_FREE_MOCK_TESTS);
        }
      } catch (fetchErr) {
        console.error("Failed to load course details:", fetchErr);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseAndAttempts();
    }
  }, [id, currentUser?.id]);

  if (loading) {
    return (
      <section className="pt-28 pb-12 px-6 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="w-full h-80 bg-gray-700 rounded-xl mb-6" />
          <div className="h-8 bg-gray-700 rounded w-2/3 mb-4" />
          <div className="h-4 bg-gray-700 rounded w-full mb-3" />
          <div className="h-4 bg-gray-700 rounded w-5/6 mb-6" />
        </div>
      </section>
    );
  }

  if (error) {
    return <p className="text-center text-red-400 mt-10">{error}</p>;
  }

  if (!course) {
    return <p className="text-center text-gray-300 mt-10">Course not found.</p>;
  }

  const createdDate = course.created_at
    ? new Date(course.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const isMasterclass = course.course_type === "masterclass";
  const masterclass = course.masterclass_details || null;

  const isFreeMockCourse =
    String(course.id) === FREE_MOCK_COURSE_ID && !isMasterclass;

  const showFreeMockCard = isFreeMockCourse && !isEnrolled;
  const isMockButtonDisabled = !!currentUser && freeMockTestsLeft <= 0;
  const shouldHighlightEnrollNow = !!currentUser && freeMockTestsLeft <= 0;

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
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Meeting link becomes visible only X minutes before start time
  const isMeetingVisible = () => {
    if (!isMasterclass || !masterclass?.masterclass_start_at) return false;

    const start = new Date(masterclass.masterclass_start_at).getTime();
    const beforeMinutes = masterclass.meeting_visible_before_minutes ?? 15;
    const visibleAt = start - beforeMinutes * 60 * 1000;

    return Date.now() >= visibleAt;
  };

  // PPT should be shown after completion
  const isPptVisible = () => {
    return (
      isMasterclass &&
      isEnrolled &&
      masterclass?.masterclass_status === "completed" &&
      !!masterclass?.ppt_file_url
    );
  };

  const openWhatsAppForCourse = () => {
    if (!course) return;

    const currentPrice = course.price ?? 0;
    const originalPrice = course.price_without_discount;

    const message = `Hi, I am interested in "${course.course_name}".
Current price: ₹${currentPrice}${
      originalPrice && originalPrice > currentPrice
        ? `\nOriginal price: ₹${originalPrice}`
        : ""
    }`;

    const whatsappUrl = `https://wa.me/9325217691?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const getMainButtonText = () => {
    if (isMasterclass) {
      if (isEnrolled && isMeetingVisible() && masterclass?.meeting_url) {
        return "View Masterclass 🚀";
      }

      if (isEnrolled) {
        return "View Masterclass 🚀";
      }

      return "Book Masterclass 🚀";
    }

    return isEnrolled ? "Continue Learning 🚀" : "Enroll Now 🚀";
  };

  const getSidebarNote = () => {
    if (isMasterclass) {
      if (isEnrolled && isMeetingVisible() && masterclass?.meeting_url) {
        return "Your live session link is now available.";
      }

      if (isEnrolled) {
        return "You are enrolled in this masterclass. The meeting link will appear shortly before the session starts.";
      }

      return "Reserve your seat and join this live masterclass experience.";
    }

    return isEnrolled
      ? "You're already enrolled. Continue learning and explore new modules."
      : "Learn. Create. Showcase. Guided lessons and a creative community.";
  };

  const handleEnrollNow = () => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }

    openWhatsAppForCourse();
  };

  const handleTakeMockTest = () => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }

    if (freeMockTestsLeft <= 0) {
      return;
    }

    navigate(`/my-courses/${course.id}/mock-test`, {
      state: {
        source: "free-mock",
        courseId: course.id,
      },
    });
  };

  const handleMainButton = () => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }

    if (isEnrolled) {
      navigate(`/my-courses/${course.id}`);
    } else {
      openWhatsAppForCourse();
    }
  };

  return (
    <section className="pt-24 pb-16 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100">
      {/* Hero banner */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-b-3xl shadow-lg">
        <img
          src={course.image || ""}
          alt={course.course_name}
          className="w-full h-full object-cover brightness-75"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 md:p-12">
          <span className="text-cyan-300 uppercase tracking-wide text-sm mb-2">
            {isMasterclass
              ? "Live Masterclass"
              : course.category || "Uncategorized"}
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white mb-3">
            {course.course_name}
          </h1>

          <p className="text-gray-200 max-w-2xl text-lg">
            {course.description}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 px-6 grid lg:grid-cols-3 gap-10">
        {/* Left content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid sm:grid-cols-2 gap-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <MetaItem
              icon={<Layers className="w-5 h-5 text-cyan-400" />}
              label={isMasterclass ? "Type" : "Category"}
              value={isMasterclass ? "Masterclass" : course.category || "N/A"}
            />
            <MetaItem
              icon={<Clock className="w-5 h-5 text-cyan-400" />}
              label="Duration"
              value={course.duration || "N/A"}
            />
            <MetaItem
              icon={<Globe className="w-5 h-5 text-cyan-400" />}
              label="Language"
              value={course.language || "N/A"}
            />
            <MetaItem
              icon={<Users className="w-5 h-5 text-cyan-400" />}
              label="Students Enrolled"
              value={course.students_enrolled?.length ?? 0}
            />
            {!isMasterclass ? (
              <MetaItem
                icon={<Star className="w-5 h-5 text-yellow-400" />}
                label="Rating"
                value={`${course.rating || 0} ⭐`}
              />
            ) : (
              <MetaItem
                icon={<Video className="w-5 h-5 text-cyan-400" />}
                label="Meeting Provider"
                value={formatProvider(masterclass?.meeting_provider)}
              />
            )}
            <MetaItem
              icon={<Calendar className="w-5 h-5 text-cyan-400" />}
              label="Created On"
              value={createdDate}
            />
            {course.tags && course.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-semibold">Class Days:</span>

                {course.tags?.map((day, i) => (
                  <span
                    key={i}
                    className="bg-cyan-800/40 text-cyan-200 px-2 py-1 rounded-md text-xs"
                  >
                    {day}
                  </span>
                ))}
              </div>
            )}
            {course.tags && course.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-semibold">Class Time:</span>

                <span className="bg-cyan-800/40 text-cyan-200 px-2 py-1 rounded-md text-xs">
                  7:30 PM
                </span>
              </div>
            )}

            {isMasterclass && (
              <>
                <MetaItem
                  icon={<Calendar className="w-5 h-5 text-cyan-400" />}
                  label="Starts At"
                  value={formatDateTime(masterclass?.masterclass_start_at)}
                />

                <MetaItem
                  icon={<Calendar className="w-5 h-5 text-cyan-400" />}
                  label="Ends At"
                  value={formatDateTime(masterclass?.masterclass_end_at)}
                />
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-cyan-300 mb-3">
              About this course
            </h2>
            <p className="text-gray-200 leading-relaxed text-lg">
              {course.description ||
                "This course provides a deep dive into the subject with practical examples and step-by-step lessons to help you master new skills."}
            </p>
          </div>

          {/* Approved reviews for this particular course */}
          <CourseApprovedReviews courseId={Number(course.id)} />

          {/* Tags */}
          {/* {course.tags && course.tags.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-cyan-800/40 text-cyan-200 px-3 py-1 rounded-full text-sm border border-cyan-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )} */}

          {/* PPT card for completed masterclass */}
          {isPptVisible() && (
            <div className="rounded-2xl border border-cyan-400/20 bg-white/10 backdrop-blur-md p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-cyan-500/15 p-3 border border-cyan-400/20">
                  <Presentation className="w-6 h-6 text-cyan-300" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-cyan-300">
                    Masterclass Presentation
                  </h3>
                  <p className="mt-2 text-gray-200">
                    The session is completed. You can now access the
                    presentation file shared for this masterclass.
                  </p>

                  <a
                    href={masterclass?.ppt_file_url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-500"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {masterclass?.ppt_file_name || "Open PPT"}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="lg:sticky lg:top-28 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg space-y-5 h-fit">
          {showFreeMockCard ? (
            <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-sky-500/10 to-indigo-500/15 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
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
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center">
                    <p className="text-base font-semibold text-cyan-300">
                      {TOTAL_FREE_MOCK_TESTS}
                    </p>
                    <p className="text-[11px] text-gray-200">Total</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center">
                    <p className="text-base font-semibold text-cyan-300">
                      {attemptsLoading ? "..." : usedMockTests}
                    </p>
                    <p className="text-[11px] text-gray-200">Used</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center">
                    <p className="text-base font-semibold text-cyan-300">
                      {attemptsLoading ? "..." : freeMockTestsLeft}
                    </p>
                    <p className="text-[11px] text-gray-200">Left</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={handleTakeMockTest}
                    disabled={isMockButtonDisabled}
                    className={`w-full rounded-xl px-4 py-3 font-semibold text-white shadow-md transition ${
                      isMockButtonDisabled
                        ? "cursor-not-allowed bg-gray-600 opacity-70"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] hover:from-cyan-400 hover:to-blue-500"
                    }`}
                  >
                    {isMockButtonDisabled
                      ? "No Mock Tests Left"
                      : "Take a Mock Test"}
                  </button>

                  <button
                    onClick={handleEnrollNow}
                    className={`w-full rounded-xl px-4 py-3 font-semibold text-white transition shadow-md ${
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
            <>
              {(!currentUser || !isEnrolled) && !isFreeMockCourse && (
                <div className="flex flex-col items-center text-center">
                  <span className="text-gray-300 text-sm">
                    {isMasterclass ? "Masterclass Price" : "Course Price"}
                  </span>

                  <div className="mt-2 flex items-end justify-center gap-3">
                    <h3 className="text-4xl font-extrabold text-emerald-400 leading-none">
                      ₹{course.price}
                    </h3>

                    {course.price_without_discount &&
                      course.price_without_discount > (course.price || 0) && (
                        <span className="text-lg text-red-500 line-through">
                          ₹{course.price_without_discount}
                        </span>
                      )}
                  </div>

                  {course.price_without_discount &&
                    course.price_without_discount > (course.price || 0) && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-200 border border-emerald-400/20">
                        <span className="font-semibold">
                          Save{" "}
                          {Math.round(
                            ((course.price_without_discount -
                              (course.price || 0)) /
                              course.price_without_discount) *
                              100,
                          )}
                          %
                        </span>
                        <span className="text-emerald-100/70">•</span>
                        <span>
                          ₹{course.price_without_discount - (course.price || 0)}{" "}
                          off
                        </span>
                      </div>
                    )}
                </div>
              )}

              <button
                onClick={handleMainButton}
                className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-md ${
                  isEnrolled
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-cyan-600 hover:bg-cyan-500"
                }`}
              >
                {getMainButtonText()}
              </button>

              <p className="text-center text-gray-400 text-sm">
                {getSidebarNote()}
              </p>
            </>
          )}
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
    <div className="flex items-center space-x-3">
      {icon}
      <span className="text-gray-200">
        <strong className="text-white/90">{label}:</strong> {value}
      </span>
    </div>
  );
}
