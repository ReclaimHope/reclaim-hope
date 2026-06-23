"use client"
import {
    Users,
    BookOpen,
    HeartHandshake,
    School,
} from "lucide-react";
import CountUp from "react-countup";

export default function ImpactSection() {

    const stats = [
        {
            id: 1,
            icon: Users,
            number: 500,
            label: "Children Supported",
        },
        {
            id: 2,
            icon: BookOpen,
            number: 6,
            label: "Programs",
        },
        {
            id: 3,
            icon: HeartHandshake,
            number: 100,
            label: "Families Empowered",
        },
    ];

    return (
        <section className="w-full bg-[#f9fafb] py-20 px-6 md:px-16">

            {/* SECTION HEADER */}
            <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in-up">

                <p className="text-yellow-500 font-semibold uppercase tracking-widest mb-3 text-lg">
                    Our Impact
                </p>

                <p className="text-gray-600 text-lg leading-relaxed">
                    Through education, mentorship, and community support,
                    Reclaim Hope Rwanda continues to positively impact
                    underserved children and families.
                </p>
            </div>

            {/* STATS GRID */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                {stats.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.id}
                            className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >

                            {/* ICON */}
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Icon className="w-8 h-8 text-yellow-500" />
                            </div>

                            {/* NUMBER */}
                            <h3 className="text-4xl font-bold text-gray-900 mb-2">
                                <CountUp
                                end={item.number}
                                duration={2}
                                />+
                            </h3>

                            {/* LABEL */}
                            <p className="text-gray-600 font-medium">
                                {item.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}