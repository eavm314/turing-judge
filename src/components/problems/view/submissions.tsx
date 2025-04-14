"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import SubmitSolution from "./submit-solution"
import { Button } from "@/components/ui/button"

// Mock submissions data
const mockSubmissions = [
  {
    id: "1",
    status: "Accepted",
    automaton: "DFA",
    submittedAt: "2023-10-20T14:30:00Z",
  },
  {
    id: "2",
    status: "Wrong Answer",
    automaton: "NFA",
    submittedAt: "2023-10-19T10:15:00Z",
  },
  {
    id: "3",
    status: "Accepted",
    automaton: "DFA",
    submittedAt: "2023-10-18T09:45:00Z",
  },
  {
    id: "4",
    status: "Runtime Error",
    automaton: "FSM",
    submittedAt: "2023-10-17T16:20:00Z",
  },
]

interface SubmissionsProps {
  problemId: string
}

export default function Submissions({ problemId }: SubmissionsProps) {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real application, you would fetch submissions from an API
    // For now, we'll simulate a network request with a timeout
    const timer = setTimeout(() => {
      setSubmissions(mockSubmissions)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [problemId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Accepted":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>
      case "Wrong Answer":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Wrong Answer</Badge>
      case "Runtime Error":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Runtime Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // if (loading) {
  //   return (
  //     <div className="space-y-4">
  //       <Skeleton className="h-10 w-full" />
  //       <Skeleton className="h-24 w-full" />
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-6">
      <SubmitSolution problemId={problemId} />
      <h3 className="text-lg font-medium mb-4">Summary</h3>
      {submissions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          You haven't submitted any solutions for this problem yet.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Automaton</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>{getStatusBadge(submission.status)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{submission.automaton}</Badge>
                </TableCell>
                <TableCell>{formatDate(submission.submittedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

