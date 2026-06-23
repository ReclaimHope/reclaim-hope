"use client";

interface MediaCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  "All",
  "Updates",
  "Stories",
  "Testimonials",
  "Newsletters",
  "Gallery",
];

export default function MediaCategories({
  selectedCategory,
  onCategoryChange,
}: MediaCategoriesProps) {
  return (
    <section className="py-10 px-6">

      <div className="flex flex-wrap justify-center gap-4">

        {categories.map((item) => {
          const isActive = selectedCategory === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
              className={`px-6 py-3 rounded-full border transition ${
                isActive
                  ? "border-[#f9d20a] bg-[#f9d20a] text-white hover:bg-[#d6b308] "
                  : "border-gray-300 text-[#f9d20a] hover:bg-[#f9d20a]"
              }`}
            >
              <span className="text-white">{item}</span>
            </button>
          );
        })}

      </div>

    </section>
  );
}