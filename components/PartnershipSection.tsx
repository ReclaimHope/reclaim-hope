import Link from "next/link";
import {
    Building2,
    Handshake,
    BriefcaseBusiness,
    Globe,
    ArrowRight,
} from "lucide-react";

export default function PartnershipSection() {

    const partnerships = [
        {
            icon: Building2,
            title: "Corporate Sponsorships",
            description:
                "Support educational, nutrition, and mentorship programs through impactful sponsorship opportunities.",
        },

        {
            icon: BriefcaseBusiness,
            title: "CSR Partnerships",
            description:
                "Collaborate with us through Corporate Social Responsibility initiatives that create sustainable community impact.",
        },

        {
            icon: Handshake,
            title: "NGO & Institutional Collaboration",
            description:
                "Partner on community programs, youth development initiatives, and social impact projects.",
        },

        {
            icon: Globe,
            title: "Community Development Projects",
            description:
                "Work with us to expand opportunities for children and families through innovative community solutions.",
        },
    ];

    return (
        <section className="w-full bg-white py-24 px-6 md:px-16 overflow-hidden">

            <div className="max-w-7xl mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* LEFT CONTENT */}
                    <div>

                        {/* LABEL */}
                        <p className="text-purple-600 uppercase tracking-[0.3em] font-semibold mb-6">
                            Partnership Opportunities
                        </p>

                        {/* HEADING */}
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                            Collaborate With Us
                            <br />
                            for Greater Impact
                        </h2>

                        {/* DESCRIPTION */}
                        <p className="text-lg text-gray-600 leading-relaxed mb-10">
                            We believe sustainable change happens through
                            strong partnerships. By collaborating with NGOs,
                            companies, institutions, and foundations, we can
                            expand opportunities for underserved children and
                            strengthen communities through impactful programs.
                        </p>

                        {/* HIGHLIGHT BOX */}
                        <div className="bg-gradient-to-r from-purple-50 to-yellow-50 border border-purple-100 rounded-[32px] p-8 mb-10">

                            <h4 className="text-2xl font-bold text-gray-900 mb-4">
                                Why Partner With Reclaim Hope Rwanda?
                            </h4>

                            <ul className="space-y-4 text-gray-700">

                                <li>
                                    • Community-centered impact initiatives
                                </li>

                                <li>
                                    • Transparent collaboration approach
                                </li>

                                <li>
                                    • Long-term sustainable programs
                                </li>

                                <li>
                                    • Opportunities for meaningful social impact
                                </li>

                            </ul>

                        </div>

                        {/* BUTTON */}
                        <Link href="/contact#contact-form" className="bg-purple-600 hover:bg-purple-700 transition duration-300 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:scale-105 inline-flex items-center gap-3 justify-center">

                            Become a Partner

                            <ArrowRight className="w-5 h-5" />

                        </Link>

                    </div>

                    {/* RIGHT CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {partnerships.map((item, index) => {

                            const Icon = item.icon;

                            return (
                                <div
                                    key={index}
                                    className="bg-[#f9fafb] border border-gray-100 rounded-[28px] p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-500"
                                >

                                    {/* ICON */}
                                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">

                                        <Icon className="w-8 h-8 text-purple-600" />

                                    </div>

                                    {/* TITLE */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        {item.title}
                                    </h3>

                                    {/* DESCRIPTION */}
                                    <p className="text-gray-600 leading-relaxed">
                                        {item.description}
                                    </p>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </div>

        </section>
    );
}