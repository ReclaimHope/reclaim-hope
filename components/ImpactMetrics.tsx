"use client";

import CountUp from "react-countup";

import {
    Utensils,
    Users,
    GraduationCap,
    Handshake,
    TrendingUp,
} from "lucide-react";

type MetricColor = "yellow" | "green" | "blue" | "purple";

type MetricItem = {
    id: number;
    icon: typeof Utensils;
    number: number;
    suffix: string;
    title: string;
    description: string;
    growth: string;
    color: MetricColor;
};

export default function ImpactMetrics() {

    const metrics: MetricItem[] = [
        {
            id: 1,
            icon: Utensils,
            number: 90000,
            suffix: "+",
            title: "Meals Served",
            description:
                "Providing consistent nutrition support to underserved children and families.",
            growth: "+18% this year",
            color: "yellow",
        },

        {
            id: 2,
            icon: Users,
            number: 500,
            suffix: "+",
            title: "Children Supported",
            description:
                "Helping children access education, mentorship, and life-changing opportunities.",
            growth: "+24% this year",
            color: "green",
        },

        {
            id: 3,
            icon: GraduationCap,
            number: 95,
            suffix: "%",
            title: "Attendance Improvement",
            description:
                "Improved school participation through educational and mentorship programs.",
            growth: "+12% this year",
            color: "blue",
        },

        {
            id: 4,
            icon: Handshake,
            number: 20,
            suffix: "+",
            title: "Community Partners",
            description:
                "Collaborating with organizations and supporters to create sustainable impact.",
            growth: "+8 new partners",
            color: "purple",
        },
    ];

    const colorClasses: Record<MetricColor, { bg: string; text: string; glow: string }> = {
        yellow: {
            bg: "bg-yellow-100",
            text: "text-yellow-500",
            glow: "group-hover:shadow-yellow-200",
        },

        green: {
            bg: "bg-green-100",
            text: "text-green-600",
            glow: "group-hover:shadow-green-200",
        },

        blue: {
            bg: "bg-blue-100",
            text: "text-blue-600",
            glow: "group-hover:shadow-blue-200",
        },

        purple: {
            bg: "bg-purple-100",
            text: "text-purple-600",
            glow: "group-hover:shadow-purple-200",
        },
    };

    return (
        <section className="w-full bg-[#f9fafb] py-24 px-6 md:px-16 overflow-hidden">

            <div className="max-w-7xl mx-auto">

                {/* SECTION HEADER */}
                <div className="text-center mb-20">

                    <p className="text-yellow-500 uppercase tracking-[0.3em] font-semibold mb-4">
                        Impact Highlights
                    </p>

                    <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
                        Every number represents lives impacted, opportunities created,
                        and communities strengthened through our programs and partnerships.
                    </p>

                </div>

                {/* METRICS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

                    {metrics.map((metric) => {

                        const Icon = metric.icon;

                        const colors = colorClasses[metric.color];

                        return (
                            <div
                                key={metric.id}
                                data-aos="fade-up"
                                data-aos-duration="900"
                                className={`group bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm hover:shadow-2xl ${colors.glow} hover:-translate-y-3 transition duration-500`}
                            >

                                {/* ICON */}
                                <div
                                    className={`w-20 h-20 rounded-3xl ${colors.bg} flex items-center justify-center mb-8`}
                                >

                                    <Icon className={`w-10 h-10 ${colors.text}`} />

                                </div>

                                {/* NUMBER */}
                                <h3 className="text-5xl font-bold text-gray-900 mb-4">

                                    <CountUp
                                        end={metric.number}
                                        duration={4}
                                        separator=","
                                    />

                                    {metric.suffix}

                                </h3>

                                {/* TITLE */}
                                <h4 className="text-2xl font-bold text-gray-900 mb-5">
                                    {metric.title}
                                </h4>

                                {/* DESCRIPTION */}
                                <p className="text-gray-600 leading-relaxed mb-8">
                                    {metric.description}
                                </p>

                                {/* GROWTH INDICATOR */}
                                <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">

                                    <TrendingUp className="w-4 h-4 text-green-500" />

                                    <span className="text-sm font-semibold text-gray-700">
                                        {metric.growth}
                                    </span>

                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>

        </section>
    );
}