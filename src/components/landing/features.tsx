import { Reveal } from '@/components/ui/reveal';
import { LANDING_FEATURES } from '@/constants/landing';

export function Features() {
  return (
    <section id="features" className="w-full px-4 py-12 md:px-6 md:py-24 lg:py-32">
      <div className="container mx-auto">
        <h2 className="mb-12 text-center text-2xl font-bold tracking-tighter md:text-4xl">
          Main Features
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_FEATURES.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 100}>
              <div className="group relative h-full overflow-hidden rounded-xl border bg-card/70 p-6 transition-colors hover:border-primary/60">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,hsl(var(--primary)/0.12),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="grid size-12 place-items-center rounded-lg border border-secondary/40 bg-secondary/10 text-secondary transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
