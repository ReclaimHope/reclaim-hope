'use client'

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Heart, ShieldAlert, Sparkles, UserCheck } from "lucide-react";
import SponsorshipModal from "./SponsorshipModal";

export type ChildProfile = {
  id: string;
  name: string;
  age: number;
  dream: string;
  image: string;
  story: string[];
  goals?: string[];
  needs?: string[];
  updates?: string[];
  sponsorshipImpact?: string;
  isSponsored?: boolean;
  sponsorName?: string | null;
};

type FeaturedChildProps = {
  child: ChildProfile;
};

export default function FeaturedChild({ child }: FeaturedChildProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-white px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <section className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
            {/* Child Photo Container */}
            <div className="relative h-[480px] sm:h-[550px] rounded-[32px] overflow-hidden shadow-2xl bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-100">
              <Image
                src={child.image}
                alt={child.name}
                fill
                className="object-contain p-2"
                priority
              />

              {/* Status Badge overlay */}
              <div className="absolute top-6 left-6 z-10">
                {child.isSponsored ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-900/85 backdrop-blur-md text-white text-sm font-semibold shadow-lg">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    Currently Sponsored
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-sm font-semibold shadow-lg">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    Available for Sponsorship
                  </span>
                )}
              </div>
            </div>

            {/* Child Details */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <p className="text-[#e6b800] uppercase tracking-[0.3em] font-bold text-sm">
                  Child Profile
                </p>
                {child.isSponsored ? (
                  <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                    Active Sponsor Linked
                  </span>
                ) : (
                  <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-medium">
                    Awaiting Sponsor
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
                {child.name}, {child.age} yrs
              </h1>

              <div className="inline-block bg-yellow-50 border border-yellow-200 px-4 py-1.5 rounded-full mb-6">
                <p className="text-lg text-yellow-800 font-semibold flex items-center gap-2">
                  <span>✨</span> Dreams of Becoming a {child.dream}
                </p>
              </div>

              {child.story.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-gray-600 text-base leading-relaxed mb-6"
                >
                  {paragraph}
                </p>
              ))}

              {/* Sponsorship Action Card */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                {child.isSponsored ? (
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">
                          {child.name} has an active sponsor
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          In accordance with our 1-to-1 sponsorship model, each child has one active sponsor. You can explore other wonderful children below who are waiting for support!
                        </p>
                      </div>
                    </div>
                    <button
                      disabled
                      className="mt-4 w-full bg-gray-200 text-gray-500 py-3.5 rounded-full font-semibold cursor-not-allowed text-center text-sm"
                    >
                      Currently Sponsored
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          $78/month or $936/year
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          100,000 RWF/month or 1.2M RWF/year
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          100% direct impact
                        </span>
                      </div>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-yellow-500 hover:bg-yellow-600 active:scale-95 cursor-pointer text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-yellow-500/25 transition duration-300 inline-flex items-center gap-2"
                    >
                      <Heart className="w-5 h-5 fill-white" />
                      Sponsor {child.name}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sponsorship Checkout Modal */}
      <SponsorshipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        child={{
          id: child.id,
          name: child.name,
          age: child.age,
          dream: child.dream,
          image: child.image,
          isSponsored: child.isSponsored,
        }}
      />
    </>
  );
}
