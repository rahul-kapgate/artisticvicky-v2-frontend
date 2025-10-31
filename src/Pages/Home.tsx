import { Palette, Heart, Globe, Star, Layers, Brush } from "lucide-react";
import { useEffect } from "react";

// ---------- Reasons Section ----------
const reasons = [
  {
    icon: <Star className="w-8 h-8 text-pink-500" />,
    title: "Unique Creativity",
    desc: "Every artwork is crafted with originality, blending modern techniques with timeless styles.",
  },
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: "Personal Expression",
    desc: "Art that speaks emotions, stories, and imagination beyond words.",
  },
  {
    icon: <Layers className="w-8 h-8 text-indigo-500" />,
    title: "Diverse Portfolio",
    desc: "From digital illustrations to traditional paintings, explore a wide range of creative expressions.",
  },
  {
    icon: <Brush className="w-8 h-8 text-green-500" />,
    title: "Custom Creations",
    desc: "Personalized artworks designed to reflect your vision, style, or brand.",
  },
  {
    icon: <Palette className="w-8 h-8 text-yellow-500" />,
    title: "Passion for Art",
    desc: "Driven by love for creativity, each piece is made with dedication and detail.",
  },
  {
    icon: <Globe className="w-8 h-8 text-blue-500" />,
    title: "Global Reach",
    desc: "Connect with art lovers worldwide through exhibitions and digital platforms.",
  },
];

function Home() {
  useEffect(() => {
    const container = document.querySelector("#courseScroll");
    let scrollAmount = 0;
    const interval = setInterval(() => {
      scrollAmount += 300;
      // @ts-ignore
      if (scrollAmount >= container.scrollWidth) scrollAmount = 0;
      // @ts-ignore
      container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth mt-14">
      {/* ---------------- Hero Section ---------------- */}
      <section className="text-center pt-20 pb-6 px-4 bg-gradient-to-b from-purple-50 via-white to-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 bg-clip-text text-transparent">
              Artistic Vicky
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover colors, creativity, and inspiration through the eyes of
            Vicky.
          </p>

          <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl mb-8">
            <iframe
              className="w-full h-64 sm:h-96"
              src="https://www.youtube.com/embed/R_9NzB6LzEY?autoplay=1&mute=1&loop=1&playlist=R_9NzB6LzEY&controls=1&rel=0"
              title="Intro Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* ---------------- Courses Section ---------------- */}
      <section id="courses" className="py-4 px-6 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🎨 Explore <span className="text-purple-600"> Courses </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn, create, and master your artistic skills through these
            step-by-step lessons.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Course 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-4 hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=60"
              alt="Digital Painting"
              className="rounded-xl mb-4 h-48 w-full object-cover"
            />
            <h3 className="text-xl font-semibold mb-2">Digital Painting</h3>
            <p className="text-gray-600 mb-3">
              Learn how to create stunning digital art from scratch using layers
              and brushes.
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>12 Lessons</span>
              <span>₹499</span>
            </div>
            {/* 🔹 Vibrant Gradient Glow */}
            <button className="mt-4 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Enroll Now ✨
            </button>
          </div>

          {/* Course 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-4 hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=60"
              alt="Watercolor Basics"
              className="rounded-xl mb-4 h-48 w-full object-cover"
            />
            <h3 className="text-xl font-semibold mb-2">Watercolor Basics</h3>
            <p className="text-gray-600 mb-3">
              Master watercolor techniques to bring life and texture to your
              paintings.
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>8 Lessons</span>
              <span>₹299</span>
            </div>
            {/* 🌊 Calm Indigo Wave */}
            <button className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:from-sky-500 hover:to-indigo-500 hover:scale-105 transition-all duration-300">
              Learn More 🎨
            </button>
          </div>

          {/* Course 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-4 hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=600&q=60"
              alt="Sketching for Beginners"
              className="rounded-xl mb-4 h-48 w-full object-cover"
            />
            <h3 className="text-xl font-semibold mb-2">
              Sketching for Beginners
            </h3>
            <p className="text-gray-600 mb-3">
              Learn the art of proportion, shading, and expression to build
              strong sketching skills.
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>10 Lessons</span>
              <span>₹399</span>
            </div>
            {/* ✏️ Minimal Elegant Outline */}
            <button className="mt-4 w-full border-2 border-purple-500 text-purple-600 font-semibold px-4 py-2 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300">
              Start Now ✏️
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- Why Artistic Vicky Section ---------------- */}
      <section className="py-12 px-6 bg-gradient-to-b from-white via-purple-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Why <span className="text-purple-600">Artistic Vicky?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover what makes Artistic Vicky a unique space for creativity,
            passion, and meaningful artistic expression.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md shadow-md rounded-2xl p-8 border border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-purple-800">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <span className="inline-block w-24 h-1 bg-purple-500 rounded-full"></span>
          </div>
        </div>
      </section>

      {/* ---------------- About Section ---------------- */}
      <section
        id="about"
        className="py-4 px-6 bg-gradient-to-b from-white via-purple-50 to-white"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            About <span className="text-purple-600">Artistic Vicky</span>
          </h2>

          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Artistic Vicky is more than just an art platform — it's a creative
            journey that blends imagination, emotion, and technique. Founded by
            Vicky, a passionate artist dedicated to exploring the beauty of
            colors, textures, and storytelling through art. Each piece
            represents a unique story — inspired by life, nature, and human
            emotion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
                alt="Artist at work"
                className="rounded-2xl shadow-xl w-full max-w-md hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="text-left md:text-justify">
              <h3 className="text-2xl font-semibold mb-4 text-purple-700">
                Meet Vicky — The Artist Behind the Canvas
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Vicky’s artistic vision is rooted in curiosity and constant
                exploration. Whether it’s digital illustration, watercolor
                realism, or abstract compositions, each artwork aims to connect
                emotionally with its audience.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Through <strong>Artistic Vicky</strong>, the goal is to inspire
                others to see art as a language that transcends boundaries —
                celebrating creativity, diversity, and imagination.
              </p>

              <div className="flex items-center gap-3 mt-4">
                <span className="inline-block w-10 h-1 bg-purple-600 rounded-full"></span>
                <p className="text-gray-800 font-medium">
                  Creating art that connects hearts worldwide 🌍
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
