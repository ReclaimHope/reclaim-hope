"use client"
import Image from "next/image";
import {
    Share2,
    Users,
    Mail,
} from "lucide-react";

export default function LeadershipSection() {

    const leaders = [
        {
            id: 1,
            name: "Phillip Mulari",
            role: "Founder",
            image: "/Professional phil.png",
            email: "phillip.mulari@reclaimhoperw.org",
            bio: "Passionate about empowering underserved children through education and community development initiatives.",
        },

        {
            id: 2,
            name: "Cecile Uwumukiza",
            role: "Executive Director",
            image: "/Professional Cecile.jpeg",
            bio: "Focused on mentorship programs, youth empowerment, and creating sustainable community impact.",
            email: "cecile.uwumukiza@reclaimhoperw.org"
        },

        {
            id: 3,
            name: "Benefils Murengezi",
            role: "Office Manager",
            image: "/Professional Benefils.jpeg",
            bio: "Dedicated to strengthening community partnerships and expanding support initiatives across Rwanda.",
            email: "benefils@reclaimhoperw.org"
        },
    ];

    return (
        <section className="w-full bg-[#f9fafb] py-24 px-6 md:px-16">

            <div className="max-w-7xl mx-auto">

                {/* SECTION HEADER */}
                <div className="text-center mb-20">

                    <p className="text-yellow-500 uppercase tracking-[0.3em] font-semibold mb-4">
                        Leadership Team
                    </p>

                    <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
                        Our dedicated team works tirelessly to empower children,
                        strengthen communities, and create lasting positive impact.
                    </p>

                </div>

                {/* TEAM GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                    {leaders.map((leader) => (
                        <div
                            key={leader.id}
                            className="bg-white rounded-[32px] p-10 text-center shadow-sm hover:shadow-2xl transition duration-500 hover:-translate-y-2 border border-gray-100"
                        >

                            {/* IMAGE */}
                            <div className="relative w-40 h-40 mx-auto mb-8">

                                <Image
                                    src={leader.image}
                                    alt={leader.name}
                                    fill
                                    className="object-cover rounded-full border-4 border-yellow-100"
                                />

                            </div>

                            {/* NAME */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {leader.name}
                            </h3>

                            {/* ROLE */}
                            <p className="text-yellow-500 font-semibold mb-6">
                                {leader.role}
                            </p>

                            {/* BIO */}
                            <p className="text-gray-600 leading-relaxed mb-8">
                                {leader.bio}
                            </p>

                            {/* SOCIALS */}

                            <div className="flex rounded-full text-white gap-2 justify-center bg-yellow-500 py-2 cursor-pointer">
                                <Mail className="w-5 h-5 " /> {leader.email}
                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
}