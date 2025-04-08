"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { problemSchema, type ProblemSchema } from "@/lib/schemas/problem-form"
import { MarkdownEditor } from "./markdown-editor"
import { Textarea } from "@/components/ui/textarea"
import { createProblem } from "@/actions/problems"

export function ProblemForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProblemSchema>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      difficulty: "UNKNOWN",
      statement: "",
      allowFSM: true,
      allowPDA: false,
      allowTM: false,
      allowNonDet: false,
      stateLimit: 10,
      stepLimit: 10,
      timeLimit: 1000,
      testCases: "",
    },
  })

  async function onSubmit(data: ProblemSchema) {
    setIsSubmitting(true)
    console.log(data)

    const result = await createProblem(data);
    if (result) {
      alert("Problem created successfully.")
      router.push("/problems")
    } else {
      alert("Problem not created.")
    }
    setIsSubmitting(false)
  }

  const basicErrors = form.formState.errors.title || form.formState.errors.statement;
  const automatonErrors = form.formState.errors.stateLimit || form.formState.errors.stepLimit || form.formState.errors.timeLimit;
  const testCasesErrors = form.formState.errors.testCases;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">
              Basic Information
              {basicErrors && <span className="ml-1 text-destructive">(errors)</span>}
            </TabsTrigger>
            <TabsTrigger value="settings">
              Automaton Settings
              {automatonErrors && <span className="ml-1 text-destructive">(errors)</span>}
            </TabsTrigger>
            <TabsTrigger value="testcases">
              Test Cases
              {testCasesErrors && <span className="ml-1 text-destructive">(errors)</span>}
            </TabsTrigger>
          </TabsList>

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
                          <SelectItem value="UNKNOWN">Unknown</SelectItem>
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

          {/* Test Cases Tab */}
          <TabsContent value="testcases" className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="testCases"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Cases</FormLabel>
                      <FormDescription>Add test cases to validate solutions against your problem.</FormDescription>
                      <FormControl>
                        <Textarea
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter test cases in format: input,accept|reject,output?"
                          className="min-h-[200px] font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Examples:</h4>
                  <pre className="text-xs">
                    {"FSM/PDA:\n 0101,1\n 1110,0\n\nTM:\n 0011,0\n 0101,1\n 0000,1,1111"}
                  </pre>
                  <p className="text-xs text-muted-foreground mt-2">1 = accept, 0 = reject</p>
                </div>
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

