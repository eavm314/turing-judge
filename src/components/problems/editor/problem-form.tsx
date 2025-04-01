"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { TestCasesEditor } from "@/components/problems/editor/test-cases-editor"
import { MarkdownEditor } from "./markdown-editor"

// Define the difficulty enum
const DifficultyEnum = z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"])

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  difficulty: DifficultyEnum,
  statement: z.string().min(10, {
    message: "Problem statement must be at least 10 characters.",
  }),
  isPublic: z.boolean().default(false),
  allowFSM: z.boolean().default(true),
  allowPDA: z.boolean().default(false),
  allowTM: z.boolean().default(false),
  allowNonDet: z.boolean().default(false),
  stateLimit: z.number().int().min(1).default(10),
  stepLimit: z.number().int().min(1).default(100),
  timeLimit: z.number().int().min(1).default(5000),
  solutionAutomaton: z.string().refine(
    (val) => {
      try {
        JSON.parse(val)
        return true
      } catch (e) {
        return false
      }
    },
    {
      message: "Solution must be valid JSON",
    },
  ),
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, { message: "Input cannot be empty" }),
        expectedOutput: z.string().min(1, { message: "Expected output cannot be empty" }),
        isPublic: z.boolean().default(true),
        description: z.string().optional(),
      }),
    )
    .default([]),
})

export function ProblemForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "MEDIUM",
      statement: "",
      isPublic: false,
      allowFSM: true,
      allowPDA: false,
      allowTM: false,
      allowNonDet: false,
      stateLimit: 10,
      stepLimit: 100,
      timeLimit: 5000,
      solutionAutomaton: JSON.stringify({ states: [], transitions: [] }, null, 2),
      testCases: [
        {
          input: "",
          expectedOutput: "",
          isPublic: true,
          description: "",
        },
      ],
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Here you would typically send the data to your API
      console.log(values)

      // Parse the JSON string to an object before sending
      const formattedValues = {
        ...values,
        solutionAutomaton: JSON.parse(values.solutionAutomaton),
        // No need to transform testCases as they're already in the right format
      }

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to problems list or the newly created problem
      router.push("/problems")
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="settings">Automaton Settings</TabsTrigger>
            {/* <TabsTrigger value="solution">Solution</TabsTrigger> */}
            <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter problem title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HARD">Hard</SelectItem>
                          <SelectItem value="EXPERT">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="statement"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Problem Statement</FormLabel>
                      <FormControl>
                        <MarkdownEditor value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormDescription>Write your problem statement using Markdown.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="mt-4 flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Public Problem</FormLabel>
                        <FormDescription>Make this problem visible to all users.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automaton Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="allowFSM"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow FSM</FormLabel>
                          <FormDescription>Allow Finite State Machines</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowPDA"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow PDA</FormLabel>
                          <FormDescription>Allow Pushdown Automata</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowTM"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow TM</FormLabel>
                          <FormDescription>Allow Turing Machines</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowNonDet"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Non-Deterministic</FormLabel>
                          <FormDescription>Allow non-deterministic automata</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="stateLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State Limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormDescription>Maximum number of states allowed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stepLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step Limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormDescription>Maximum number of steps allowed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Limit (ms)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormDescription>Maximum execution time in milliseconds</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Solution Tab */}
          {/* <TabsContent value="solution" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="solutionAutomaton"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solution Automaton</FormLabel>
                      <FormControl>
                        <JsonEditor value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormDescription>Enter the solution automaton as JSON or select from the library</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* Test Cases Tab */}
          <TabsContent value="testcases" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="testCases"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Cases</FormLabel>
                      <FormDescription>Add test cases to validate solutions against your problem.</FormDescription>
                      <FormControl>
                        <TestCasesEditor value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Problem
          </Button>
        </div>
      </form>
    </Form>
  )
}

