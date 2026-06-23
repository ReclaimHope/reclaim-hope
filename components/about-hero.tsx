export default function AboutHero() {
    return (
        <section className="relative h-[110vh] flex items-center justify-center">

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/Home 3.jpg')",
                }}
            />

            {/* Content */}
            <div className="relative z-10 text-center text-white px-6">

                <p className="uppercase tracking-[0.3em] text-sm mb-4">
                    About Us
                </p>

                <h1 className="text-4xl md:text-6xl font-bold animate-fade-up">
                    About Reclaim Hope Rwanda
                </h1>

                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl animate-fade-up-delay-2">
                    Empowering children and communities through hope,
                    education, and sustainable support.
                </p>

            </div>
        </section>
    )
}