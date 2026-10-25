import ImpactHero from "@/components/ImpactHero"
import ImpactIntroduction from "@/components/ImpactIntroduction"
import ImpactMetrics from "@/components/ImpactMetrics"
import OurModelSection from "@/components/OurModelSection"
import SuccessStories from "@/components/SuccessStories"
import VisualImpactGallery from "@/components/VisualImpactGallery"
import TransparencySection from "@/components/TransparencySection"
import AnnualGrowthSection from "@/components/AnnualGrowthSection"
import ImpactFinalCTA from "@/components/ImpactFinalCTA"
import HelpSection from "@/components/help"

export default function Page(){

    return(
        <div>
            <ImpactHero />
            <ImpactIntroduction/>
            <ImpactMetrics/>
            <OurModelSection />
            <TransparencySection />
            <AnnualGrowthSection />
            <HelpSection/>
        </div>
    )
    
}