import Link from "next/link";
import {
    CheckCircle2,
    GraduationCap,
    HeartPulse,
    Lightbulb,
    Users,
    Rocket,
    Search,
    School,
    ShieldCheck,
    Sparkles,
    HandHeart,
    Heart,
} from "lucide-react";

const RAYS = [
    {
        number: "01",
        title: "Find & enrol",
        icon: Search,
        lead: "We reach the children who need us most, with the people who know them best.",
        points: [
            "Referrals from the district, local leaders and partner schools",
            "Home visit and needs assessment with each family",
            "Enrolment with caregiver consent",
            "A confidential file and support plan for every child",
        ],
    },
    {
        number: "02",
        title: "Back to school",
        icon: School,
        lead: "Poverty is the leading reason children leave school in Rwanda. We remove the cost.",
        points: [
            "School fees paid directly to schools each term",
            "Uniforms, books and supplies",
            "Primary, secondary and TVET students supported",
            "Progress tracked termly with partner schools",
        ],
    },
    {
        number: "03",
        title: "Healthy & safe",
        icon: HeartPulse,
        lead: "A healthy child is a thriving child, in body, mind and spirit.",
        points: [
            "Hot meals at our Learning Centre, with vegetables from our garden",
            "Annual health insurance and regular check-ups",
            "Psychosocial care with trained social workers and Uyisenga Ni Imanzi",
            "Feminine hygiene supplies and health education",
            "A child safeguarding policy every staff member follows",
        ],
    },
    {
        number: "04",
        title: "Learn & lead",
        icon: Lightbulb,
        lead: "Our L.E.A.D. (Life Enhancement & Academic Development) programme is the heart of our Learning Centre.",
        points: [
            "Tutoring and homework support every school day",
            "Life skills: confidence, communication, financial literacy",
            "Traditional dance, music and the arts",
            "Computer Basics training",
        ],
    },
    {
        number: "05",
        title: "Strong families",
        icon: Users,
        lead: "A child's wellbeing is inseparable from their family's stability.",
        points: [
            "Mothers Thrive: parenting, wellbeing and child-rights sessions for caregivers",
            "Vocational and business skills training for parents",
            "Savings and lending groups, including our parent-led Ikibina",
            "An elected Parents Committee that speaks for families",
        ],
    },
    {
        number: "06",
        title: "Launch",
        icon: Rocket,
        lead: "We build the bridge from the classroom to a skill, a degree or a first job.",
        points: [
            "StitchHerFuture: TVET-aligned tailoring from upcycled hotel linens",
            "Higher Education Sponsorship for university students",
            "Structured internships with employer partners",
            "Youth leadership through partners such as UM6P Seed to Lead",
        ],
    },
];

export default function OurModelSection() {
    return (
        <section id="our-model" className="w-full bg-white py-24 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">

                {/* INTRO */}
                <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
                    <p className="text-yellow-500 uppercase tracking-[0.3em] font-semibold mb-4">
                        Our Model
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                        A holistic, Rwandan-led path from vulnerability to self-reliance
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Poverty rarely has a single cause, so a single kind of help rarely
                        ends it. Our model walks with each child and their family through
                        school, health, healing, skills and work, until they can stand on
                        their own.
                    </p>
                </div>

                {/* SUNRISE / SIX RAYS */}
                <div className="rounded-[40px] bg-gradient-to-b from-[#001f3f] to-[#003358] p-8 md:p-14 text-white mb-6" data-aos="fade-up">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-yellow-500 text-[#001f3f] text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-4">
                            Our Model
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold mb-3">
                            Every child deserves a sunrise
                        </h3>
                        <p className="text-white/70">
                            Six rays of support, all around the child, until hope is reclaimed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {RAYS.map((ray) => (
                            <div key={ray.number} className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-[#001f3f] text-sm font-extrabold">
                                        {ray.number}
                                    </span>
                                    <h4 className="text-lg font-bold">{ray.title}</h4>
                                </div>
                                <p className="text-xs leading-relaxed text-white/70">{ray.lead}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 rounded-2xl bg-yellow-500 text-[#001f3f] p-6 text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-1">Hope Reclaimed</p>
                        <p className="text-xl md:text-2xl font-extrabold">
                            Confident, self-reliant young leaders
                        </p>
                    </div>

                    <p className="mt-6 text-center text-sm text-white/70">
                        Built on education. Powered by child sponsors, donors &amp; partners.
                    </p>
                    <p className="mt-2 text-center text-xs text-white/50 uppercase tracking-widest">
                        Rooted in: Family strengthening · Community ownership · Child safeguarding · Rwandan-led since 2022
                    </p>
                </div>

                {/* WHY IT WORKS */}
                <div className="rounded-[40px] bg-[#f9fafb] border border-gray-100 p-8 md:p-14 mb-6" data-aos="fade-up">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
                        Why our model works
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: GraduationCap,
                                title: "The whole child",
                                text: "Education, nutrition, health and emotional healing are delivered together, because a hungry, sick or hurting child cannot learn.",
                            },
                            {
                                icon: HandHeart,
                                title: "The whole family",
                                text: "Caregivers gain parenting support, skills and savings, so the stability a child finds with us continues at home.",
                            },
                            {
                                icon: Sparkles,
                                title: "The whole journey",
                                text: "We stay from the first school day to the first job or university place, not just for one term or one project.",
                            },
                        ].map((item) => (
                            <div key={item.title} className="rounded-3xl bg-white border border-gray-200 p-7 shadow-sm text-center">
                                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">
                                    <item.icon className="size-6" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* STATS */}
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { stat: "2022", text: "Fully Rwandan-led since 2022, serving children in Nyamirambo, Kigali" },
                            { stat: "95%", text: "of enrolled students promoted to the next grade" },
                            { stat: "35,010", text: "plates of food served at our Learning Centre since 2022" },
                            { stat: "2026", text: "Registered as a National NGO by the Rwanda Governance Board" },
                        ].map((item) => (
                            <div key={item.stat} className="rounded-2xl bg-white border border-gray-200 p-5 text-center">
                                <div className="text-3xl font-extrabold text-yellow-500">{item.stat}</div>
                                <p className="mt-1 text-xs text-gray-600 leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* STEP BY STEP */}
                <div className="mb-6" data-aos="fade-up">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <p className="text-yellow-500 uppercase tracking-[0.3em] font-semibold mb-3">
                            Step by Step
                        </p>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            An inside look at the six rays
                        </h3>
                        <p className="text-gray-600">
                            Each step builds on the one before it. Together they turn
                            short-term relief into lasting change for a child and their family.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {RAYS.map((ray) => (
                            <div key={ray.number} className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition">
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-500 text-white text-lg font-extrabold">
                                        {ray.number}
                                    </span>
                                    <div>
                                        <h4 className="text-2xl font-bold text-gray-900">{ray.title}</h4>
                                        <p className="mt-1 text-sm text-gray-600 italic">{ray.lead}</p>
                                    </div>
                                </div>
                                <ul className="space-y-2.5">
                                    {ray.points.map((point) => (
                                        <li key={point} className="flex items-start gap-2.5 text-sm text-gray-700">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* THE SUNRISE */}
                <div className="rounded-[40px] bg-[#001f3f] p-8 md:p-14 text-white mb-6" data-aos="fade-up">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <p className="text-yellow-400 uppercase tracking-[0.3em] font-semibold mb-4">
                                The Sunrise
                            </p>
                            <h3 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                                Hope <span className="text-yellow-400">reclaimed</span>
                            </h3>
                            <p className="text-white/70 text-lg">
                                This is what the sunrise looks like for a young person who
                                grew up with us.
                            </p>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Completes their education",
                                "Healthy, confident and safe",
                                "In further study, skilled work or their own business",
                                "Part of a family that can provide for itself",
                                "Giving back as a leader in their community",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                                    <Heart className="mt-0.5 size-5 shrink-0 text-yellow-400" />
                                    <span className="font-semibold">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ROOTED IN EVERY STEP */}
                <div className="rounded-[40px] bg-[#f9fafb] border border-gray-100 p-8 md:p-14 mb-6" data-aos="fade-up">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
                        Rooted in every step
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Child safeguarding",
                                text: "Every child's safety and dignity come first, with clear reporting and referral pathways.",
                            },
                            {
                                icon: Users,
                                title: "Rwandan leadership",
                                text: "We are Rwandans running programmes for Rwandans, with families as partners, not bystanders.",
                            },
                            {
                                icon: HandHeart,
                                title: "Strong partnerships",
                                text: "Our US partner Hope Shines, plus Radisson Blu Hotel & Kigali Convention Centre, Uyisenga Ni Imanzi, UM6P, local government and schools.",
                            },
                            {
                                icon: CheckCircle2,
                                title: "Transparency",
                                text: "We track every franc and every result, and report openly to families, partners and donors.",
                            },
                        ].map((item) => (
                            <div key={item.title} className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
                                <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">
                                    <item.icon className="size-5" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WHERE WE ARE GOING */}
                <div className="rounded-[40px] border-2 border-yellow-400 bg-yellow-50/50 p-8 md:p-14 mb-6" data-aos="fade-up">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <p className="text-yellow-600 uppercase tracking-[0.3em] font-semibold mb-3">
                            Where We Are Going
                        </p>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            A community center for 100,000 children and youth
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Our vision is a multi-purpose community center with classrooms,
                            a library, a computer lab, a health facility and sports grounds:
                            a resource hub owned by the community it serves, where many more
                            children can find their sunrise.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            "Classrooms & skills workshops",
                            "Library & computer lab",
                            "Health & counselling facility",
                            "Sports & recreation grounds",
                        ].map((item) => (
                            <div key={item} className="rounded-2xl bg-white border border-yellow-200 p-4 text-center text-sm font-semibold text-gray-800">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="rounded-[40px] overflow-hidden relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 p-10 md:p-16 text-center text-[#001f3f]" data-aos="fade-up">
                    <h3 className="text-3xl md:text-4xl font-extrabold mb-3">
                        Help a child see their sunrise
                    </h3>
                    <p className="max-w-xl mx-auto text-[#001f3f]/80 mb-8">
                        For $78 a month, a sponsor covers a child&apos;s school fees, meals,
                        health care and mentoring for a whole year.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/sponsor"
                            className="bg-[#001f3f] hover:bg-[#002a52] text-white px-8 py-3.5 rounded-full font-bold shadow-lg transition hover:scale-105"
                        >
                            Sponsor a child
                        </Link>
                        <Link
                            href="/donate"
                            className="bg-white hover:bg-gray-100 text-[#001f3f] px-8 py-3.5 rounded-full font-bold shadow-lg transition hover:scale-105"
                        >
                            Give once
                        </Link>
                        <Link
                            href="/GetInvolved/partner"
                            className="bg-[#001f3f]/10 hover:bg-[#001f3f]/20 border border-[#001f3f]/30 text-[#001f3f] px-8 py-3.5 rounded-full font-bold transition hover:scale-105"
                        >
                            Partner with us
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
