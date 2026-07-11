import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { SourceMarquee } from "@/components/landing/SourceMarquee";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { ClosingCta, Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="relative">
      <LandingNav />
      <Hero />
      <SourceMarquee />
      <FeatureGrid />
      <ClosingCta />
      <Footer />
    </main>
  );
}