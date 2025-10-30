import { Palette, Heart, Globe, Star, Layers, Brush } from "lucide-react";

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
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth mt-14">
            {/* ---------------- Hero Section ---------------- */}
            <section className="text-center py-20 px-4 bg-gradient-to-b from-purple-50 via-white to-white">
                <div className="max-w-5xl mx-auto">
                    {/* Title */}
                    <h1 className="text-5xl font-bold mb-4">
                        Welcome to{" "}
                        <span className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 bg-clip-text text-transparent">
                            Artistic Vicky
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Discover colors, creativity, and inspiration through the eyes of
                        Vicky.
                    </p>

                    {/* Intro Video */}
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


            <section id="courses" className="py-16 px-4 bg-white">
                <div className="text-center">corses Section</div>
            </section>

            {/* ---------------- Why Artistic Vicky Section ---------------- */}
            <section className="py-20 px-6 bg-gradient-to-b from-white via-purple-50 to-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6 text-gray-800">
                        Why <span className="text-purple-600">Artistic Vicky?</span>
                    </h2>

                    <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Discover what makes Artistic Vicky a unique space for creativity, passion,
                        and meaningful artistic expression.
                    </p>

                    {/* Reason Cards */}
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

                    {/* Decorative Accent */}
                    <div className="flex justify-center mt-12">
                        <span className="inline-block w-24 h-1 bg-purple-500 rounded-full"></span>
                    </div>
                </div>
            </section>


            {/* ---------------- About Section ---------------- */}
            <section id="about" className="py-20 px-6 bg-gradient-to-b from-white via-purple-50 to-white">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Heading */}
                    <h2 className="text-4xl font-bold mb-6 text-gray-800">
                        About <span className="text-purple-600">Artistic Vicky</span>
                    </h2>

                    {/* Subtext */}
                    <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Artistic Vicky is more than just an art platform — it's a creative journey that blends imagination,
                        emotion, and technique. Founded by Vicky, a passionate artist dedicated to exploring the beauty of
                        colors, textures, and storytelling through art. Each piece represents a unique story — inspired by
                        life, nature, and human emotion.
                    </p>

                    {/* About Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left: Image */}
                        <div className="flex justify-center">
                            <img
                                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
                                alt="Artist at work"
                                className="rounded-2xl shadow-xl w-full max-w-md hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Right: Description */}
                        <div className="text-left md:text-justify">
                            <h3 className="text-2xl font-semibold mb-4 text-purple-700">
                                Meet Vicky — The Artist Behind the Canvas
                            </h3>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                Vicky’s artistic vision is rooted in curiosity and constant exploration. Whether it’s digital
                                illustration, watercolor realism, or abstract compositions, each artwork aims to connect
                                emotionally with its audience.
                            </p>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Through <strong>Artistic Vicky</strong>, the goal is to inspire others to see art as a language
                                that transcends boundaries — celebrating creativity, diversity, and the endless possibilities of imagination.
                            </p>

                            {/* Small Highlight */}
                            <div className="flex items-center gap-3 mt-4">
                                <span className="inline-block w-10 h-1 bg-purple-600 rounded-full"></span>
                                <p className="text-gray-800 font-medium">Creating art that connects hearts worldwide 🌍</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Home;
