import Image from "next/image";
import Link from "next/link";

type ChildCardProps = {
  id: string;
  name: string;
  age: number;
  image: string;
  active?: boolean;
  onSelect?: (id: string) => void;
};

export default function ChildCard({
  id,
  name,
  age,
  image,
  active,
  onSelect,
}: ChildCardProps) {
  return (
    <div
      className={`group bg-white rounded-[32px] overflow-hidden shadow-md border ${
        active ? "border-yellow-500 ring-2 ring-yellow-100" : "border-gray-100"
      } hover:shadow-2xl hover:-translate-y-3 transition duration-500`}
    >
      <div className="relative h-[280px] sm:h-[320px] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain group-hover:scale-105 transition duration-700"
        />
      </div>

      <div className="p-8">
        <h3 className="text-1xl font-bold text-gray-900 mb-3">
          {name}, {age}
        </h3>

        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(id)}
            className="inline-flex items-center justify-center w-full bg-yellow-500 hover:bg-yellow-600 transition duration-300 text-white py-2 rounded-full font-semibold"
          >
            Meet {name}
          </button>
        ) : (
          <Link
            href={`/sponsor/${id}`}
            className="inline-flex items-center justify-center w-full bg-yellow-500 hover:bg-yellow-600 transition duration-300 text-white py-2 rounded-full font-semibold"
          >
            Meet {name}
          </Link>
        )}
      </div>
    </div>
  );
}
