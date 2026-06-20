import Image from "next/image";
import { CheckCircle } from "lucide-react";
export default function WhyOurWorkMatters() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-16">

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* IMAGE SIDE */}
                <div className="relative animate-slide-in-left">

                    {/* BACKGROUND SHAPE */}
                    <div className="absolute -top-6 -left-6 w-full h-full bg-yellow-100 rounded-[40px]"></div>

                    {/* IMAGE */}
                    <div className="relative overflow-hidden rounded-[40px] shadow-xl">

                        <Image
                            src="/Programs 8.jpg"
                            alt="Children learning together"
                            width={700}
                            height={700}
                            className="w-full h-[500px] object-cover hover:scale-105 transition duration-700"
                        />

                    </div>

                </div>

                {/* TEXT SIDE */}
                <div className="animate-slide-in-right">

                    {/* SMALL LABEL */}
                    <p className="text-yellow-400 uppercase tracking-[0.3em] font-semibold mb-6">
                        Why Our Work Matters
                    </p>

                    {/* PARAGRAPH */}
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        Many underserved children face barriers to education,
                    nutrition, mentorship, and opportunities that shape
                    their future. Without support, countless dreams remain
                    unrealized.
                    </p>

                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        At Reclaim Hope Rwanda, we believe every child deserves
                    the chance to learn, grow, and thrive in a supportive
                    community. Through education, empowerment, and hope-centered
                    initiatives, we are helping transform lives and build
                    brighter futures for generations to come.
                    </p>

                    {/* HIGHLIGHTS */}
                    

                </div>

            </div>

        </section>
    );
}
