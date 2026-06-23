export default function NewsletterArchive() {
  return (
    <section className="py-24 px-6 md:px-16">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold mb-12">
          Newsletter Archive
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className="bg-white border rounded-[28px] p-8"
            >

              <h3 className="text-2xl text-gray-500 font-bold mb-3">
                March 2026 Update
              </h3>

              <p className="text-gray-600 mb-6">
                Highlights from our education and nutrition programs.
              </p>

              <button className="bg-[#001f3f] text-white px-6 py-3 rounded-full">
                Download PDF
              </button>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}