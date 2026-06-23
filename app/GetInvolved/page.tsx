import GetInvolvedHero from "@/components/GetInvolvedHero";
import GetInvolvedIntro from "@/components/GetInvolvedIntro";
import WaysToGetInvolved from "@/components/WaysToGetInvolved";
import FaqSection from "@/components/FaqSection";
import HelpSection from "@/components/help";
import TempComponent from "@/components/temp"

export default function Page() {
    return (
        <div className="bg-white">
            <GetInvolvedHero />
            <GetInvolvedIntro />
            <WaysToGetInvolved />
            <FaqSection />
        </div>
    )
}