import HeroSection from '@/modules/marketing/hero/hero-section';
import TrustLogosSection from '@/modules/marketing/trust/trust-logos-section';
import CoreCapabilitiesSection from '@/modules/marketing/features/core-capabilities-section';
import WorkflowTabsSection from '@/modules/marketing/workflows/workflow-tabs-section';
import DocsSection from '@/modules/marketing/docs/docs-section';
import CaseStudiesSection from '@/modules/marketing/case-studies/case-studies-section';
import PricingPage from '@/modules/marketing/pricing/pricing-page';
import TestimonialsSection from '@/modules/marketing/testimonials/testimonials-section';
import FAQSection from '@/modules/marketing/faq/faq-section';
import FinalCTASection from '@/modules/marketing/cta/final-cta-section';
import FooterSection from '@/modules/marketing/footer/footer-section';

export const metadata = {
  title: 'Codexonx | AI-powered development platform',
  description:
    'Canlı kod editörü, proje sihirbazı ve AI ajanı ile üretim seviyesinde uygulamalar oluşturun.',
};

export default function MarketingHomePage() {
  return (
    <main className="flex flex-col gap-28">
      <HeroSection />
      <TrustLogosSection />
      <CoreCapabilitiesSection />
      <WorkflowTabsSection />
      <DocsSection />
      <CaseStudiesSection />
      <PricingPage />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <FooterSection />
    </main>
  );
}
