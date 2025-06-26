import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Cpu, PlayCircle, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/constants/app';

export default async function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="w-full py-16 md:py-36 bg-accent">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div>
              <h1 className="text-2xl md:text-5xl font-orbitron text-primary">{APP_NAME}</h1>
            </div>
            <h2 className="text-xl tracking-tighter md:text-3xl max-w-[800px]">
              Explore the world of formal languages and automata theory
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/problems">Explore Problems</Link>
              </Button>
              <Button size="lg" asChild>
                <Link href="/playground">
                  Go to Playground <ArrowRight size={22} className="ml-2 mt-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Editor Preview */}
      <section className="w-full py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8">Playground Preview</h2>
          <div className="flex justify-center">
            <Image
              src="/preview.png" // replace with your image path
              alt="Editor preview"
              width={900}
              height={500}
              className="rounded-xl border shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-accent">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-2xl font-bold tracking-tighter md:text-4xl text-center mb-12">
            Main Features
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-3 text-center">
              <Cpu className="h-12 w-12" />
              <h3 className="text-xl font-bold">Intuitive Design</h3>
              <p className="text-accent-foreground">
                Create Finite State Machines, Pushdown Automata, and Turing Machines with our
                user-friendly interface.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <Save className="h-12 w-12" />
              <h3 className="text-xl font-bold">Save and Load</h3>
              <p className="text-accent-foreground">
                Store your automaton designs and load them anytime for further editing or testing.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <PlayCircle className="h-12 w-12" />
              <h3 className="text-xl font-bold">Interactive Testing</h3>
              <p className="text-accent-foreground">
                Run your automatons with custom inputs and visualize the step-by-step execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About the Project */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8">About the Project</h2>
          <div className="max-w-3xl mx-auto text-center space-y-6 text-accent-foreground">
            <p>
              <span className="font-semibold">{APP_NAME}</span> is an educational platform for
              designing, simulating, and evaluating Finite State Machines (FSM), Pushdown Automata
              (PDA), and Turing Machines. It was developed to help students and educators explore
              automata theory interactively through visual tools and automated grading.
            </p>
            <p>
              This project was created by{' '}
              <span className="font-medium">Enrique Adhemar Vicente Minaya</span> <br />
              as part of a university project at{' '}
              <span className="font-medium">Universidad Privada Boliviana</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-20 bg-accent">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tighter md:text-4xl text-center mb-6">
            Ready to test your automata?
          </h2>
          <p className="mb-8 text-lg text-accent-foreground mx-auto">
            Jump into the playground or try solving real-world problems in the virtual judge.
          </p>
          <Button size="lg" asChild>
            <Link href="/playground">
              Start Building <ArrowRight className="ml-2 h-5 w-5 mt-0.5" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
