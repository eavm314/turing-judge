"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write")

  return (
    <div className="w-full rounded-md border">
      <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between border-b px-4">
          <TabsList className="h-8 my-1">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="write" className="p-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={"Write your problem statement using Markdown...\nAt least 20 characters."}
            className="min-h-[300px] resize-y border-0 p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </TabsContent>
        <TabsContent value="preview" className="p-0">
          <div className="min-h-[300px] p-4 prose prose-sm prose-headings:my-2 prose-headings:p-0 max-w-none dark:prose-invert">
            {value ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">Nothing to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

