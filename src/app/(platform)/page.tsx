import Link from "next/link"

import { ArrowRight, Cpu, PlayCircle, Save } from "lucide-react"

import { Button } from "@/components/ui/button"

export default async function HomePage() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-8 text-center">
            <h1 className="text-2xl font-bold tracking-tighter md:text-5xl max-w-[800px]">
              Explore the world of formal languages and automata theory
            </h1>
            <Button className="text-base md:text-lg h-10" asChild>
              <Link href="/playground">
                Go to Playground <ArrowRight size={22} className="ml-2 mt-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-2xl font-bold tracking-tighter md:text-5xl text-center mb-12">Main Features</h2>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-3 text-center">
              <Cpu className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Intuitive Design</h3>
              <p className="text-muted-foreground">
                Create Finite States Machines, Pushdown Automata, and Turing Machines with our user-friendly interface.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <Save className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Save and Load</h3>
              <p className="text-muted-foreground">
                Store your automaton designs and load them anytime for further editing or testing.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <PlayCircle className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Interactive Testing</h3>
              <p className="text-muted-foreground">
                Run your automatons with custom inputs and visualize the step-by-step execution.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}