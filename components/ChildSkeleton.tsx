export default function ChildSkeleton() {
  return (
    <div className="group bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 transition-all duration-500 flex flex-col justify-between">
      <div>
        {/* Skeleton Image Container */}
        <div className="relative h-[280px] sm:h-[300px] overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="absolute inset-0 bg-[length:200%_100%] animate-[shimmer_2s_infinite] bg-gray-200" />
        </div>

        {/* Availability Status Badge Skeleton */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-yellow-500/90 backdrop-blur-md text-white shadow-sm">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
            Available
          </span>
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        <p className="text-xs font-medium text-amber-700 mt-1 line-clamp-1 h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
      </div>

      {/* Button Skeleton */}
      <div className="px-6 pb-6 pt-0">
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center w-full py-3 rounded-full font-semibold text-sm transition duration-300 cursor-not-allowed bg-yellow-50 hover:bg-yellow-500 text-yellow-800 border border-yellow-200 animate-pulse"
        >
          <span className="sr-only">View child's story</span>
        </button>
      </div>
    </div>
  );
}
