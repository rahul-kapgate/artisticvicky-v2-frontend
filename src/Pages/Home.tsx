import { Palette, Heart, Globe, Star, Layers, Brush } from "lucide-react";
import { useEffect } from "react";

// ---------- Reasons Section Data ----------
const reasons = [
  {
    icon: <Star className="w-8 h-8 text-pink-400" />,
    title: "Unique Creativity",
    desc: "Every artwork is crafted with originality, blending modern techniques with timeless styles.",
  },
  {
    icon: <Heart className="w-8 h-8 text-red-400" />,
    title: "Personal Expression",
    desc: "Art that speaks emotions, stories, and imagination beyond words.",
  },
  {
    icon: <Layers className="w-8 h-8 text-indigo-400" />,
    title: "Diverse Portfolio",
    desc: "From digital illustrations to traditional paintings, explore a wide range of creative expressions.",
  },
  {
    icon: <Brush className="w-8 h-8 text-green-400" />,
    title: "Custom Creations",
    desc: "Personalized artworks designed to reflect your vision, style, or brand.",
  },
  {
    icon: <Palette className="w-8 h-8 text-yellow-400" />,
    title: "Passion for Art",
    desc: "Driven by love for creativity, each piece is made with dedication and detail.",
  },
  {
    icon: <Globe className="w-8 h-8 text-cyan-400" />,
    title: "Global Reach",
    desc: "Connect with art lovers worldwide through exhibitions and digital platforms.",
  },
];

function Home() {
  // ---------- Auto Scroll for Courses Section ----------
  useEffect(() => {
    const container = document.querySelector("#courseScroll");
    if (!container) return;

    let scrollAmount = 0;
    const interval = setInterval(() => {
      scrollAmount += 300;
      if (scrollAmount >= container.scrollWidth) scrollAmount = 0;
      container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f2c] via-[#10194f] to-[#1a237e] text-gray-100 scroll-smooth mt-14">
      {/* ---------------- Hero Section ---------------- */}
      <section className="text-center pt-20 pb-10 px-6 bg-gradient-to-b from-[#0a0f2c] via-[#10194f] to-[#151b3d]">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <h1 className="text-5xl font-bold mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Artistic Vickey
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover colors, creativity, and inspiration through the eyes of
            Vickey — where imagination meets mastery.
          </p>

          {/* Embedded Video */}
          <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl mb-8 border border-cyan-500/20">
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
      <section
        id="courses"
        className="py-16 px-6 bg-gradient-to-b from-[#10194f] via-[#132060] to-[#1a237e] text-gray-100"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">
            🎨 Explore <span className="text-cyan-300">Courses</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Learn, create, and master your artistic skills through immersive and guided lessons.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Card 1 */}
          <article className="rounded-2xl shadow-xl p-5 transition-all duration-300 hover:scale-105 bg-gradient-to-br from-[#2b1a4a] via-[#3c1e65] to-[#472181] border border-pink-400/20">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=60"
              alt="Digital Painting"
              className="rounded-xl mb-4 h-48 w-full object-cover border border-pink-500/30"
            />
            <h3 className="text-xl font-semibold text-pink-300 mb-2">Digital Painting</h3>
            <p className="text-gray-300 mb-3">
              Learn how to create stunning digital art from scratch using layers and brushes.
            </p>
            <div className="flex justify-between text-sm text-gray-300 mb-3">
              <span>12 Lessons</span>
              <span className="text-pink-200 font-medium">₹499</span>
            </div>
            <button className="w-full py-2 rounded-lg font-semibold border border-pink-400 text-pink-300 hover:bg-pink-500 hover:text-white transition">
              Enroll Now ✨
            </button>
          </article>

          {/* Card 2 */}
          <article className="rounded-2xl shadow-lg p-5 transition-all duration-300 hover:scale-105 bg-gradient-to-br from-[#0f1b3d]/80 via-[#152a52]/80 to-[#1c3d6e]/70 border border-cyan-400/20">
            <img
              src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=60"
              alt="Watercolor Basics"
              className="rounded-xl mb-4 h-48 w-full object-cover border border-cyan-500/30"
            />
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Watercolor Basics</h3>
            <p className="text-gray-300 mb-3">
              Master watercolor techniques to bring life and texture to your paintings.
            </p>
            <div className="flex justify-between text-sm text-gray-300 mb-3">
              <span>8 Lessons</span>
              <span className="text-cyan-200 font-medium">₹299</span>
            </div>
            <button className="w-full py-2 rounded-lg font-semibold border border-cyan-400 text-cyan-300 hover:bg-cyan-500 hover:text-white transition">
              Enroll Now ✨
            </button>
          </article>

          {/* Card 3 */}
          <article className="rounded-2xl shadow-inner p-5 transition-all duration-300 hover:scale-105 bg-[#141a33]/90 border border-violet-400/20">
            <img
              src="https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=900&q=60"
              alt="Sketching for Beginners"
              className="rounded-xl mb-4 h-48 w-full object-cover border border-violet-500/30"
            />
            <h3 className="text-xl font-semibold text-violet-300 mb-2">
              Sketching for Beginners
            </h3>
            <p className="text-gray-300 mb-3">
              Learn the art of proportion, shading, and expression to build strong sketching skills.
            </p>
            <div className="flex justify-between text-sm text-gray-300 mb-3">
              <span>10 Lessons</span>
              <span className="text-violet-200 font-medium">₹399</span>
            </div>
            <button className="w-full py-2 rounded-lg font-semibold border border-violet-400 text-violet-300 hover:bg-violet-500 hover:text-white transition">
              Enroll Now ✨
            </button>
          </article>
        </div>
      </section>

      {/* ---------------- Why Artistic Vickey Section ---------------- */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#1a237e] via-[#141b44] to-[#0a0f2c] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Why <span className="text-cyan-300">Artistic Vickey?</span>
          </h2>
          <p className="text-lg text-gray-300 mb-16 max-w-2xl mx-auto leading-relaxed">
            Explore what makes Artistic Vickey a hub of imagination and skill — where art meets learning.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {reasons.map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-[#1c2a5e]/40 via-[#1f1b4d]/30 to-[#141a33]/40 border border-cyan-400/20 rounded-2xl p-8 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/30"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-2xl font-semibold mb-2 text-cyan-200">{item.title}</h3>
                <p className="text-gray-300 text-base">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <span className="inline-block w-24 h-1 bg-cyan-400 rounded-full"></span>
          </div>
        </div>
      </section>

      {/* ---------------- About Section ---------------- */}
      <section id="about" className="py-20 px-6 bg-gradient-to-b from-[#0a0f2c] via-[#10194f] to-[#151b3d] text-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            About <span className="text-cyan-300">Artistic Vickey</span>
          </h2>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Artistic Vickey is more than just an art platform — it's a creative journey that blends imagination,
            emotion, and technique. Founded by Vickey, a passionate artist dedicated to exploring the beauty of
            colors, textures, and storytelling through art.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
                alt="Artist at work"
                className="rounded-2xl shadow-2xl w-full max-w-md border border-cyan-500/20 hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="text-left md:text-justify">
              <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                Meet Vickey — The Artist Behind the Canvas
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Vickey’s artistic vision is rooted in curiosity and constant exploration. Whether it’s digital
                illustration, watercolor realism, or abstract compositions, each artwork aims to connect emotionally
                with its audience.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Through <strong>Artistic Vickey</strong>, the goal is to inspire others to see art as a language
                that transcends boundaries — celebrating creativity, diversity, and imagination.
              </p>

              <div className="flex items-center gap-3 mt-4">
                <span className="inline-block w-10 h-1 bg-cyan-400 rounded-full"></span>
                <p className="text-gray-100 font-medium">
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
