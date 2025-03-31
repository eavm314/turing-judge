import Link from "next/link"

import { ArrowRight, Cpu, PlayCircle, Save } from "lucide-react"

import { Button } from "@/components/ui/button"

export default async function HomePage() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Design, Save, and Test Automatons with Ease
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore the world of formal languages and automata theory with our intuitive app for DFAs, pushdown
                automata, and Turing machines.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/editor" className="text-xl py-6">
                Go to Editor <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Main Features</h2>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-3 text-center">
              <Cpu className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Intuitive Design</h3>
              <p className="text-muted-foreground">
                Create DFAs, pushdown automata, and Turing machines with our user-friendly interface.
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
      <section id="cta" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Explore Automata Theory?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start designing and testing your automatons right now.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/editor">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}