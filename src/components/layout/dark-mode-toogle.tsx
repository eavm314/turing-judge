"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui/utils";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  const handleChange = () => {
    setTheme((theme) => (theme === "dark" ? "light" : "dark"))
  };
  return (
    <Button onClick={handleChange} variant="ghost"
      className={cn("size-8 rounded-full", theme === "light" && "hover:bg-secondary/20")}
    >
      <Sun size={18} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-secondary hover:text-secondary" />
      <Moon size={18} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
