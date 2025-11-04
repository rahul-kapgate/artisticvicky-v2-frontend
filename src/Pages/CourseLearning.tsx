import { useParams, useNavigate } from "react-router-dom";
import { FileText, PlayCircle, ClipboardCheck, History } from "lucide-react";

export default function CourseLearning() {
  const { id } = useParams();
  const navigate = useNavigate();

  const cards = [
    {
      title: "Resources",
      desc: "Access notes, guides, and downloadable materials for this course.",
      icon: <FileText className="w-10 h-10 text-cyan-300" />,
      gradient: "from-cyan-500/20 to-blue-700/20",
      path: "resources",
    },
    {
      title: "Video Lectures",
      desc: "Watch all video lectures and master your concepts.",
      icon: <PlayCircle className="w-10 h-10 text-cyan-300" />,
      gradient: "from-purple-500/20 to-pink-700/20",
      path: "videos",
    },
    {
      title: "Mock Test",
      desc: "Evaluate your understanding through interactive tests.",
      icon: <ClipboardCheck className="w-10 h-10 text-cyan-300" />,
      gradient: "from-emerald-500/20 to-green-700/20",
      path: "mock-test",
    },
    {
      title: "PYQ (Previous Year Questions) Test",
      desc: "Solve past year question papers to strengthen your preparation.",
      icon: <History className="w-10 h-10 text-cyan-300" />,
      gradient: "from-amber-500/20 to-orange-700/20",
      path: "pyq",
    },
  ];

  return (
    <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100">
      {/* ===== HEADER ===== */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-3 capitalize">
        My Course
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Choose a section below to access your learning materials, mock tests, and PYQs.
        </p>
      </div>

      {/* ===== 4 CARDS GRID ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(`/my-learnings/${id}/${card.path}`)}
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
