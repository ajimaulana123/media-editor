import React from 'react'
import { cn } from "@/lib/utils"
import { FileIcon } from 'lucide-react'

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode
    text?: string
}

export function FileInput({ 
    className, 
    icon = <FileIcon className="h-8 w-8 text-primary/80" />,
    text = "Drop file here or click to browse",
    ...props 
}: FileInputProps) {
    return (
        <div className="relative">
            <input
                type="file"
                className={cn(
                    "w-full min-h-[160px] rounded-lg border border-dashed px-3 py-8 text-sm",
                    "relative cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors",
                    "file:hidden",
                    className
                )}
                {...props}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {icon}
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
        </div>
    )
} 