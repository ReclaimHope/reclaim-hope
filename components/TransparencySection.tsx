import {
    ShieldCheck,
    BadgeCheck,
    FileText,
    HeartHandshake,
} from "lucide-react";

type TransparencyItem = {
    id: number;
    icon: React.ElementType;
    title: string;
    description: string;
};
import Link from "next/link";

export default function TransparencySection() {

    const transparencyItems: TransparencyItem[] = [
        {
            id: 1,
            icon: ShieldCheck,
            title: "Registered NGO",
            description:
                "Reclaim Hope Rwanda operates as a registered nonprofit organization committed to serving underserved children and communities responsibly.",
        },

        {
            id: 2,
            icon: HeartHandshake,
            title: "Responsible Fund Usage",
            description:
                "Donations and sponsorships directly support education, nutrition, mentorship, and community-centered programs.",
        },

        {
            id: 3,
            icon: FileText,
            title: "Transparent Reporting",
            description:
                "We are committed to sharing measurable outcomes, impact updates, and program progress with our supporters and partners.",
        },

        {
            id: 4,
            icon: BadgeCheck,
            title: "Donor Accountability",
            description:
                "We prioritize ethical practices, transparency, and accountability to ensure every contribution creates meaningful impact.",
        },
    ];

    return (
        <section className="w-full bg-white py-24 px-6 md:px-16 overflow-hidden">

            <div className="max-w-7xl mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* LEFT CONTENT */}
                    <div>

                        {/* LABEL */}
                        <p className="text-[#001f3f] uppercase tracking-[0.3em] font-semibold mb-6">
                            Transparency & Accountability
                        </p>

                        {/* HEADING */}
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                            Building Trust
                            <br />
                            Through Transparency
                        </h2>

                        {/* DESCRIPTION */}
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            We believe transparency and accountability are essential
                            in creating sustainable impact. Our commitment to ethical
                            practices, responsible fund management, and measurable
                            reporting helps ensure every contribution supports
                            meaningful transformation in the lives of children
                            and communities.
                        </p>

                        {/* HIGHLIGHT BOX */}
                        <div className="bg-[#f9fafb] border border-gray-100 rounded-[32px] p-8 mb-10">

                            <h4 className="text-2xl font-bold text-gray-900 mb-4">
                                Our Commitment
                            </h4>

                            <p className="text-gray-600 leading-relaxed">
                                We are dedicated to maintaining trust through
                                transparent communication, measurable impact
                                reporting, and responsible stewardship of all
                                resources entrusted to our mission.
                            </p>

                        </div>

                        {/* BUTTON */}
                        <Link href="/MediaCenter#reports-archive" className="bg-[#001f3f] hover:bg-[#003366] transition duration-300 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:scale-105">

                            View Impact Reports

                        </Link>

                    </div>

                    {/* RIGHT CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {transparencyItems.map((item) => {

                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.id}
                                    className="group bg-[#f9fafb] border border-gray-100 rounded-[32px] p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-500"
                                >

                                    {/* ICON */}
                                    <div className="w-18 h-18 bg-green-100 rounded-3xl flex items-center justify-center mb-6">

                                        <Icon className="w-9 h-9 text-[#001f3f]" />

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