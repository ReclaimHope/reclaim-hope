export default function GetInvolvedHero() {
    return (
        <section
            className="relative w-full h-[100vh] bg-cover bg-center flex items-center justify-center px-6 md:px-16 overflow-hidden"
            style={{
                backgroundImage: "url('/Get Involved 1.jpg')",
            }}
            data-aos="fade-up"
        >

            {/* CONTENT */}
            <div className="relative z-10 max-w-4xl text-center text-white">

                {/* SMALL LABEL */}
                <p className="text-yellow-400 uppercase tracking-[0.3em] font-semibold mb-6">
                    Get Involved
                </p>

                {/* HEADING */}
                {/* SUBTITLE */}
                <p className="text-lg md:text-2xl text-white/85 leading-relaxed max-w-3xl mx-auto">
                    Your support helps underserved children access education,
                    nutrition, mentorship, and hope for a better future
                    through community-driven initiatives.
                </p>

            </div>

        </section>
    );
}