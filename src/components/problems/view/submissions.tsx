"use client"

import { useEffect, useState } from "react"

import { RefreshCw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type SubmissionItem } from "@/dtos"
import { StatusBadge } from "@/utils/badges"
import { formatDateTime } from "@/utils/date"
import { SubmitSolution } from "./submit-solution"
import { EmptyTableRow, TableHeadButton } from "@/components/ui/my-table"

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

  return (
    <div className="space-y-6">
      <SubmitSolution />
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium mb-2">Summary</h3>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className={loading ? "animate-spin" : undefined} />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="md:text-base">
            <TableHeadButton className="w-48 text-center">Status</TableHeadButton>
            <TableHeadButton className="w-32 text-center">Type</TableHeadButton>
            <TableHeadButton className="w-1/2">Message</TableHeadButton>
            <TableHeadButton>Submitted</TableHeadButton>
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
              <EmptyTableRow colSpan={4} text="You haven't submitted any solutions for this problem yet." />
            ) :
              submissions.map((submission, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="w-48 text-nowrap ml-4 text-center">
                    <StatusBadge verdict={submission.verdict} status={submission.status} />
                  </TableCell>
                  <TableCell className="w-32 text-center">
                    <Badge variant="secondary">FSM</Badge>
                  </TableCell>
                  <TableCell width="50%" className="text-base truncate">{submission.message}</TableCell>
                  <TableCell className="text-nowrap">{formatDateTime(submission.createdAt)}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}

