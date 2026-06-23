import ArticleCard from "./ArticleCard";

const articles = [
  {
    id: 1,
    image: "/LEAD.png",
    category: "Education",
    title: "Education Program Update",
    summary:
      "120 children received school supplies and educational support to begin the new school term confidently.",
    date: "May 12, 2026",
  },
  {
    id: 2,
    image: "/classroom.jpg",
    category: "Campaign",
    title: "Back-to-School Campaign",
    summary:
      "Our annual campaign helped vulnerable children access uniforms, books, and essential learning materials.",
    date: "April 28, 2026",
  },
  {
    id: 3,
    image: "/mentorship.jpg",
    category: "Volunteer",
    title: "Volunteer Day Recap",
    summary:
      "Community volunteers spent the day mentoring children and supporting educational activities.",
    date: "April 10, 2026",
  },
  {
    id: 4,
    image: "/community.jpg",
    category: "Community",
    title: "Community Outreach Event",
    summary:
      "Families gathered for health education, nutrition awareness, and child development workshops.",
    date: "March 25, 2026",
  },
  {
    id: 5,
    image: "/leadership.jpg",
    category: "Leadership",
    title: "Young Leaders Workshop",
    summary:
      "Students participated in leadership development activities focused on confidence and teamwork.",
    date: "March 15, 2026",
  },
  {
    id: 6,
    image: "/healthy.png",
    category: "Nutrition",
    title: "Healthy Child Initiative",
    summary:
      "Over 5,000 nutritious meals were provided through our school feeding program this quarter.",
    date: "March 2, 2026",
  },
];

export default function MediaArticles() {
  return (
    <section className="py-24 px-6 md:px-16 bg-white">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <p className="text-yellow-500 uppercase tracking-[0.3em] font-semibold mb-4">
            Latest Updates
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Stories & Updates
          </h2>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Stay informed about our programs, community activities,
            campaigns, and the impact being made across Rwanda.
          </p>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              image="/logo-transparent.png"
              category={article.category}
              title={article.title}
              summary={article.summary}
              date={article.date}
            />
          ))}

        </div>

      </div>

    </section>
  );
}