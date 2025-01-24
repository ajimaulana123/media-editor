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
    videoUrl: z.string()
        .min(1, 'Please enter a YouTube URL')
        .url('Please enter a valid URL')
        .refine(
            (url) => url.includes('youtube.com/') || url.includes('youtu.be/'),
            'Please enter a valid YouTube URL'
        ),
    formatCurrency: z.boolean().optional().default(true),
    targetCurrency: z.enum(['USD', 'IDR'], {
        errorMap: () => ({ message: 'Currency must be either USD or IDR' })
    }).optional().default('IDR')
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

async function tryGetTranscript(videoId: string) {
    try {
        return await YoutubeTranscript.fetchTranscript(videoId)
    } catch {
        try {
            return await YoutubeTranscript.fetchTranscript(videoId, {
                lang: 'id'
            })
        } catch {
            return await YoutubeTranscript.fetchTranscript(videoId, {
                lang: 'en'
            })
        }
    }
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
                
                if (request.method === 'OPTIONS') {
                    return new NextResponse(null, { headers, status: 200 })
                }
            }
        }

        // Parse and validate request body
        const body = await request.json().catch(() => ({}))
        if (!body.videoUrl) {
            return NextResponse.json({
                success: false,
                error: 'Missing YouTube URL',
                details: 'Please paste a YouTube video URL to get its transcript',
                code: 'MISSING_URL'
            }, { status: 400 })
        }

        let validatedData;
        try {
            validatedData = requestSchema.parse(body)
        } catch (validationError) {
            if (validationError instanceof z.ZodError) {
                const errorMessage = validationError.errors[0]?.message || 'Invalid input'
                return NextResponse.json({
                    success: false,
                    error: 'Invalid Input',
                    details: errorMessage,
                    code: 'VALIDATION_ERROR',
                    fields: validationError.errors.map(e => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                }, { status: 400 })
            }
            throw validationError
        }

        const { videoUrl, formatCurrency: shouldFormatCurrency, targetCurrency } = validatedData

        // Get transcript with fallback
        const videoId = extractVideoId(videoUrl)
        let transcript
        try {
            transcript = await tryGetTranscript(videoId)
            
            if (!transcript || transcript.length === 0) {
                return NextResponse.json({
                    success: false,
                    error: 'Transcript Not Found',
                    details: 'Could not find any captions for this video',
                    code: 'NO_TRANSCRIPT',
                    suggestions: [
                        'Video mungkin belum memiliki terjemahan otomatis',
                        'Tunggu beberapa saat, YouTube sedang memproses caption',
                        'Coba video lain yang memiliki caption'
                    ],
                    videoId,
                    debug: {
                        url: videoUrl,
                        timestamp: new Date().toISOString()
                    }
                }, { status: 404 })
            }
        } catch (transcriptError) {
            console.error('Detailed transcript error:', {
                error: transcriptError,
                videoId,
                url: videoUrl,
                timestamp: new Date().toISOString()
            })
            
            return NextResponse.json({
                success: false,
                error: 'Caption Processing Error',
                details: 'YouTube sedang memproses caption untuk video ini',
                code: 'PROCESSING_ERROR',
                suggestions: [
                    'Tunggu beberapa menit dan coba lagi',
                    'Video baru diupload mungkin butuh waktu untuk generate caption',
                    'Pastikan video tidak private atau membatasi caption'
                ],
                videoId,
                debug: process.env.NODE_ENV === 'development' ? {
                    error: transcriptError instanceof Error ? transcriptError.message : 'Unknown error',
                    url: videoUrl
                } : undefined
            }, { status: 503 }) // Use 503 to indicate service temporarily unavailable
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
        
        return NextResponse.json({
            success: false,
            error: 'Something Went Wrong',
            details: process.env.NODE_ENV === 'development' ? 
                (error instanceof Error ? error.message : 'Unknown error') : 
                'We encountered an issue while processing your request',
            code: 'INTERNAL_ERROR',
            suggestions: [
                'Please try again',
                'Make sure you\'re using a valid YouTube URL',
                'If the problem persists, try again later'
            ]
        }, { status: 500 })
    }
} 