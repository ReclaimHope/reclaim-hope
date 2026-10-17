import Image from "next/image"

export default function MediaGallery() {
  return (
    <section className="py-24 px-6 md:px-16">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold mb-12">
          Impact Gallery
        </h2>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">

          {[1,2,3,4,5,6,7].map((item) => (

            <Image
              key={item}
              src={`/gallery/${item}.jpg`}
              alt=""
              width={400}
              height={400}
              className="mb-6 rounded-[24px] hover:scale-[1.02] transition cursor-pointer"
              sizes="(max-width: 640px) 100vw, 50vw"
              loading="lazy"
            />

          ))}

        </div>

      </div>

    </section>
  );
}