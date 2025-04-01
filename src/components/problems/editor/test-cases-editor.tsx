"use client"

import { useState } from "react"
import { PlusCircle, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface TestCase {
  input: string
  expectedOutput: string
  isPublic: boolean
  description: string
}

interface TestCasesEditorProps {
  value: TestCase[]
  onChange: (value: TestCase[]) => void
}

export function TestCasesEditor({ value, onChange }: TestCasesEditorProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['item-0'])

  const handleAddTestCase = () => {
    const newTestCase: TestCase = {
      input: "",
      expectedOutput: "",
      isPublic: true,
      description: "",
    }
    const newValue = [...value, newTestCase]
    onChange(newValue)

    // Expand the newly added test case
    const newIndex = newValue.length - 1
    setExpandedItems([...expandedItems, `item-${newIndex}`])
  }

  const handleRemoveTestCase = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)

    // Remove the item from expanded items
    setExpandedItems(expandedItems.filter((item) => item !== `item-${index}`))
  }

  const handleTestCaseChange = (index: number, field: keyof TestCase, newValue: string | boolean) => {
    const updatedTestCases = [...value]
    updatedTestCases[index] = {
      ...updatedTestCases[index],
      [field]: newValue,
    }
    onChange(updatedTestCases)
  }

  const handleAccordionChange = (value: string[]) => {
    setExpandedItems(value)
  }

  const moveTestCase = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === value.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newTestCases = [...value]
    const temp = newTestCases[index]
    newTestCases[index] = newTestCases[newIndex]
    newTestCases[newIndex] = temp
    onChange(newTestCases)
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" value={expandedItems} onValueChange={handleAccordionChange} className="space-y-4">
        {value.map((testCase, index) => (
          <Card key={index} className="border">
            <AccordionItem
              value={`item-${index}`}
              className="border-none"
              data-state={expandedItems.includes(`item-${index}`) ? "open" : "closed"}
            >
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="py-0 hover:no-underline">
                    <CardTitle className="text-base">
                      Test Case {index + 1}
                      {testCase.description &&
                        `: ${testCase.description.substring(0, 30)}${testCase.description.length > 30 ? "..." : ""}`}
                    </CardTitle>
                  </AccordionTrigger>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTestCase(index)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove test case</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <AccordionContent>
                <CardContent className="p-4 pt-2">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`test-case-${index}-input`}>Input</Label>
                      <Textarea
                        id={`test-case-${index}-input`}
                        placeholder="Input for this test case"
                        value={testCase.input}
                        onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                        className="min-h-[100px] font-mono"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`test-case-${index}-expected-output`}>Expected Output</Label>
                      <Textarea
                        id={`test-case-${index}-expected-output`}
                        placeholder="Expected output for this test case"
                        value={testCase.expectedOutput}
                        onChange={(e) => handleTestCaseChange(index, "expectedOutput", e.target.value)}
                        className="min-h-[100px] font-mono"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`test-case-${index}-public`}
                        checked={testCase.isPublic}
                        onCheckedChange={(checked) => handleTestCaseChange(index, "isPublic", checked)}
                      />
                      <Label htmlFor={`test-case-${index}-public`} className="flex items-center gap-2">
                        <span>
                          {testCase.isPublic ? "Accept" : "Reject"}
                        </span>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>

      <Button type="button" variant="outline" className="w-full" onClick={handleAddTestCase}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Test Case
      </Button>
    </div>
  )
}

