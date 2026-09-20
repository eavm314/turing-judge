import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';

export function CallToAction() {
  return (
    <section className="w-full px-4 py-24 md:px-6">
      <Reveal className="container mx-auto">
        <div className="relative isolate overflow-hidden rounded-2xl border bg-card px-6 py-16 text-center">
          <div className="absolute inset-0 -z-10 bg-dot-grid opacity-60" />
          <div className="absolute -z-10 left-1/2 top-0 h-64 w-[28rem] max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

          <h2 className="mb-6 text-2xl font-bold tracking-tighter md:text-4xl">
            Ready to test your automata?
          </h2>
          <p className="mx-auto mb-8 text-lg text-muted-foreground">
            Jump into the playground or try solving real-world problems in the virtual judge.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group transition-all duration-300 shadow-[0_0_26px_-8px_hsl(var(--primary)/0.85)] hover:shadow-[0_0_38px_-4px_hsl(var(--primary))]"
              asChild
            >
              <Link href="/playground">
                Start Building
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/docs">Read the documentation</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
