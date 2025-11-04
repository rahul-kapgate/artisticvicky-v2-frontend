import { useParams, useNavigate } from "react-router-dom";
import { FileText, PlayCircle, ClipboardCheck, History } from "lucide-react";

export default function CourseLearning() {
  const { courseName } = useParams();
  const navigate = useNavigate();

  const cards = [
    {
      title: "Resources",
      desc: "Download notes, PDFs, and supporting materials.",
      icon: <FileText className="w-10 h-10 text-cyan-300" />,
      gradient: "from-cyan-500/20 to-blue-700/20",
      path: "resources",
    },
    {
      title: "Video Lectures",
      desc: "Watch all your course video lessons here.",
      icon: <PlayCircle className="w-10 h-10 text-cyan-300" />,
      gradient: "from-purple-500/20 to-pink-700/20",
      path: "videos",
    },
    {
      title: "Mock Test",
      desc: "Test your knowledge with interactive quizzes.",
      icon: <ClipboardCheck className="w-10 h-10 text-cyan-300" />,
      gradient: "from-emerald-500/20 to-green-700/20",
      path: "mock-test",
    },
    {
      title: "Previous Mock Tests",
      desc: "Review your past mock test attempts and scores.",
      icon: <History className="w-10 h-10 text-cyan-300" />,
      gradient: "from-amber-500/20 to-orange-700/20",
      path: "previous-tests",
    },
  ];

  return (
    <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-3">
          {courseName?.replace(/-/g, " ") || "My Learning"}
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore your learning materials, attend video lectures, and test your knowledge.
        </p>
      </div>

      {/* ===== CARDS GRID ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(`/my-learnings/${courseName}/${card.path}`)}
            className={`group bg-gradient-to-b ${card.gradient} 
              border border-white/10 rounded-3xl p-6 
              hover:border-cyan-400/40 hover:shadow-cyan-500/20 
              transition-all cursor-pointer backdrop-blur-lg
              flex flex-col items-center text-center shadow-md`}
          >
            <div className="mb-4 group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {card.title}
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
