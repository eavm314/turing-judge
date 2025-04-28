"use client"

import { useParams } from 'next/navigation'

import { PlusCircle } from 'lucide-react'

import { submitSolution } from '@/actions/submissions'
import { useSolutionForm } from '@/components/modal/solution-form'
import { Button } from '@/components/ui/button'
import { type AutomatonCode } from '@/dtos'
import { useToast } from '@/hooks/use-toast'

export const SubmitSolutionButton = () => {
  const getSolutionData = useSolutionForm();
  const { problemId } = useParams();
  const { toast } = useToast();

  const handleClick = async () => {
    const solution = await getSolutionData();
    if (!solution) return;

    const automatonCode = solution.automatonCode ?
      JSON.parse(solution.automatonCode) as AutomatonCode : null;

    await submitSolution(problemId as string, solution.selectedProject, automatonCode);
    toast({
      title: 'Solution submitted successfully!',
      variant: 'success',
    });
  }

  return (
    <Button onClick={handleClick}>
      <PlusCircle size={20} />
      Submit Solution
    </Button>
  )
}
