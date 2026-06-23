import Image from "next/image";

export default function IntroductionSection() {
    return (
        <section className="w-full bg-white py-20 px-6 md:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* IMAGE SIDE */}
                <div className="flex justify-center animate-slide-in-left">
                    <div className="animate-float">
                        <Image
                            src="/About Us 1.jpg"
                            alt="Children learning and receiving educational support from Reclaim Hope Rwanda"
                            width={500}
                            height={500}
                            className="w-full max-w-md"
                            quality={85}
                        />
                    </div>
                </div>

                {/* TEXT SIDE */}
                <div className="animate-fade-in-up">
                    <p className="text-yellow-600 font-semibold uppercase tracking-widest mb-3 font-poppins">
                        About Us
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 font-playfair">
                        Reclaiming Hope Through Education & Empowerment
                    </h2>

                    <p className="text-gray-600 text-lg leading-relaxed mb-4 font-poppins">
                        Reclaim Hope Rwanda supports underserved children and communities
                        through education, mentorship, nutrition, and empowerment programs.
                    </p>

                    <p className="text-gray-600 text-lg leading-relaxed font-poppins">
                        Our mission is to create opportunities that inspire growth,
                        confidence, and a brighter future for every child.
                    </p>

                    <button className="mt-8">
                        <a href="/about" className=" bg-[#001f3f] hover:bg-[#002b5b] transition-all duration-300 text-white px-10 py-4 rounded-full font-medium cursor-pointer hover:scale-105">
                            Learn More
                        </a>
                    </button>
                </div>
            </div>
        </section>
    );
}