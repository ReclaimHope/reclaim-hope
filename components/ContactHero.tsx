import Image from "next/image";

export default function ContactHero() {
  return (
    <section className="relative h-[160vh] w-full overflow-hidden">
      {/* Optimized Hero Image */}
      <Image
        src="/Contact Us 1.jpg" // Or a specific contact hero image
        alt="Get in touch with Reclaim Hope Rwanda"
        fill
        className="object-cover object-center  animate-hero-zoom"
        priority
        quality={85}
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="text-center text-white max-w-2xl">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-up">
            Get in Touch
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-lg md:text-xl text-slate-200 animate-fade-up-delay-2">
            We would love to hear from you. Reach out to learn more about our programs, partnerships, sponsorships, and community initiatives.
          </p>
        </div>
      </div>
    </section>
  );
}