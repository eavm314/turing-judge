import { Reveal } from '@/components/ui/reveal';
import { ThemedImage } from '@/components/ui/themed-image';

export function PlaygroundPreview() {
  return (
    <section className="w-full px-4 py-16 md:px-6">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-4xl">Playground Preview</h2>
        <Reveal from="zoom" className="relative mx-auto max-w-5xl">
          <div className="absolute inset-x-10 -bottom-6 -z-10 h-24 bg-primary/20 blur-3xl" />
          <div className="rounded-xl border bg-card p-1.5 shadow-2xl shadow-secondary/10">
            <div className="flex h-7 items-center gap-1.5 px-3">
              <span className="size-2.5 rounded-full bg-destructive/60" />
              <span className="size-2.5 rounded-full bg-warning/60" />
              <span className="size-2.5 rounded-full bg-success/60" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                playground — 3-char-palindrome.fsm
              </span>
            </div>
            <ThemedImage
              light="/landing-light.png"
              dark="/landing-dark.png"
              alt="Playground editor preview"
              width={1600}
              height={914}
              className="h-auto w-full rounded-lg"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
