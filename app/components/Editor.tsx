// app/page.tsx
"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { VideoEditor } from "@/components/video-editor"
import { ImageProcessor } from "@/components/image-processor"

export function Editor() {
    return (
        <main className="min-h-screen relative
            bg-gradient-to-br from-background via-background/95 to-muted/30
            dark:from-background dark:via-background/98 dark:to-muted/10
            transition-colors duration-300">
            <ThemeToggle />
            <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 max-w-7xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 lg:mb-12 
                    text-center md:text-left bg-clip-text text-transparent 
                    bg-gradient-to-r from-primary to-primary/70
                    dark:from-primary/90 dark:to-primary/60
                    transition-all duration-300">
                    Media Editor
                </h1>

                <Tabs defaultValue="video" className="w-full">
                    <TabsList className="w-full flex flex-col sm:flex-row mb-6 bg-card/50 backdrop-blur-sm rounded-xl p-1.5">
                        <TabsTrigger value="video">Video Editor</TabsTrigger>
                        <TabsTrigger value="image">Image Processing</TabsTrigger>
                    </TabsList>

                    <TabsContent value="video">
                        <VideoEditor />
                    </TabsContent>

                    <TabsContent value="image">
                        <ImageProcessor />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}
