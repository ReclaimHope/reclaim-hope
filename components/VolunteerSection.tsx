import Image from "next/image";
import Link from "next/link";
import {
    Users,
    GraduationCap,
    CalendarDays,
    Truck,
} from "lucide-react";

export default function VolunteerSection() {

    const volunteerAreas = [
        {
            icon: GraduationCap,
            title: "Mentorship & Teaching",
        },

        {
            icon: CalendarDays,
            title: "Community Events",
        },

        {
            icon: Users,
            title: "Youth Support Activities",
        },

        {
            icon: Truck,
            title: "Logistics & Program Assistance",
        },
    ];

    return (
        <section className="w-full bg-[#f9fafb] py-24 px-6 md:px-16 overflow-hidden">

            <div className="max-w-7xl mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* IMAGE COLLAGE */}
                    <div className="grid grid-cols-2 gap-5">

                        {/* LARGE IMAGE */}
                        <div className="col-span-2 relative overflow-hidden rounded-[32px] h-[320px] shadow-xl">

                            <Image
                                src="/empowerment.png"
                                alt="Volunteer mentorship"
                                fill
                                className="object-cover hover:scale-105 transition duration-700"
                            />

                        </div>

                        {/* SMALL IMAGE */}
                        <div className="relative overflow-hidden rounded-[28px] h-[220px] shadow-lg">

                            <Image
                                src="/children.jpg"
                                alt="Community event"
                                fill
                                className="object-cover hover:scale-105 transition duration-700"
                            />

                        </div>

                        {/* SMALL IMAGE */}
                        <div className="relative overflow-hidden rounded-[28px] h-[220px] shadow-lg">

                            <Image
                                src="/mentors_kids.jpg"
                                alt="Teaching support"
                                fill
                                className="object-cover hover:scale-105 transition duration-700"
                            />

                        </div>

                    </div>

                    {/* CONTENT */}
                    <div>

                        {/* LABEL */}
                        <p className="text-green-600 uppercase tracking-[0.3em] font-semibold mb-6">
                            Volunteer With Us
                        </p>

                        {/* HEADING */}
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                            Use Your Time &
                            <br />
                            Skills to Inspire Change
                        </h2>

                        {/* DESCRIPTION */}
                        <p className="text-lg text-gray-600 leading-relaxed mb-10">
                            Volunteers play a vital role in empowering children
                            and strengthening communities. Whether through
                            mentorship, teaching, event support, or logistics,
                            your involvement helps create meaningful experiences
                            and lasting impact.
                        </p>

                        {/* VOLUNTEER AREAS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">

                            {volunteerAreas.map((area, index) => {

                                const Icon = area.icon;

                                return (
                                    <div
                                        key={index}
                                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition duration-300"
                                    >

                                        <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4">

                                            <Icon className="w-7 h-7 text-green-600" />

                                        </div>

                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {area.title}
                                        </h4>

                                    </div>
                                );
                            })}

                        </div>

                        {/* CTA BUTTON */}
                        <Link href="/contact#contact-form" className="bg-green-500 hover:bg-green-600 transition duration-300 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:scale-105 inline-flex items-center justify-center text-center">

                            Join as Volunteer

                        </Link>

                    </div>

                </div>

            </div>

        </section>
    );
}