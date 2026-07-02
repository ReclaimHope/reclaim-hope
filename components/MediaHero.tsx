export default function MediaHero() {
  return (
    <section
      className="relative h-[115vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/Media Center.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-6">

        <p className="uppercase tracking-[0.4em] text-[#f9d20a] font-semibold mb-4">
          Media Center
        </p>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
          Stories That Inspire
        </h1>

        <p className="text-xl text-white/90 leading-relaxed mb-10">
          Explore stories, updates, newsletters,
          testimonials, and moments that showcase
          our journey of transforming lives.
        </p>

        <button className="bg-[#001f3f] hover:bg-[#003366] text-white px-8 py-4 rounded-full font-semibold transition">
          Explore Stories
        </button>

      </div>
    </section>
  );
}