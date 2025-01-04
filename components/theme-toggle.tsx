"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-4 right-4 h-10 w-10 rounded-full shadow-lg 
        bg-background/50 backdrop-blur-sm border-muted-foreground/20
        hover:bg-accent hover:text-accent-foreground
        transition-all duration-300 ease-in-out"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all duration-300
        dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all duration-300
        dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 