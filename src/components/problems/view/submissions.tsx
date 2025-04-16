"use client"

import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type SubmissionItem } from "@/dtos"
import SubmitSolution from "./submit-solution"
import { Skeleton } from "@/components/ui/skeleton"

export default function Submissions() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleRefresh()
  }, []);

  const handleRefresh = async () => {
    setLoading(true)
    try {
      // const response = await fetch("/api/queries/submissions")
      // const data = await response.json()
      // setSubmissions(data)
      console.log('loading')
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate a delay
      console.log('not loading')
    } catch (error) {
      console.error("Error fetching submissions, try again later.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
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

  return (
    <div className="space-y-6">
      <SubmitSolution />
      <h3 className="text-lg font-medium mb-4">Summary</h3>
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
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
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

