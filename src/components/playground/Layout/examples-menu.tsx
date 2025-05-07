"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const automatonExamples = [
  { name: "Even Ones", id: "pilw80yiq2vnjy2w1gm8hi5q" },
  { name: 'Ends with "01"', id: "q25bcbnu07apqx6iiv08qhx2" },
  { name: "3-Char Palindrome", id: "h147pt8jj29gpztrpob0oeft" },
  { name: "Divisible by 3", id: "bganvr3nc18rura47zpx46vi" },
  { name: "Simple NFA", id: "x9h6i1odejrjr54mxe79a5n9" },
];

export function ExamplesMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 px-2">
          Examples
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {automatonExamples.map((example) => (
          <Link href={`/playground/${example.id}`} key={example.id} target="_blank">
            <DropdownMenuItem>{example.name}</DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
