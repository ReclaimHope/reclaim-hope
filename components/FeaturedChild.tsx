import Image from "next/image";

export type ChildProfile = {
  id: string;
  name: string;
  age: number;
  dream: string;
  image: string;
  summary: string;
  story: string[];
  goals: string[];
  needs: string[];
  updates: string[];
  sponsorshipImpact: string;
};

type FeaturedChildProps = {
  child: ChildProfile;
};

export default function FeaturedChild({ child }: FeaturedChildProps) {
  return (
    <div className="min-h-screen bg-white px-6 md:px-16 py-24">
      <div className="max-w-6xl mx-auto">
        <section className="grid lg:grid-cols-[1fr_1fr] gap-12">
          <div className="relative h-[550px] rounded-[32px] overflow-hidden shadow-xl">
            <Image
              src={child.image}
              alt={child.name}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-[#f9d20a] uppercase tracking-[0.3em] font-semibold mb-4">
              Child Profile
            </p>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              {child.name}, {child.age}
            </h1>
            <p className="text-2xl text-[#f9d20a] font-semibold mb-6">
              Dreams of Becoming a {child.dream}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {child.summary}
            </p>

            {child.story.map((paragraph, index) => (
              <p
                key={index}
                className="text-gray-600 text-lg leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}

            <button className="bg-[#f9d20a] hover:bg-[#d6b308] cursor-pointer text-white px-8 py-4 rounded-full font-semibold transition">
              Sponsor {child.name}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
