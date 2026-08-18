import { ContactSection } from "@/components/contact-section";
import { FeatureSection } from "@/components/feature-section";
import { FaqsSection } from "@/components/faqs-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero";
import { PricingSection } from "@/components/pricing-section";
import { TestimonialsSection } from "@/components/testimonials-section";

export default function Home() {
  return (
    <div className="min-h-svh overflow-x-clip bg-background">
      <Header />
      <main id="main-content" className="mx-auto w-full max-w-5xl border-x">
        <HeroSection />
        <FeatureSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
