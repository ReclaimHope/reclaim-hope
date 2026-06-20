export default function ImpactHero() {
    return (
        <section
            className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-center px-6 md:px-16 overflow-hidden"
            style={{
                backgroundImage: "url('/impact 4.jpg')",
            }}
        >

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/65"></div>

            {/* GLOW EFFECTS */}
            <div className="absolute top-10 left-10 w-80 h-80 bg-yellow-500/20 blur-3xl rounded-full"></div>

            <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-500/20 blur-3xl rounded-full"></div>

            {/* CONTENT */}
            <div className="relative z-10 max-w-5xl text-center text-white">

                {/* LABEL */}
                <p className="text-yellow-400 uppercase tracking-[0.3em] font-semibold mb-6">
                    Our Impact
                </p>

                {/* HEADING */}
                {/* SUBTITLE */}
                <p className="text-lg md:text-2xl text-white/85 leading-relaxed max-w-4xl mx-auto">
                    Through education, nutrition, mentorship, and
                    community support, we are helping children build
                    brighter futures and creating meaningful change
                    across Rwanda.
                </p>

            </div>

        </section>
    );
}