import Image from "next/image";
import Link from "next/link";
import { Sparkles, UserCheck } from "lucide-react";

export type ChildCardProps = {
  id: string;
  name: string;
  age: number;
  image: string;
  dream?: string;
  isSponsored?: boolean;
  active?: boolean;
  onSelect?: (id: string) => void;
};

export default function ChildCard({
  id,
  name,
  age,
  image,
  dream,
  isSponsored,
  active,
  onSelect,
}: ChildCardProps) {
  return (
    <div
      className={`group bg-white rounded-[32px] overflow-hidden shadow-sm border transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col justify-between ${
        active
          ? "border-yellow-500 ring-2 ring-yellow-400 shadow-md"
          : "border-gray-100"
      }`}
    >
      <div>
        {/* Child Image Container */}
        <div className="relative h-[280px] sm:h-[300px] overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-2 group-hover:scale-105 transition duration-700"
          />

          {/* Availability Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            {isSponsored ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-gray-900/80 backdrop-blur-md text-white shadow-sm">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                Sponsored
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-yellow-500/90 backdrop-blur-md text-white shadow-sm">
                <Sparkles className="w-3 h-3 text-white" />
                Available
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {name}, {age} yrs
          </h3>

          {dream && (
            <p className="text-xs font-medium text-amber-700 mt-1 line-clamp-1">
              Dreams of becoming a {dream}
            </p>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-0">
        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(id)}
            className={`inline-flex items-center justify-center w-full py-3 rounded-full font-semibold text-sm transition duration-300 cursor-pointer ${
              active
                ? "bg-yellow-500 text-white shadow-md shadow-yellow-500/20"
                : isSponsored
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                : "bg-yellow-50 hover:bg-yellow-500 hover:text-white text-yellow-800 border border-yellow-200 hover:border-yellow-500"
            }`}
          >
            {active ? "Currently Viewing" : `View ${name}'s Story`}
          </button>
        ) : (
          <Link
            href={`/sponsor?child=${id}`}
            className="inline-flex items-center justify-center w-full bg-yellow-500 hover:bg-yellow-600 transition duration-300 text-white py-3 rounded-full font-semibold text-sm shadow-md"
          >
            Meet {name}
          </Link>
        )}
      </div>
    </div>
  );
}
