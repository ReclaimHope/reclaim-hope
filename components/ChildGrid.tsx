'use client'

import { useState } from "react";
import ChildCard from "./ChildCard";
import { Heart, Sparkles, UserCheck } from "lucide-react";

export interface ChildItem {
  id: string;
  name: string;
  age: number;
  dream: string;
  image: string;
  story: string | string[];
  isSponsored?: boolean;
  sponsorName?: string | null;
  support?: string;
  goals?: string[];
  needs?: string[];
  updates?: string[];
  sponsorshipImpact?: string;
}

type ChildGridProps = {
  childrenList?: ChildItem[];
  onChildSelect?: (id: string) => void;
  activeChildId?: string;
};

export default function ChildGrid({
  childrenList = [],
  onChildSelect,
  activeChildId,
}: ChildGridProps) {
  const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'SPONSORED'>('ALL');

  const filteredChildren = childrenList.filter((child) => {
    if (filter === 'AVAILABLE') return !child.isSponsored;
    if (filter === 'SPONSORED') return child.isSponsored;
    return true;
  });

  const availableCount = childrenList.filter((c) => !c.isSponsored).length;
  const sponsoredCount = childrenList.filter((c) => c.isSponsored).length;

  return (
    <section id="browse-children" className="w-full bg-[#f9fafb] py-24 px-6 md:px-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-yellow-600 uppercase tracking-[0.3em] font-bold text-sm mb-3">
            Browse Children
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Meet the Children Waiting for Hope
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a child to read their full story and start a life-changing sponsorship today.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Children ({childrenList.length})
            </button>
            <button
              onClick={() => setFilter('AVAILABLE')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                filter === 'AVAILABLE'
                  ? 'bg-yellow-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Available for Sponsorship ({availableCount})
            </button>
            <button
              onClick={() => setFilter('SPONSORED')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                filter === 'SPONSORED'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Sponsored ({sponsoredCount})
            </button>
          </div>
        </div>

        {/* Children Grid */}
        {childrenList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 max-w-md mx-auto p-8">
            <Heart className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No children available yet</h3>
            <p className="text-sm text-gray-600">
              There are currently no children listed for sponsorship. Please check back soon.
            </p>
          </div>
        ) : filteredChildren.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 max-w-md mx-auto p-8">
            <Heart className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No children found</h3>
            <p className="text-sm text-gray-600">
              No children match the selected filter. Try selecting &quot;All Children&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredChildren.map((child) => (
              <ChildCard
                key={child.id}
                id={child.id}
                name={child.name}
                age={child.age}
                image={child.image}
                dream={child.dream}
                isSponsored={child.isSponsored}
                active={activeChildId === child.id}
                onSelect={onChildSelect}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
