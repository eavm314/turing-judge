import { About } from '@/components/landing/about';
import { CallToAction } from '@/components/landing/cta';
import { Features } from '@/components/landing/features';
import { Hero } from '@/components/landing/hero';
import { PlaygroundPreview } from '@/components/landing/playground-preview';
import { SiteFooter } from '@/components/landing/site-footer';

export default function HomePage() {
  return (
    <>
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <PlaygroundPreview />
        <Features />
        <About />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}
