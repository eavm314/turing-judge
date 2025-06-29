'use client';

import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { createProblemAction, updateProblemAction } from '@/actions/problems';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { EPSILON } from '@/constants/symbols';
import { useServerAction } from '@/hooks/use-server-action';
import { problemSchema, type ProblemSchema } from '@/lib/schemas/problem-form';
import { useRouter } from 'next/navigation';
import { MarkdownEditor } from './markdown-editor';
import { DifficultyBadge } from '@/utils/badges';
import { ProblemDifficulty } from '@prisma/client';

export function ProblemForm({
  problemId,
  problemData,
}: {
  problemId?: string;
  problemData?: ProblemSchema;
}) {
  const [changeTestCases, setChangeTestCases] = useState(!problemId);
  const router = useRouter();

  const createProblem = useServerAction(createProblemAction);
  const updateProblem = useServerAction(updateProblemAction);

  const form = useForm<ProblemSchema>({
    resolver: zodResolver(problemSchema),
    defaultValues: problemData ?? {
      title: '',
      difficulty: 'UNKNOWN',
      statement: '',
      allowFSM: true,
      allowPDA: false,
      allowTM: false,
      allowNonDet: false,
      stateLimit: 10,
      depthLimit: 10,
      maxStepLimit: 100,
      testCases: '',
    },
  });

  const isDirtyRef = useRef(form.formState.isDirty);
  useEffect(() => {
    isDirtyRef.current = form.formState.isDirty;
  }, [form.formState.isDirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const newChanges = !problemId || form.formState.isDirty || changeTestCases;

  async function onSubmit(data: ProblemSchema) {
    if (problemId) {
      const testCases = changeTestCases ? data.testCases : undefined;
      await updateProblem.execute({ ...data, testCases, problemId });
    } else {
      await createProblem.execute(data);
    }
    router.push('/problems/editor');
  }

  const isSubmitting = createProblem.loading || updateProblem.loading;

  const basicErrors = form.formState.errors.title || form.formState.errors.statement;
  const automatonErrors =
    form.formState.errors.stateLimit ||
    form.formState.errors.depthLimit ||
    form.formState.errors.maxStepLimit;
  const testCasesErrors = form.formState.errors.testCases;

  const onInvalidForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalidForm)} className="space-y-8">
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-3">
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
                      <FormItem >
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(ProblemDifficulty).map(diff => (
                              <SelectItem key={diff} value={diff}>
                                <DifficultyBadge difficulty={diff} />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="statement"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Problem Statement</FormLabel>
                      <FormDescription>
                        Write your problem statement using Markdown.
                      </FormDescription>
                      <FormControl>
                        <MarkdownEditor value={field.value} onChange={field.onChange} />
                      </FormControl>
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
                          <Switch disabled checked={field.value} onCheckedChange={field.onChange} />
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
                          <Input type="number" {...field} onChange={field.onChange} />
                        </FormControl>
                        <FormDescription>Maximum number of states allowed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="depthLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depth Limit</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} onChange={field.onChange} />
                        </FormControl>
                        <FormDescription>
                          Maximum depth explored per test case before backtracking
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxStepLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Step Limit</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} onChange={field.onChange} />
                        </FormControl>
                        <FormDescription>Maximum accumulated steps per test case</FormDescription>
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
                {problemId && (
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Modify Test Cases</FormLabel>
                      <FormDescription>
                        Enabling this will replace all the existing test cases with the new ones.
                      </FormDescription>
                    </div>
                    <div>
                      <Switch checked={changeTestCases} onCheckedChange={setChangeTestCases} />
                    </div>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="testCases"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Cases</FormLabel>
                      <FormDescription className="font-mono text-sm">
                        Enter test cases in format: input,accept|reject,output? (One per line)
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          disabled={!changeTestCases}
                          value={field.value}
                          onChange={field.onChange}
                          className="min-h-[200px] font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2 text-neutral-foreground">Examples:</h4>
                  <div className="flex divide-x-2">
                    <pre className="text-sm pr-10">{`FSM/PDA:\n - 0101,1\n - abab,0\n - ,1 \t(${EPSILON} input)`}</pre>
                    <pre className="text-sm pl-10">
                      {'TM:\n - 0011,0\n - 0101,1\n - aaaa,1,bbbb'}
                    </pre>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 font-mono">1 = accept, 0 = reject</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !newChanges}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {problemId ? 'Save' : 'Create'} Problem
          </Button>
        </div>
      </form>
    </Form>
  );
}
