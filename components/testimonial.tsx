import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { INITIAL_CHILDREN } from "@/lib/initial-children";
import { getR2ObjectUrl } from "@/lib/r2";

interface TestimonialChild {
  id: string;
  name: string;
  age: number;
  dream: string;
  image: string;
  story: string;
  isSponsored: boolean;
}

// Helper to compute age from ISO string or Date
function calculateAge(dateOfBirth: Date | string): number {
  if (!dateOfBirth) return 0;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return Math.max(0, age);
}

export default async function TestimonialSection() {
  let dbChildren: any[] = [];

  try {
    // Fetch the 3 latest added children from database
    dbChildren = await prisma.child.findMany({
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sponsorships: {
          where: { status: "ACTIVE" },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching latest children from database for testimonial:", error);
  }

  const formattedDbChildren: TestimonialChild[] = Array.isArray(dbChildren)
    ? dbChildren.map((child) => {
        const isSponsored = Boolean(
          child.sponsorships && child.sponsorships.length > 0
        );
        return {
          id: child.id,
          name: `${child.firstName} ${child.lastName}`.trim(),
          age: calculateAge(child.dateOfBirth),
          dream: child.dream,
          image: child.imageUrl ? getR2ObjectUrl(child.imageUrl) : "/mentors_kids.jpg",
          story: child.story,
          isSponsored,
        };
      })
    : [];

  // Fallback to initial children if database has fewer than 3 records
  const fallbackList: TestimonialChild[] = INITIAL_CHILDREN.map((c) => ({
    id: c.id,
    name: `${c.firstName} ${c.lastName}`.trim(),
    age: calculateAge(c.dateOfBirth),
    dream: c.dream,
    image: c.imageUrl || "/mentors_kids.jpg",
    story: c.story,
    isSponsored: false,
  }));

  const remainingSlots = Math.max(0, 3 - formattedDbChildren.length);
  const fallbackItems = fallbackList
    .filter((fallback) => !formattedDbChildren.some((c) => c.id === fallback.id))
    .slice(0, remainingSlots);

  const topChildren: TestimonialChild[] = [...formattedDbChildren, ...fallbackItems].slice(0, 3);

  return (
    <section className="w-full bg-white py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-yellow-500 font-semibold uppercase tracking-widest mb-3">
            Children in Need
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Meet the Children Waiting for Hope
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
            These children are ready for a sponsor and would love to meet you. Click the button to go to the sponsor page and see their full profile.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {topChildren.map((child) => (
            <div
              key={child.id}
              className="rounded-[32px] overflow-hidden shadow-lg border border-gray-100 bg-white flex flex-col hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-72 w-full overflow-hidden bg-gray-100">
                <Image
                  src={child.image}
                  alt={child.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <p
                    className={`uppercase tracking-[0.3em] font-semibold text-xs mb-3 ${
                      child.isSponsored ? "text-emerald-600" : "text-orange-500"
                    }`}
                  >
                    {child.isSponsored ? "Sponsored" : "Needs sponsorship"}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {child.name}, {child.age}
                  </h3>
                  <p className="text-base text-yellow-600 font-medium mb-3">
                    Dreams of becoming {child.dream}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {child.story.length > 150 ? `${child.story.slice(0, 150)}...` : child.story}
                  </p>
                </div>
                <Link
                  href={`/sponsor?child=${child.id}`}
                  className="inline-flex items-center justify-center w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-full font-semibold transition duration-300 shadow-xs"
                >
                  Meet {child.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
