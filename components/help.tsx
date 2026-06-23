import {
    HeartHandshake,
    HandCoins,
    Users,
    Building2,
    ShoppingBasket,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function HelpSection() {

    const involvementOptions = [
        {
            id: 1,
            title: "Sponsor a Child",
            description:
                "Help provide education, nutrition, and emotional support for underserved children.",
            button: "Become a Sponsor",
            icon: HeartHandshake,
            color: "green",
        },

        {
            id: 2,
            title: "Donate",
            description:
                "Support our programs through one-time or monthly contributions that transform lives.",
            button: "Donate Now",
            icon: HandCoins,
            color: "yellow",
        },

        {
            id: 3,
            title: "Partner / volunteer",
            description:
                "Share your skills, time, and passion with our community initiatives and mentorship programs.",
            button: "Get involved",
            icon: Users,
            color: "blue",
        },

        {
            id: 4,
            title: "Shop",
            description:
                "Support children through buying products and handcrafts made by their parents",
            button: "Shop now",
            icon: ShoppingBasket,
            color: "blue",
        },
    ];

    const colorClasses = {
        yellow: {
            bg: "bg-yellow-100",
            text: "text-[#f9d20a]",
            button: "bg-[#f9d20a] hover:bg-[#e6c209]",
        },

        green: {
            bg: "bg-green-100",
            text: "text-green-600",
            button: "bg-[#20603e] hover:bg-[#1a4d2f]",
        },

        blue: {
            bg: "bg-blue-100",
            text: "text-blue-600",
            button: "hover:bg-[#002b5b] bg-[#001f3f]",
        }
    };

    const buttonClasses =
        "text-white px-6 py-4 rounded-full font-semibold flex items-center justify-center gap-3 transition duration-300 hover:scale-105 whitespace-nowrap";

    return (
        <section className="w-full bg-[#f9fafb] py-24 px-6 md:px-16">

            <div className="max-w-7xl mx-auto">

                {/* SECTION HEADER */}
                <div className="text-center mb-20">

                    <p className="text-yellow-500 uppercase tracking-[0.3em] font-semibold mb-4">
                        Ways to Get Involved
                    </p>

                    <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
                        Every contribution matters. Whether through sponsorship,
                        donations, volunteering, or partnerships, your support
                        helps transform lives and strengthen communities.
                    </p>

                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

                    {involvementOptions.map((item) => {

                        const Icon = item.icon;

                        const colors = colorClasses[item.color as keyof typeof colorClasses];

                        return (
                            <div
                                key={item.id}
                                className="group bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition duration-500 flex flex-col"
                                data-aos="fade-up"
                                data-aos-delay={item.id * 100}
                            >

                                {/* ICON */}
                                <div
                                    className={`w-20 h-20 rounded-2xl ${colors.bg} flex items-center justify-center mb-8`}
                                >

                                    <Icon className={`w-10 h-10 ${colors.text}`} />

                                </div>

                                {/* TITLE */}
                                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                                    {item.title}
                                </h3>

                                {/* DESCRIPTION */}
                                <p className="text-gray-600 leading-relaxed mb-10 flex-grow">
                                    {item.description}
                                </p>

                                {/* BUTTON */}
                                {item.id === 2 ? (
                                    <Link
                                        href="/donate"
                                        className={`${colors.button} ${buttonClasses}`}
                                    >
                                        {item.button}
                                    </Link>
                                ) : item.id === 1 ? (
                                    <Link
                                        href="/sponsor"
                                        className={`${colors.button} ${buttonClasses}`}
                                    >
                                        {item.button}
                                    </Link>
                                ) : item.id === 3 ? (
                                    <Link
                                        href="/GetInvolved"
                                        className={`${colors.button} ${buttonClasses}`}
                                    >
                                        {item.button}
                                    </Link>
                                ) :
                                    (
                                        <Link
                                            href="/shop"
                                            className={`${colors.button} ${buttonClasses}`}
                                        >
                                            {item.button}
                                        </Link>
                                    )}

                            </div>
                        );
                    })}

                </div>

            </div>

        </section>
    );
}