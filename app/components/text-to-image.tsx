"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Loader2, AlertCircle, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function TextToImage() {
    const [prompt, setPrompt] = useState('')
    const [image, setImage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const generateImage = async () => {
        if (!prompt) return
        setLoading(true)
        setErrorMsg(null)
        
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            })
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const data = await response.json()
            if (!data.success) throw new Error(data.error || 'Failed to generate image')
            
            setImage(data.imageUrl)
        } catch (error) {
            console.error('Error:', error)
            setErrorMsg(error instanceof Error ? error.message : 'Failed to generate image')
            setImage(null)
        } finally {
            setLoading(false)
        }
    }

    const downloadImage = async () => {
        if (!image) return
        try {
            const response = await fetch(image)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `generated-image-${Date.now()}.png`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch {
            setErrorMsg('Failed to download image')
        }
    }

    return (
        <div className="space-y-4">
            <Card className="p-4">
                <Textarea
                    placeholder="Describe the image you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px] mb-4"
                />
                <Button 
                    onClick={generateImage}
                    disabled={loading || !prompt}
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        'Generate Image'
                    )}
                </Button>
            </Card>

            {errorMsg && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
            )}

            {image && (
                <Card className="p-4">
                    <div className="relative w-full aspect-square mb-4">
                        <Image 
                            src={image}
                            alt={`AI generated image for: ${prompt}`}
                            fill
                            className="rounded-lg object-contain"
                            onError={() => setErrorMsg('Failed to load generated image')}
                        />
                    </div>
                    <Button 
                        onClick={downloadImage}
                        className="w-full"
                        variant="outline"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Image
                    </Button>
                </Card>
            )}
        </div>
    )
} 