import ProgramsHero from "@/components/ProgramsHero";
import ProgramsIntroduction from "@/components/ProgramsIntroduction";
import ProgramsGrid from "@/components/ProgramsGrid";
import ProgramImpactHighlights from "@/components/ProgramImpactHighlights";
import GetInvolvedCTA from "@/components/GetInvolvedCTA";
import ImpactSection from "@/components/impact";
import HelpSection from "@/components/help";

export default function Page() {
    return (
        <div>
            <ProgramsHero />
            <ProgramsIntroduction />
            <ProgramsGrid/>
            <HelpSection/>
        </div>
    )
}