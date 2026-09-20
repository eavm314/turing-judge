import { Reveal } from '@/components/ui/reveal';
import { APP_NAME } from '@/constants/app';

export function About() {
  return (
    <section className="w-full px-4 py-20 md:px-6">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-4xl">About the Project</h2>
        <Reveal className="mx-auto max-w-3xl">
          <div className="space-y-6 rounded-xl border bg-card/50 p-8">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{APP_NAME}</span> is an educational
              platform for designing, simulating, and evaluating Finite State Machines (FSM),
              Pushdown Automata (PDA), and Turing Machines. It was developed to help students and
              educators explore automata theory interactively through visual tools and automated
              grading.
            </p>
            <p className="border-l-2 border-primary/60 pl-5 text-muted-foreground">
              This project was created by{' '}
              <span className="font-medium text-foreground">Enrique Adhemar Vicente Minaya</span>{' '}
              <br />
              as part of a university project at{' '}
              <span className="font-medium text-foreground">Universidad Privada Boliviana</span>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
