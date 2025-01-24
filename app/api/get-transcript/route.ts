import { NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'
import { z } from 'zod'
import { formatCurrency } from '@/lib/utils/currency'

interface TranscriptResponse {
    text: string;
    duration: number;
    offset?: number;
    start?: number;
}

// Validation Schemas
const requestSchema = z.object({
    videoUrl: z.string().url('Invalid URL format'),
    formatCurrency: z.boolean().optional().default(true),
    targetCurrency: z.enum(['USD', 'IDR']).optional().default('IDR')
})

const transcriptItemSchema = z.object({
    text: z.string(),
    start: z.string(),
    duration: z.number(),
    offset: z.number(),
    originalText: z.string().optional()
})

const responseSchema = z.object({
    success: z.boolean(),
    transcript: z.array(transcriptItemSchema).optional(),
    videoId: z.string().optional(),
    error: z.string().optional(),
    details: z.string().optional(),
    metadata: z.object({
        processedAt: z.string(),
        currencyFormatted: z.boolean(),
        targetCurrency: z.string()
    }).optional()
})

// Currency detection patterns
const currencyPatterns = {
    USD: /\$\s*(\d+(?:[,.]\d+)?)/g,
    IDR: /Rp\.?\s*(\d+(?:[,.]\d+)?)/g,
    numbers: /(\d+(?:[,.]\d+)?)\s*(?:ribu|juta|miliar|triliun)/g
} as const

// Utility functions
function extractVideoId(url: string): string {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    
    if (!match || match[7].length !== 11) {
        throw new Error('Invalid YouTube URL')
    }
    
    return match[7]
}

function formatTime(seconds: number): string {
    try {
        if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
            return '00:00'
        }

        const minutes = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)

        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } catch (error) {
        console.error('Error formatting time:', error)
        return '00:00'
    }
}

function detectAndFormatCurrency(text: string, targetCurrency: 'USD' | 'IDR'): { 
    formattedText: string, 
    hasChanges: boolean 
} {
    let formattedText = text
    let hasChanges = false

    // Process explicit currency mentions
    Object.entries(currencyPatterns).forEach(([currency, pattern]) => {
        formattedText = formattedText.replace(pattern, (match, value) => {
            hasChanges = true
            const numericValue = parseFloat(value.replace(/[,.]/g, ''))
            return formatCurrency(numericValue, currency as 'USD' | 'IDR', targetCurrency)
        })
    })

    // Process Indonesian number words
    formattedText = formattedText.replace(currencyPatterns.numbers, (match, value) => {
        hasChanges = true
        let multiplier = 1
        if (match.includes('ribu')) multiplier = 1_000
        if (match.includes('juta')) multiplier = 1_000_000
        if (match.includes('miliar')) multiplier = 1_000_000_000
        if (match.includes('triliun')) multiplier = 1_000_000_000_000

        const numericValue = parseFloat(value.replace(/[,.]/g, '')) * multiplier
        return formatCurrency(numericValue, 'IDR', targetCurrency)
    })

    return { formattedText, hasChanges }
}

// Main handler
export async function POST(request: Request) {
    try {
        // Add CORS headers for production
        if (process.env.NODE_ENV === 'production') {
            const origin = request.headers.get('origin')
            if (origin) {
                const headers = {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
                
                // Handle preflight requests
                if (request.method === 'OPTIONS') {
                    return new NextResponse(null, { headers, status: 200 })
                }
            }
        }

        // Validate request body
        const body = await request.json().catch(() => ({}))
        if (!body.videoUrl) {
            return NextResponse.json({
                success: false,
                error: 'Missing video URL',
                details: 'Please provide a valid YouTube video URL'
            }, { status: 400 })
        }

        const { videoUrl, formatCurrency: shouldFormatCurrency, targetCurrency } = 
            requestSchema.parse(body)

        // Get transcript with error handling
        const videoId = extractVideoId(videoUrl)
        let transcript
        try {
            transcript = await YoutubeTranscript.fetchTranscript(videoId)
            if (!transcript || transcript.length === 0) {
                throw new Error('No transcript available for this video')
            }
        } catch (transcriptError) {
            console.error('Transcript fetch error:', transcriptError)
            return NextResponse.json({
                success: false,
                error: 'Failed to fetch transcript',
                details: transcriptError instanceof Error ? 
                    transcriptError.message : 
                    'Video might not have captions or might be unavailable'
            }, { status: 404 })
        }

        // Process transcript with safety checks
        const formattedTranscript = transcript.map((item: TranscriptResponse, index) => {
            try {
                const startTime = item.offset || item.start || index * (item.duration || 0)
                const { formattedText, hasChanges } = shouldFormatCurrency ? 
                    detectAndFormatCurrency(item.text, targetCurrency) : 
                    { formattedText: item.text, hasChanges: false }

                return {
                    text: formattedText || item.text,
                    start: formatTime(startTime),
                    duration: item.duration || 0,
                    offset: startTime,
                    ...(hasChanges && { originalText: item.text })
                }
            } catch (itemError) {
                console.error('Item processing error:', itemError)
                return {
                    text: item.text,
                    start: '00:00',
                    duration: 0,
                    offset: 0
                }
            }
        })

        // Validate and return response
        try {
            const response = responseSchema.parse({
                success: true,
                transcript: formattedTranscript,
                videoId,
                metadata: {
                    processedAt: new Date().toISOString(),
                    currencyFormatted: shouldFormatCurrency,
                    targetCurrency
                }
            })

            return NextResponse.json(response)
        } catch (validationError) {
            console.error('Response validation error:', validationError)
            return NextResponse.json({
                success: false,
                error: 'Internal processing error',
                details: 'Failed to format response data'
            }, { status: 500 })
        }

    } catch (error) {
        console.error('General error:', error)
        
        // Handle different types of errors
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                error: 'Invalid request format',
                details: error.errors.map(e => e.message).join(', ')
            }, { status: 400 })
        }

        return NextResponse.json({
            success: false,
            error: 'Server error',
            details: process.env.NODE_ENV === 'development' ? 
                (error instanceof Error ? error.message : 'Unknown error') : 
                'An unexpected error occurred'
        }, { status: 500 })
    }
} 