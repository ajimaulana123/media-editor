import { NextResponse } from 'next/server'
import { z } from 'zod'

type Handler = (request: Request) => Promise<NextResponse>

export function withErrorHandler(handler: Handler) {
    return async (request: Request) => {
        try {
            return await handler(request)
        } catch (error) {
            console.error('Error:', error)

            // Handle different types of errors
            if (error instanceof z.ZodError) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Validation error',
                        details: error.errors.map(e => e.message).join(', ')
                    },
                    { status: 400 }
                )
            }

            if (error instanceof Error && error.message === 'Rate limit exceeded') {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Too many requests',
                        details: 'Please try again later'
                    },
                    { status: 429 }
                )
            }

            // Default error response
            return NextResponse.json(
                {
                    success: false,
                    error: 'Internal server error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                },
                { status: 500 }
            )
        }
    }
} 