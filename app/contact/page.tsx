import ContactHero from "@/components/ContactHero";
import ContactIntroduction from "@/components/ContactIntroduction";
import ContactInformation from "@/components/ContactInformation";
import ContactForm from "@/components/ContactForm";
import MapLocation from "@/components/MapLocation";
import FAQSupport from "@/components/FAQSupport";
import FinalCTASection from "@/components/cta";
import HelpSection from "@/components/help";

export default function ContactPage() {
  return (
    <div>
      <ContactHero />
      <ContactIntroduction />
      <ContactInformation />
      <ContactForm />
      <MapLocation />
      <FAQSupport />
      <HelpSection/>
    </div>
  );
}