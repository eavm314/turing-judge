"use client"

import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type SubmissionItem } from "@/dtos"
import { SubmitSolution } from "./submit-solution"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/ui/utils"

export default function Submissions({ problemId }: { problemId: string }) {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleRefresh()
  }, []);

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/queries/submissions/${problemId}`);
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions, try again later.")
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (stringDate: string) => {
    const date = new Date(stringDate);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  const getStatusBadge = (submission: SubmissionItem) => {
    const result = submission.verdict || submission.status;
    switch (result) {
      case "ACCEPTED":
        return { color: "bg-green-100 text-green-800 hover:bg-green-100", text: 'Accepted' }
      case "WRONG_RESULT":
        return { color: "bg-red-100 text-red-800 hover:bg-red-100", text: 'Wrong Result' }
      case "PENDING":
        return { color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", text: 'Pending' }
      default:
        return { color: "bg-gray-100 text-gray-800 hover:bg-gray-100", text: 'Unknown' }
    }
  }

  return (
    <div className="space-y-6">
      <SubmitSolution />
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium mb-2">Summary</h3>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className={loading ? "animate-spin" : undefined} />
        </Button>
      </div>
      <Table className="md:mx-5">
        <TableHeader>
          <TableRow className="md:text-lg">
            <TableHead className="w-48">Status</TableHead>
            <TableHead className="w-32">Type</TableHead>
            <TableHead className="w-1/2">Message</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions === undefined ? (
            <TableRow>
              <TableCell colSpan={4} className="space-y-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </TableCell>
            </TableRow>
          ) :
            submissions.length === 0 ? (
              <TableRow className="h-14 text-center text-muted-foreground">
                <TableCell colSpan={4}>
                  You haven't submitted any solutions for this problem yet.
                </TableCell>
              </TableRow>
            ) :
              submissions.map((submission, index) => {
                const { color, text } = getStatusBadge(submission);
                return (
                  <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="w-48 text-nowrap"><Badge className={cn("md:text-sm", color)}>{text}</Badge></TableCell>
                    <TableCell className="w-32">
                      <Badge variant="secondary">FSM</Badge>
                    </TableCell>
                    <TableCell width="50%" className="text-base truncate">{submission.message}</TableCell>
                    <TableCell className="text-nowrap">{formatDate(submission.createdAt)}</TableCell>
                  </TableRow>
                )
              })}
        </TableBody>
      </Table>
    </div>
  )
}

