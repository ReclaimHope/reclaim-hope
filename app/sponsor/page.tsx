"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChildGrid, { ChildItem } from "@/components/ChildGrid";
import FeaturedChild, { ChildProfile } from "@/components/FeaturedChild";
import SponsorHero from "@/components/SponsorHero";
import SponsorshipSection from "@/components/SponsorshipSection";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function SponsorPageContent() {
  const searchParams = useSearchParams();
  const queryChildId = searchParams.get("child");
  const featuredRef = useRef<HTMLDivElement>(null);

  const { data: apiChildren, isLoading } = useSWR<any[]>('/api/children', fetcher, {
    revalidateOnFocus: true,
  });

  const childList: ChildItem[] = (apiChildren && apiChildren.length > 0)
    ? apiChildren.map((c: any) => {
        const birthDate = new Date(c.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return {
          id: c.id,
          name: c.name || `${c.firstName} ${c.lastName}`.trim(),
          age: Math.max(0, age),
          dream: c.dream,
          image: c.imageUrl || "/mentors_kids.jpg",
          summary: c.summary,
          story: Array.isArray(c.story) ? c.story : [c.story],
          isSponsored: c.isSponsored ?? (c.sponsorshipStatus === "Sponsored"),
          sponsorName: c.sponsorName,
        };
      })
    : [];

  const [selectedChildStateId, setSelectedChildStateId] = useState<string | null>(null);

  // Sync state if query param or list changes
  useEffect(() => {
    if (queryChildId && childList.some((child) => child.id === queryChildId)) {
      setSelectedChildStateId(queryChildId);
      featuredRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (!selectedChildStateId && childList.length > 0) {
      setSelectedChildStateId(childList[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryChildId, childList]);

  const selectedChild =
    childList.find((child) => child.id === selectedChildStateId) ?? childList[0] ?? null;

  const toChildProfile = (c: ChildItem): ChildProfile => ({
    id: c.id,
    name: c.name ?? "",
    age: c.age ?? 0,
    dream: c.dream ?? "",
    image: c.image ?? "/mentors_kids.jpg",
    summary: c.summary ?? "",
    story: Array.isArray(c.story) ? c.story : [c.story],
    goals: c.goals ?? [],
    needs: c.needs ?? [],
    updates: c.updates ?? [],
    sponsorshipImpact: c.sponsorshipImpact ?? "",
    isSponsored: c.isSponsored,
    sponsorName: c.sponsorName,
  });

  const handleChildSelect = (id: string) => {
    setSelectedChildStateId(id);
    featuredRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SponsorHero />

      {/* Featured Child Detail View */}
      <div ref={featuredRef} className="scroll-mt-10">
        {isLoading ? (
          <div className="py-16 text-center text-gray-500">Loading children...</div>
        ) : selectedChild ? (
          <FeaturedChild child={toChildProfile(selectedChild)} />
        ) : (
          <div className="mx-auto max-w-md px-4 py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900">No children listed yet</h2>
            <p className="mt-2 text-sm text-gray-600">
              There are currently no children available for sponsorship. Please check back soon.
            </p>
          </div>
        )}
      </div>

      {/* Child Browsing Grid */}
      <ChildGrid
        childrenList={childList}
        activeChildId={selectedChild?.id}
        onChildSelect={handleChildSelect}
      />

      <SponsorshipSection />
    </>
  );
}

export default function SponsorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading child sponsorship...</div>}>
      <SponsorPageContent />
    </Suspense>
  );
}
