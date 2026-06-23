import {
    Mail,
    Phone,
    MapPin,
    ArrowRight,
} from "lucide-react";
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaYoutube,
    FaXTwitter
} from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="w-full bg-[#001f3f] text-white px-6 md:px-16 pt-24 pb-10">

            <div className="max-w-7xl mx-auto">

                {/* TOP GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 pb-16 border-b border-white/10">

                    {/* BRAND */}
                    <div>

                        {/* LOGO */}
                        <div className="flex items-center gap-3 mb-6">

                            <div className="w-35 h-23 rounded-[50%] bg-white flex items-center justify-center p-2">
                                <img
                                    src="/logo-transparent.png"
                                    alt="Logo"
                                    className="object-contain rounded-md"
                                />
                            </div>

                            <h2 className="text-2xl font-bold">
                                Reclaim Hope Rwanda
                            </h2>

                        </div>

                        {/* DESCRIPTION */}
                        <p className="text-white/70 leading-relaxed mb-8">
                            Empowering underserved children and communities
                            through education, mentorship, nutrition,
                            and sustainable support programs.
                        </p>

                        {/* SOCIALS */}
                        <div className="flex items-center gap-4">
                            <a
                                href="Facebook: https://www.facebook.com/profile.php?id=61589336073208"
                                className="w-10 h-10 rounded-full bg-white/10 hover:text-[#11a0db] hover:bg-white transition flex items-center justify-center"
                            >
                                <FaFacebook className="w-5 h-5" />
                            </a>

                            <a
                                href="Instagram:https://www.instagram.com/reclaimhoperwanda/"
                                className="w-10 h-10 rounded-full bg-white/10 hover:text-[#11a0db] hover:bg-white transition flex items-center justify-center"
                            >
                                <FaInstagram className="w-5 h-5" />
                            </a>

                            {/* <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white/10 hover:text-[#11a0db] hover:bg-white transition flex items-center justify-center"
                            >
                                <FaLinkedin className="w-5 h-5" />
                            </a> */}

                            {/* <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white/10 hover:text-[#11a0db] hover:bg-white transition flex items-center justify-center"
                            >
                                <FaYoutube className="w-5 h-5" />
                            </a> */}

                            <a
                                href="https://substack.com/@reclaimhope?utm_source=global-search"
                                className="w-10 h-10 rounded-full bg-white/10 hover:text-[#11a0db] hover:bg-white transition flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-substack" viewBox="0 0 16 16">
                                    <path d="M15 3.604H1v1.891h14v-1.89ZM1 7.208V16l7-3.926L15 16V7.208zM15 0H1v1.89h14z" />
                                </svg>
                            </a>
                        </div>

                    </div>

                    {/* QUICK LINKS */}
                    <div>

                        <h3 className="text-xl font-semibold mb-6">
                            Quick Links
                        </h3>
                        <ul className="space-y-4 text-white/70">

                            <li>
                                <a href="/" className="hover:text-yellow-400 transition">
                                    Home
                                </a>
                            </li>

                            <li>
                                <a href="/about" className="hover:text-yellow-400 transition">
                                    About Us
                                </a>
                            </li>

                            <li>
                                <a href="/programs" className="hover:text-yellow-400 transition">
                                    Programs
                                </a>
                            </li>

                            <li>
                                <a href="/sponsor" className="hover:text-yellow-400 transition">
                                    Sponsor a Child
                                </a>
                            </li>

                            <li>
                                <a href="/contact" className="hover:text-yellow-400 transition">
                                    Contact
                                </a>
                            </li>

                        </ul>

                    </div>

                    {/* PROGRAMS */}
                    <div>

                        <h3 className="text-xl font-semibold mb-6">
                            Our Programs
                        </h3>

                        <ul className="space-y-4 text-white/70">

                            <li>Education Support</li>
                            <li>Mentorship Programs</li>
                            <li>Nutrition Support</li>
                            <li>Community Outreach</li>
                            <li>Youth Empowerment</li>

                        </ul>

                    </div>

                    {/* CONTACT */}
                    <div>

                        <h3 className="text-xl font-semibold mb-6">
                            Contact Us
                        </h3>

                        <div className="space-y-5 text-white/70">

                            <div className="flex items-start gap-4">

                                <MapPin className="w-5 h-5 text-yellow-400 mt-1" />

                                <p>
                                    Kigali, Rwanda
                                </p>

                            </div>

                            <div className="flex items-center gap-4">

                                <Mail className="w-5 h-5 text-yellow-400" />

                                <p>
                                    info@reclaimhoperw.org
                                </p>

                            </div>

                            <div className="flex items-center gap-4">

                                <Phone className="w-5 h-5 text-yellow-400" />

                                <p>
                                    +250 727 589 358
                                </p>

                            </div>

                        </div>


                    </div>

                </div>

                {/* BOTTOM BAR */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/50 text-sm">

                    <p>
                        © 2026 Reclaim Hope Rwanda. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">

                        <a href="#" className="hover:text-yellow-400 transition">
                            Privacy Policy
                        </a>

                        <a href="#" className="hover:text-yellow-400 transition">
                            Terms & Conditions
                        </a>

                    </div>

                </div>

            </div>

        </footer>
    );
}