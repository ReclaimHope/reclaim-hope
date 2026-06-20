import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const programs = [
  {
    slug: "lead-after-school-program",
    title: "LEAD / After School Program",
    image: "/Programs 3.JPG",
    category: "Education & Leadership",
    summary:
      "A mentorship and tutoring program that helps children build academic confidence, leadership skills, and a sense of belonging.",
    details: [
      "The LEAD program is designed to support children after school with tailored tutoring, mentorship, and leadership-building activities. Students receive academic support in literacy, numeracy, and critical thinking while they learn how to set goals, work in teams, and speak up for themselves.",
      "Each week, children participate in small-group lessons, creative workshops, and guided mentoring sessions. Our facilitators help students build routines, practice problem solving, and discover their strengths so they can succeed in the classroom and beyond.",
      "LEAD also includes purposeful leadership projects where young people plan community activities, present ideas, and take ownership of positive change. These experiences build resilience, self-esteem, and a lasting commitment to their community.",
    ],
    benefits: [
      "Improved school performance through focused tutoring and homework support.",
      "Personal mentorship from trained volunteers and program staff.",
      "Leadership workshops that nurture confidence and teamwork.",
      "Safe, structured after-school time for learning and growth.",
    ],
    impact:
      "Children in LEAD are more likely to stay in school, engage in class, and envision a brighter future. The program empowers learners to become role models and active contributors in their communities.",
  },
  {
    slug: "healthy-child-program",
    title: "Healthy Child",
    image: "/Programs 4.jpg",
    category: "Nutrition & Wellness",
    summary:
      "A holistic wellness initiative that supplies nutritious meals, health education, and hygiene support to underserved children.",
    details: [
      "Our Healthy Child & Nutrition Program brings nourishing meals to school and community centers while teaching children and families the importance of food, hygiene, and healthy habits. Nutrition is the foundation of learning, growth, and emotional resilience.",
      "The program includes daily meal distribution, health screenings, and nutritious food packs for families. Children receive balanced breakfasts or lunches that support their concentration, energy levels, and physical development.",
      "Program staff work with caregivers to share hygiene practices, cooking tips, and wellness coaching. Children learn about safe water, hand washing, and the foods they need to thrive, while families gain tools to support healthy households.",
    ],
    benefits: [
      "Regular nutritious meals for improved energy and school attendance.",
      "Health monitoring and preventative wellness support.",
      "Nutrition education for children and caregivers.",
      "Stronger family resilience through food security and hygiene awareness.",
      "Health insurance support for children with medical needs, ensuring they can access care when necessary.",
      "Hygiene kits that provide essential supplies to maintain health and prevent illness, especially during school hours.",
      "SHRH education sessions that empower children with knowledge about their bodies, health, and well-being, fostering confidence and informed decision-making as they grow.",
    ],
    impact:
      "By meeting the nutritional and health needs of children, this program reduces absenteeism, supports better learning outcomes, and gives families stability during difficult times.",
  },
  {
    slug: "basic-needs-for-education",
    title: "Basic Needs for Education",
    image: "/Programs 2.JPG",
    category: "School Access",
    summary:
      "Providing the essential supplies and support children need to attend school and keep learning without interruption.",
    details: [
      "This program delivers school uniforms, notebooks, textbooks, school fees, and safe transport so children can attend classes with dignity and confidence. When the basic barriers are removed, students are more likely to stay in school.",
      "We also support families with registration fees, teacher materials, and school supplies that make education accessible. Children receive the tools they need to participate fully in lessons and complete homework assignments.",
      "Beyond materials, the program builds relationships with schools and families to identify students at risk of dropping out, then provides timely intervention so children remain on a positive learning path.",
    ],
    benefits: [
      "School materials and uniforms that remove financial barriers.",
      "Support for registration fees and ongoing educational costs.",
      "Improved attendance and reduced dropout risk.",
      "Stronger school-family partnership for student success.",
    ],
    impact:
      "Children with reliable access to school essentials are better able to learn, feel respected, and prepare for future opportunities.",
  },
  {
    slug: "skills-future-empowerment",
    title: "Skills & Future Empowerment",
    image: "/Programs 7.jpg",
    category: "Vocational & Life Skills",
    summary:
      "Training programs that equip youth with practical skills, digital literacy, and career confidence for tomorrow’s opportunities.",
    details: [
      "This program opens access to vocational workshops, computer skills training, and life skills lessons that help young people prepare for income-generating opportunities. Students learn how to build resumes, communicate effectively, and pursue local work options.",
      "Through hands-on sessions in areas like tailoring, agriculture, entrepreneurship, and technology, youth gain confidence in their abilities. The program also connects participants with mentors who can guide them toward future pathways.",
      "We teach goal-setting, financial awareness, and teamwork so young people can step into adulthood with resilience and hope. The program supports youth as they transition from school into meaningful work and community leadership.",
    ],
    benefits: [
      "Practical vocational training for future employability.",
      "Digital and financial literacy workshops.",
      "Mentorship and career preparation support.",
      "Stronger confidence and independence for youth.",
    ],
    impact:
      "Youth who complete this program are better prepared to pursue education, employment, or entrepreneurship, creating a stronger future for themselves and their communities.",
  },
  {
    slug: "tallent-development",
    title: "Talent Development",
    image: "/Programs 5.JPG",
    category: "Creative & Cultural Development",
    summary:
      "Supporting children’s talents through sports scholarships, traditional dance, singing, art and craft, and storytelling.",
    details: [
      "The Talent Development program gives children access to sports scholarships, performance training, and cultural arts education so they can grow their gifts with confidence.",
      "Participants engage in traditional dance, singing, storytelling, and creative arts workshops led by experienced mentors. These activities build self-expression, teamwork, and cultural pride.",
      "Young people also receive support in art and craft, performance preparation, and scholarship opportunities that help them pursue their passions while staying connected to school and community.",
    ],
    benefits: [
      "Sports scholarship opportunities to nurture athletic talent.",
      "Creative training in traditional dance, singing, and storytelling.",
      "Art and craft workshops that develop fine motor skills and imagination.",
      "Increased confidence, cultural pride, and community engagement.",
    ],
    impact:
      "By investing in talent and cultural expression, this program helps children discover their strengths, stay motivated in school, and become positive role models in their communities.",
  },
];

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = programs.find((item) => item.slug === slug);

  if (!program) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white px-6 md:px-16 py-24">
      <div className="max-w-5xl mx-auto">
        <Link href="/programs" className="text-yellow-500 font-semibold mb-8 inline-block">
          ← Back to Programs
        </Link>

        <section className="grid gap-12 lg:grid-cols-[1.4fr_1fr] items-start">
          <div>
            <p className="text-yellow-500 uppercase tracking-[0.3em] font-semibold mb-4">
              {program.category}
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-8">
              {program.title}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-10">
              {program.summary}
            </p>
            {program.details.map((paragraph, index) => (
              <p key={index} className="text-gray-600 text-lg leading-relaxed mb-8">
                {paragraph}
              </p>
            ))}
            <div className="rounded-[32px] border border-gray-100 bg-gray-50 p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Benefits</h2>
              <ul className="space-y-4 text-gray-700 list-disc list-inside">
                {program.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="overflow-hidden rounded-[32px] shadow-2xl h-[420px] relative">
              <Image
                src={program.image}
                alt={program.title}
                fill
                className="object-cover"
                quality={85}
              />
            </div>

            <div className="rounded-[32px] border border-gray-100 bg-yellow-50 p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Impact Snapshot</h2>
              <p className="text-gray-700 leading-relaxed">{program.impact}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
