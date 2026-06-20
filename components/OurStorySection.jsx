"use client"

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
    HeartHandshake,
    BookOpen,
    Soup,
    Users,
    Pencil,
} from "lucide-react";

export default function OurStorySection() {

    const timeline = [
        {
            title: " Basic Needs for Education",
            description:
                "We eliminate barriers to education by equipping students with essential academic resources, including school fees, required uniforms, scholastic materials, and annual health insurance (Mutuelle de Santé)",
            icon: Pencil,
        },

        {
            title: "L.E.A.D. After-School Program",
            description:
                "Our Life Enhancement & Academic Development (L.E.A.D.) program provides a safe space where children access tutoring, electricity, internet connectivity, and vital mentorship to thrive into healthy adulthood",
            icon: BookOpen,
        },

        {
            title: "Healthy Child",
            description:
                " We pair health education with direct physical care, serving thousands of hot meals annually sourced from our community learning garden alongside clean water filtration initiatives.",
            icon: Soup,
        },

        {
            title: "Family Wrap-Around Support",
            description:
                "We break generational poverty cycles by offering vocational training such as tailoring and artisan crafts—and cultivating leadership through our elected parent committees.",
            icon: Users,
        },
    ];

    const timelineRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fade-up");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: "0px 0px -120px 0px",
                threshold: 0.2,
            }
        );

        timelineRefs.current.forEach((item) => {
            if (item) observer.observe(item);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="w-full bg-white py-24 px-6 md:px-16 overflow-hidden">

            <div className="max-w-7xl mx-auto">

                {/* SECTION HEADER */}
                <div className="text-center mb-20">

                    <p className="text-yellow-500 uppercase tracking-[0.3em] font-semibold mb-4">
                        Our Journey
                    </p>

                    <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
                        What started as a passion for helping underserved children
                        has grown into a mission dedicated to transforming lives
                        through education, mentorship, nutrition, and community support.
                    </p>

                </div>

                {/* CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* LEFT SIDE - IMAGE */}
                    <div className="relative">

                        {/* DECORATIVE SHAPE */}
                        <div className="absolute -top-6 -right-6 w-full h-full bg-yellow-100 rounded-[40px]"></div>

                        {/* IMAGE */}
                        <div className="relative overflow-hidden rounded-[40px] shadow-xl">

                            <Image
                                src="/Impact 1.jpg"
                                alt="Our story"
                                width={700}
                                height={800}
                                className="w-full h-[650px] object-cover hover:scale-105 transition duration-700"
                            />

                        </div>

                    </div>

                    {/* RIGHT SIDE - TIMELINE */}
                    <div className="relative">

                        {/* TIMELINE LINE */}
                        <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-yellow-200"></div>

                        <div className="space-y-12">

                            {timeline.map((item, index) => {

                                const Icon = item.icon;

                                return (
                                    <div
                                        key={index}
                                        ref={(el) => (timelineRefs.current[index] = el)}
                                        className="relative flex gap-8 group opacity-0"
                                    >

                                        {/* ICON */}
                                        <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">

                                            <Icon className="w-8 h-8" />

                                        </div>

                                        {/* CONTENT */}
                                        <div>

                                            {/* TITLE */}
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                {item.title}
                                            </h3>

                                            {/* DESCRIPTION */}
                                            <p className="text-gray-600 leading-relaxed">
                                                {item.description}
                                            </p>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}