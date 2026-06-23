export default function MediaFeaturedStory() {
  return (
    <section className="py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-2 overflow-hidden rounded-[40px] shadow-xl">

          <div className="relative min-h-[450px]">
            <img
              src="/logo-transparent.png"
              alt="Featured Story"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white p-12 flex flex-col justify-center">

            <span className="text-yellow-500 font-semibold uppercase tracking-[0.3em]">
              Featured Story
            </span>

            <h2 className="text-4xl text-gray-500 font-bold mt-4 mb-6">
              Empowering Children Through Education
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Discover how educational support helped children remain
              in school and pursue their dreams.
            </p>

            <button className="bg-yellow-500 text-white px-8 py-4 rounded-full w-fit">
              Read Story
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}