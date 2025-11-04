import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlayCircle, CheckCircle2 } from "lucide-react";

export default function CourseLearning() {
  const { courseName } = useParams();
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [courseData, setCourseData] = useState<any>(null);

  useEffect(() => {
    // 🧩 Mock data for now — replace with API later
    const mockCourse = {
      course_name: "Painting Basics",
      sections: [
        {
          title: "Introduction",
          lessons: [
            { id: 1, title: "Welcome to Painting", duration: "4:12", description: "Overview of painting tools and materials.", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: 2, title: "Setting up your workspace", duration: "3:45", description: "Learn how to prepare your space for painting." },
          ],
        },
        {
          title: "Techniques",
          lessons: [
            { id: 3, title: "Color Mixing", duration: "6:30", description: "Understand color theory and mixing." },
            { id: 4, title: "Brush Strokes", duration: "5:20", description: "Practice brush control with simple exercises." },
          ],
        },
      ],
    };

    setCourseData(mockCourse);
    setCurrentLesson(mockCourse.sections[0].lessons[0]); // show first lesson by default
  }, [courseName]);

  if (!courseData) return <p className="text-center mt-20 text-gray-400">Loading course...</p>;

  return (
    <section className="pt-20 pb-12 bg-gradient-to-b from-[#0f1b3d] to-[#1a237e] text-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 px-6">
        {/* 🎥 MAIN VIDEO AREA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black rounded-2xl overflow-hidden h-[400px] flex items-center justify-center shadow-xl">
            {currentLesson?.video_url ? (
              <video
                controls
                className="w-full h-full object-cover"
                src={currentLesson.video_url}
              />
            ) : (
              <p className="text-gray-400">Select a lesson to start learning.</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-300">
              {currentLesson?.title}
            </h2>
            <p className="text-gray-300 mt-2 leading-relaxed">
              {currentLesson?.description || "No description available for this lesson."}
            </p>
          </div>
        </div>

        {/* 📚 SECTIONS SIDEBAR */}
        <aside className="lg:sticky lg:top-24 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-5 h-fit space-y-4">
          <h3 className="text-xl font-semibold text-cyan-300 mb-3">
            Course Sections
          </h3>

          {courseData.sections.map((section: any, i: number) => (
            <div key={i}>
              <p className="font-semibold text-white/90 mb-2">
                {i + 1}. {section.title}
              </p>
              <ul className="space-y-2">
                {section.lessons.map((lesson: any, j: number) => (
                  <li
                    key={j}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all ${
                      currentLesson?.id === lesson.id
                        ? "bg-cyan-700/40 text-white"
                        : "hover:bg-white/10 text-gray-300"
                    }`}
                  >
                    <PlayCircle className="w-4 h-4 text-cyan-400" />
                    <span className="flex-1">{lesson.title}</span>
                    {lesson.completed && (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
