import DonateHero from '@/components/DonateHero';
import WhyDonationsMatter from '@/components/WhyDonationsMatter';
import DonationOptions from '@/components/DonationOptions';
import SuggestedAmounts from '@/components/SuggestedAmounts';
import DonationForm from '@/components/DonationForm';
import ImpactTransparency from '@/components/ImpactTransparency';
import DonateTestimonials from '@/components/DonateTestimonials';
import DonateFAQ from '@/components/DonateFAQ';
import DonateFinalCTA from '@/components/DonateFinalCTA';

export default function DonatePage() {
  return (
    <div className="min-h-screen">
      <DonateHero />
      <WhyDonationsMatter />
      {/* <DonationOptions /> */}
      <SuggestedAmounts />
      <DonationForm />
      <ImpactTransparency />
      <DonateTestimonials />
      <DonateFAQ />
      {/* <DonateFinalCTA /> */}
    </div>
  );
}