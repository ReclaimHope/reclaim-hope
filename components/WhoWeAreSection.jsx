import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function WhoWeAreSection() {
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
                            src="/About Us Page.jpg"
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
                    <p className="text-yellow-500 uppercase tracking-[0.3em] font-semibold mb-4">
                        Who We Are
                    </p>

                    {/* MAIN TITLE */}
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                        Empowering Children &
                        Communities Through Hope
                    </h2>

                    {/* PARAGRAPH */}
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        Reclaim Hope Rwanda is a community-driven organization
                        committed to empowering underserved children and families
                        through education, mentorship, nutrition, and sustainable
                        support initiatives.
                    </p>

                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        We believe every child deserves access to opportunities,
                        guidance, and hope for a brighter future regardless of
                        their background or circumstances.
                    </p>

                    {/* HIGHLIGHTS */}
                    <div className="space-y-4">

                        <div className="flex items-center gap-4">

                            <CheckCircle className="w-6 h-6 text-green-600" />

                            <p className="text-gray-700 font-medium">
                                Education & Mentorship Programs
                            </p>

                        </div>

                        <div className="flex items-center gap-4">

                            <CheckCircle className="w-6 h-6 text-green-600" />

                            <p className="text-gray-700 font-medium">
                                Community Empowerment Initiatives
                            </p>

                        </div>

                        <div className="flex items-center gap-4">

                            <CheckCircle className="w-6 h-6 text-green-600" />

                            <p className="text-gray-700 font-medium">
                                Hope-Centered Child Support
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}