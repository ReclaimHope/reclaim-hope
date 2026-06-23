export default function ProgramsHero() {
    return (
        <section
            className="relative w-full h-[75vh] bg-cover bg-center flex items-center justify-center px-6 md:px-16 overflow-hidden"
            style={{
                backgroundImage: "url('/Programs 6.jpg')",
            }}
        >

            {/* DECORATIVE GLOW
            <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 blur-3xl rounded-full"></div>

            <div className="absolute bottom-10 right-10 w-72 h-72 bg-green-500/20 blur-3xl rounded-full"></div> */}

            {/* CONTENT */}
            <div className="relative z-10 max-w-4xl text-center text-white">

                {/* SMALL LABEL */}
                <p className="text-yellow-400 uppercase tracking-[0.3em] font-semibold mb-6">
                    Our Programs
                </p>

                {/* TITLE */}
    
                {/* SUBTITLE */}
                <p className="text-lg md:text-2xl text-white/85 leading-relaxed max-w-3xl mx-auto animation-fade-up-delay-2">
                    Supporting children and families through education,
                    nutrition, mentorship, and empowerment initiatives
                    that create brighter futures and stronger communities.
                </p>

            </div>

        </section>
    );
}