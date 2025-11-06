import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/utils/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Trophy,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  ListChecks,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  question_text: string;
  options: Option[];
  correct_option_id: number;
  selected_option_id: number | null;
  is_correct: boolean;
  image_url?: string | null;
}

interface AttemptDetail {
  success: boolean;
  attempt_id: number;
  score: number;
  total_questions: number;
  submitted_at: string;
  data: Question[];
}

export default function MockTestAttemptReview() {
  const { attempt_id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState<AttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await apiClient.get(`/api/mock-test/attempt/${attempt_id}/details`);
        if (res.data?.success) setDetails(res.data);
        else toast.error("Unable to load attempt details.");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to fetch attempt details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [attempt_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#0f1b3d] via-[#152a52] to-[#1a237e]">
        <Skeleton className="h-8 w-48 bg-white/10 mb-6" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-3/4 bg-white/10 rounded-xl mb-3" />
        ))}
      </div>
    );
  }

  if (!details)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-300">
        <p>Attempt not found.</p>
        <Button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600"
        >
          Go Back
        </Button>
      </div>
    );

  const currentQuestion = details.data[currentIndex];
  const accuracy = ((details.score / details.total_questions) * 100).toFixed(1);

  return (
    <div className="min-h-screen flex flex-row-reverse bg-gradient-to-b from-[#10194f] via-[#132060] to-[#1a237e] text-gray-100 relative">
      {/* 🧭 Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-72 bg-[#0f1b3d]/70 backdrop-blur-md border-l border-white/10 p-6 sticky top-0 h-screen lg:pt-20">
        <ResultSidebar
          details={details}
          accuracy={accuracy}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          navigate={navigate}
        />
      </aside>

      {/* 📱 Floating Button */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-40 bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-full shadow-lg text-white hover:opacity-90 transition"
      >
        <ListChecks className="w-6 h-6" />
      </button>

      {/* 📱 Right-Side Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-80 h-full z-50 bg-[#0f1b3d]/95 backdrop-blur-md border-l border-white/10 flex flex-col"
          >
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-cyan-300">Result Summary</h2>
              <button onClick={() => setDrawerOpen(false)}>
                <X className="w-5 h-5 text-gray-300 hover:text-white" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ResultSidebar
                details={details}
                accuracy={accuracy}
                currentIndex={currentIndex}
                setCurrentIndex={(i: number) => {
                  setCurrentIndex(i);
                  setDrawerOpen(false);
                }}
                navigate={navigate}
                isMobile
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧠 Main Area */}
      <main className="flex-1 flex flex-col justify-between overflow-hidden p-6 lg:p-10 pt-30 lg:pt-10 pb-28 lg:pb-10">
       
        {/* Question Display */}
        <div className="flex-1 flex justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl"
            >
              <Card
                className={`bg-gradient-to-br from-[#1b1335]/90 via-[#2c1e5c]/90 to-[#3a2780]/90 border ${
                  currentQuestion.is_correct
                    ? "border-green-500/40"
                    : "border-red-500/40"
                } p-6 rounded-2xl shadow-lg`}
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="font-semibold text-lg">
                    Q{currentIndex + 1}. {currentQuestion.question_text}
                  </p>
                  {currentQuestion.is_correct ? (
                    <CheckCircle2 className="text-green-400" size={22} />
                  ) : (
                    <XCircle className="text-red-400" size={22} />
                  )}
                </div>

                {currentQuestion.image_url && (
                  <img
                    src={currentQuestion.image_url}
                    alt="question"
                    className="w-full rounded-xl border border-white/10 mb-4"
                  />
                )}

                <div className="space-y-3">
                  {currentQuestion.options.map((opt) => {
                    const isSelected =
                      opt.id === currentQuestion.selected_option_id;
                    const isCorrect =
                      opt.id === currentQuestion.correct_option_id;
                    return (
                      <div
                        key={opt.id}
                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                          isCorrect
                            ? "border-green-400 bg-green-500/10 text-green-300"
                            : isSelected
                            ? "border-red-400 bg-red-500/10 text-red-300"
                            : "border-white/10 text-gray-300"
                        }`}
                      >
                        {opt.text}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-16">
          <Button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="bg-gray-700 hover:bg-gray-600 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <Button
            disabled={currentIndex === details.total_questions - 1}
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 flex items-center gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}

// 🧩 Sidebar Reusable Component
function ResultSidebar({
  details,
  accuracy,
  currentIndex,
  setCurrentIndex,
  navigate,
  isMobile,
}: any) {
  return (
    <div>
      <div className={`flex flex-col items-center ${isMobile ? "mb-4" : "mb-6"}`}>
        <Trophy className="w-8 h-8 text-yellow-400 mb-1" />
        <p className="text-lg font-semibold text-yellow-300">
          {details.score} / {details.total_questions}
        </p>
        <p className="text-sm text-gray-400">
          Accuracy: <span className="text-cyan-300">{accuracy}%</span>
        </p>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <Clock size={13} className="text-purple-300" />
          {new Date(details.submitted_at).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <h3 className="text-md font-medium mb-3 text-center text-gray-300">
        Questions
      </h3>
      <div className="grid grid-cols-5 gap-3">
        {details.data.map((q: Question, idx: number) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`rounded-full w-8 h-8 text-sm font-semibold border transition-all duration-200 ${
              currentIndex === idx
                ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                : q.is_correct
                ? "border-green-400 bg-green-500/20 text-green-300"
                : "border-red-400 bg-red-500/20 text-red-300"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

        <Button
          onClick={() => navigate(-1)}
          className="mt-6 w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 hover:opacity-90 py-2 rounded-xl text-lg"
        >
          Back to Profile
        </Button>
    </div>
  );
}
