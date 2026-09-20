import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { AutomatonMotif } from '@/components/landing/automaton-motif';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/constants/app';

const entrance = 'animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-backwards';

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-20 md:px-6 md:py-32">
      <div className="absolute inset-0 -z-10 bg-dot-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -z-10 left-1/2 top-[-12rem] size-[34rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl animate-pulse-glow motion-reduce:animate-none" />

      <div className="container mx-auto flex flex-col items-center gap-8 text-center">
        <div
          className={`${entrance} inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs tracking-wide`}
        >
          <span className="size-1.5 rounded-full bg-secondary animate-pulse motion-reduce:animate-none" />
          FSM · PDA · Turing Machines
        </div>

        <h1
          className={`${entrance} delay-100 font-orbitron text-4xl sm:text-6xl md:text-7xl tracking-tight bg-gradient-to-br from-primary via-primary to-secondary bg-clip-text text-transparent`}
        >
          {APP_NAME}
        </h1>

        <h2
          className={`${entrance} delay-200 max-w-2xl text-lg text-muted-foreground sm:text-2xl md:text-3xl text-balance`}
        >
          Explore the world of formal languages and automata theory
        </h2>

        <div className={`${entrance} delay-300 flex flex-col md:flex-row gap-4`}>
          <Button size="lg" variant="outline" asChild>
            <Link href="/problems">Explore Problems</Link>
          </Button>
          <Button
            size="lg"
            className="group transition-all duration-300 shadow-[0_0_26px_-8px_hsl(var(--primary)/0.85)] hover:shadow-[0_0_38px_-4px_hsl(var(--primary))]"
            asChild
          >
            <Link href="/playground">
              Go to Playground
              <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <AutomatonMotif className={`${entrance} delay-500 mt-4 opacity-90`} />
      </div>
    </section>
  );
}
