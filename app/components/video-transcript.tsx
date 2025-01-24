"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, AlertCircle, Copy, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface TranscriptItem {
    text: string
    start: string
    duration: number
    offset: number
}

export function VideoTranscript() {
    const [url, setUrl] = useState('')
    const [transcript, setTranscript] = useState<TranscriptItem[]>([])
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [showTimestamps, setShowTimestamps] = useState(true)

    const getTranscript = async () => {
        if (!url) return
        setLoading(true)
        setErrorMsg(null)
        
        try {
            const response = await fetch('/api/get-transcript', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoUrl: url }),
            })
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const data = await response.json()
            if (!data.success) throw new Error(data.error || 'Failed to get transcript')
            
            setTranscript(data.transcript)
        } catch (error) {
            console.error('Error:', error)
            setErrorMsg(error instanceof Error ? error.message : 'Failed to get transcript')
            setTranscript([])
        } finally {
            setLoading(false)
        }
    }

    const copyTranscript = () => {
        const text = transcript
            .map(item => showTimestamps ? `[${item.start}] ${item.text}` : item.text)
            .join('\n')
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="space-y-4">
            <Card className="p-4">
                <div className="flex gap-4 mb-4">
                    <Input
                        placeholder="Enter YouTube video URL..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1"
                    />
                    <Button 
                        onClick={getTranscript}
                        disabled={loading || !url}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Get Transcript'
                        )}
                    </Button>
                </div>

                {errorMsg && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errorMsg}</AlertDescription>
                    </Alert>
                )}

                {transcript.length > 0 && (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="timestamps"
                                    checked={showTimestamps}
                                    onCheckedChange={setShowTimestamps}
                                />
                                <Label htmlFor="timestamps">Show Timestamps</Label>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={copyTranscript}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Text
                            </Button>
                        </div>
                        <ScrollArea className="h-[400px] rounded-md border p-4">
                            {transcript.map((item, index) => (
                                <div key={index} className="mb-4">
                                    {showTimestamps && (
                                        <div className="text-sm text-muted-foreground flex items-center">
                                            <Clock className="mr-1 h-4 w-4" />
                                            {item.start}
                                        </div>
                                    )}
                                    <div className={showTimestamps ? "mt-1" : ""}>
                                        {item.text}
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    </>
                )}
            </Card>
        </div>
    )
} 