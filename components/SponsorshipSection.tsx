import Image from "next/image";
import Link from "next/link";
import {
    CheckCircle,
    HeartHandshake,
} from "lucide-react";

export default function SponsorshipSection() {

    const sponsorshipBenefits = [
        "Access to education and school materials",
        "Nutritious meals and wellness support",
        "Mentorship and emotional encouragement",
        "Life-changing opportunities for a brighter future",
    ];

    return (
        <section className="w-full bg-white py-24 px-6 md:px-16 overflow-hidden">

            <div className="max-w-7xl mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* LEFT SIDE - IMAGE */}
                    <div className="relative" data-aos="fade-right">

                        {/* DECORATIVE SHAPE */}
                        <div className="absolute -bottom-6 -left-6 w-full h-full bg-yellow-100 rounded-[40px]"></div>

                        {/* IMAGE */}
                        <div className="relative overflow-hidden rounded-[40px] shadow-2xl">

                            <Image
                                src="/aline.png"
                                alt="Child sponsorship"
                                width={700}
                                height={800}
                                className="w-full h-[650px] object-cover hover:scale-105 transition duration-700"
                            />

                        </div>

                        {/* SAMPLE PROFILE CARD */}
                        <div className="absolute bottom-8 right-8 bg-white rounded-3xl shadow-xl p-6 max-w-xs">

                            <p className="text-yellow-500 font-semibold mb-2">
                                Sponsored Child
                            </p>

                            <h4 className="text-2xl font-bold text-gray-900 mb-3">
                                Aline, 10
                            </h4>

                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Dreams of becoming a doctor and helping her community.
                            </p>

                            <div className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-semibold inline-block">
                                $78/month sponsorship
                            </div>

                        </div>

                    </div>

                    {/* RIGHT SIDE - CONTENT */}
                    <div data-aos="fade-left" className="animate-split-reveal">

                        {/* LABEL */}
                        <p className="text-yellow-500 uppercase tracking-[0.3em] font-semibold mb-6">
                            Child Sponsorship
                        </p>

                        {/* HEADING */}
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                            Help a Child Build
                            <br />
                            a Brighter Future
                        </h2>

                        {/* DESCRIPTION */}
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Sponsorship provides underserved children with
                            access to education, nutrition, mentorship,
                            emotional support, and opportunities that
                            transform lives. Your contribution creates
                            long-term impact and gives children hope for
                            a better future.
                        </p>

                        {/* BENEFITS */}
                        <div className="space-y-5 mb-10">

                            {sponsorshipBenefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4"
                                >

                                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />

                                    <p className="text-gray-700 text-lg">
                                        {benefit}
                                    </p>

                                </div>
                            ))}

                        </div>

                        {/* TRANSPARENCY MESSAGE */}
                        <div className="bg-[#f9fafb] rounded-3xl p-6 mb-10 border border-gray-100">

                            <div className="flex items-start gap-4">

                                <HeartHandshake className="w-8 h-8 text-yellow-500 flex-shrink-0" />

                                <div>

                                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                                        Transparency & Accountability
                                    </h4>

                                    <p className="text-gray-600 leading-relaxed">
                                        We are committed to ensuring sponsorship
                                        contributions directly support children’s
                                        education, well-being, and development
                                        through transparent community-centered programs.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* CTA BUTTON */}
                        <Link href="/sponsor" className="bg-yellow-500 hover:bg-yellow-600 transition duration-300 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:scale-105 inline-flex items-center justify-center text-center">

                            Become a Sponsor

                        </Link>

                    </div>

                </div>

            </div>

        </section>
    );
}