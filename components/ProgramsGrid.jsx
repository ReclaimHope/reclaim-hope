import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProgramsGrid() {

    const programs = [
        {
            id: 1,
            slug: "basic-needs-for-education",
            title: "Basic Needs for Education",
            image: "/Programs 2.JPG",
            description:
                "Providing school materials, tuition support, uniforms, and educational essentials to help children access quality learning opportunities.",
        },

        {
            id: 2,
            slug: "lead-after-school-program",
            title: "LEAD / After School Program",
            image: "/Programs 3.JPG",
            description:
                "Empowering children through mentorship, tutoring, leadership development, and after-school support activities.",
        },

        {
            id: 3,
            slug: "healthy-child-program",
            title: "Healthy Child Program",
            image: "/Programs 4.jpg",
            description:
                "Supporting child wellness through nutritious meals, health monitoring, hygiene education, and wellness initiatives.",
        },

        {
            id: 4,
            slug: "skills-future-empowerment",
            title: "Skills & Future Empowerment",
            image: "/Programs 7.jpg",
            description:
                "Equipping youth with vocational training, digital literacy, and life skills that prepare them for future opportunities.",
        },
        {
            id: 5,
            slug: "tallent-development",
            title: "Talent Development",
            image: "/Programs 5.JPG",
            description:
                "Supporting our children in sports, traditional dance, singing, art & craft, and storytelling so they keep growing in confidence.",
        },
    ];

    return (
        <section className="w-full bg-[#f9fafb] py-24 px-6 md:px-16">

            <div className="max-w-7xl mx-auto">

                {/* SECTION HEADER */}
                <div className="text-center mb-20">

                    <p className="text-yellow-500 uppercase tracking-[0.3em] font-semibold mb-4">
                        Our Initiatives
                    </p>

                    <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
                        Our programs are designed to address immediate needs
                        while building long-term opportunities for children,
                        families, and communities.
                    </p>

                </div>

                {/* PROGRAMS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {programs.map((program, index) => {
                        const delayClass = index === 0 ? 'animate-stagger-reveal' :
                                          index === 1 ? 'animate-stagger-reveal-delay-1' :
                                          index === 2 ? 'animate-stagger-reveal-delay-2' :
                                          'animate-stagger-reveal-delay-3';
                        return (
                            <div
                                key={program.id}
                                className={`group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition duration-500 hover:-translate-y-2 border border-gray-100 ${delayClass}`}
                            >

                                {/* IMAGE */}
                                <div className="relative overflow-hidden h-[280px]">

                                    <Image
                                        src={program.image}
                                        alt={program.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition duration-700"
                                    />

                                </div>

                                {/* CONTENT */}
                                <div className="p-10">

                                    {/* TITLE */}
                                    <h3 className="text-3xl font-bold text-gray-900 mb-6">
                                        {program.title}
                                </h3>

                                {/* DESCRIPTION */}
                                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                    {program.description}
                                </p>

                                {/* BUTTON */}
                                <Link href={`/programs/${program.slug}`} className="flex items-center gap-3 text-yellow-500 font-semibold hover:gap-4 transition-all">

                                    Learn More

                                    <ArrowRight className="w-5 h-5" />

                                </Link>

                            </div>

                        </div>
                        );
                    })}

                </div>

            </div>

        </section>
    );
}