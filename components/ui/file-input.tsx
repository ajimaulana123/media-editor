"use client"

import * as React from "react"
import { UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  text?: string
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, icon, text, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="file"
          className={cn(
            "w-full min-h-[8rem] opacity-0 absolute inset-0 z-10 cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="w-full min-h-[8rem] border-2 border-dashed rounded-xl 
          border-primary/20 hover:border-primary/40 transition-colors duration-200
          bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center gap-2
          dark:border-primary/10 dark:hover:border-primary/30">
          {icon || <UploadCloud className="h-8 w-8 text-primary/80" />}
          <p className="text-sm font-medium text-muted-foreground">
            {text || "Drop files here or click to browse"}
          </p>
        </div>
      </div>
    )
  }
)
FileInput.displayName = "FileInput"

export { FileInput } 