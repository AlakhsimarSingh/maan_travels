import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutWhy from "@/components/about/AboutWhy";
import CTASection from "@/components/home/CTASection";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutStory />
      <AboutWhy />
      <CTASection />
    </main>
  );
}