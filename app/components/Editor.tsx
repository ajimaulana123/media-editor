// app/page.tsx
"use client"

import React from 'react'
import { VideoEditor } from "@/components/video-editor"
import { ImageProcessor } from "@/components/image-processor"
import { ShortURL } from '@/components/short-url'
import { PDFMerger } from './pdf-merger'
import { TextEditor } from './text-editor'
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { 
    Video, 
    Image, 
    Link2, 
    FileText, 
    Type,
    Wand2
} from "lucide-react"
import { TextToImage } from './text-to-image'
import { VideoTranscript } from './video-transcript'

const features = [
    { id: 'video', title: 'Video Editor', component: VideoEditor, icon: <Video className="w-6 h-6" aria-label="Video editor icon" /> },
    { id: 'image', title: 'Image Processing', component: ImageProcessor, icon: <Image className="w-6 h-6" aria-label="Image processor icon" /> },
    { id: 'short-link', title: 'Short Link', component: ShortURL, icon: <Link2 className="w-6 h-6" aria-label="Short link icon" /> },
    { id: 'pdf-merger', title: 'PDF Merger', component: PDFMerger, icon: <FileText className="w-6 h-6" aria-label="PDF merger icon" /> },
    { id: 'text-editor', title: 'Text Editor', component: TextEditor, icon: <Type className="w-6 h-6" aria-label="Text editor icon" /> },
    { id: 'text-to-image', title: 'Text to Image', component: TextToImage, icon: <Wand2 className="w-6 h-6" aria-label="Text to image icon" /> },
    { id: 'transcript', title: 'Video Transcript', component: VideoTranscript, icon: <FileText className="w-6 h-6" aria-label="Video transcript icon" /> },
]

export function Editor() {
    const [activeFeature, setActiveFeature] = React.useState('video')

    const ActiveComponent = features.find(f => f.id === activeFeature)?.component

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

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={`
                                    p-4 cursor-pointer transition-all duration-300
                                    hover:scale-105 hover:shadow-lg
                                    ${activeFeature === feature.id 
                                        ? 'bg-primary/10 border-primary/50' 
                                        : 'hover:bg-muted/50'
                                    }
                                `}
                                onClick={() => setActiveFeature(feature.id)}
                            >
                                <div className="flex flex-col items-center space-y-2 text-center">
                                    {feature.icon}
                                    <span className="text-sm font-medium">{feature.title}</span>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {ActiveComponent && <ActiveComponent />}
                </motion.div>
            </div>
        </main>
    )
}
