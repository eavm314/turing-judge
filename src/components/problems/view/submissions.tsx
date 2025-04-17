"use client"

import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type SubmissionItem } from "@/dtos"
import { SubmitSolution } from "./submit-solution"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function Submissions({ problemId }: { problemId: string }) {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
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
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>
      case "WRONG_RESULT":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Wrong Answer</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      default:
        return <Badge variant="outline">{result}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <SubmitSolution />
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium mb-4">Summary</h3>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className={loading ? "animate-spin" : undefined} />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Automaton</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="space-y-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </TableCell>
            </TableRow>
          ) :
            submissions.length === 0 ? (
              <TableRow className="h-14 text-center text-muted-foreground">
                <TableCell colSpan={3}>
                  You haven't submitted any solutions for this problem yet.
                </TableCell>
              </TableRow>
            ) :
              submissions.map((submission, index) => (
                <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>{getStatusBadge(submission)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">FSM</Badge>
                  </TableCell>
                  <TableCell>{formatDate(submission.createdAt)}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}

