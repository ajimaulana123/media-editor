import { NextResponse } from 'next/server'

// Pastikan environment variable ada
if (!process.env.HF_ACCESS_TOKEN) {
    throw new Error('Missing HF_ACCESS_TOKEN environment variable')
}

const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN
// Menggunakan model yang lebih ringan
const API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json()

        try {
            // Tambahkan timeout untuk request
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 detik timeout

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                    // Memaksa menggunakan CPU
                    "X-Use-Cache": "false",
                    "X-Wait-For-Model": "true"
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        num_inference_steps: 20, // Kurangi steps
                        guidance_scale: 7.0,
                        negative_prompt: "low quality, bad anatomy, blurry",
                        width: 384, // Kurangi ukuran
                        height: 384,
                        scheduler: "DPMSolverMultistep", // Scheduler yang lebih cepat
                    },
                    options: {
                        use_gpu: false, // Paksa gunakan CPU
                        wait_for_model: true
                    }
                }),
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(
                    `Hugging Face API error: ${response.statusText}\n${JSON.stringify(errorData, null, 2)}`
                )
            }

            const arrayBuffer = await response.arrayBuffer()
            const base64Image = Buffer.from(arrayBuffer).toString('base64')
            const imageUrl = `data:image/jpeg;base64,${base64Image}`

            return NextResponse.json({ 
                success: true, 
                imageUrl,
                prompt 
            })

        } catch (aiError) {
            console.error('AI Service Error:', aiError)
            
            // Fallback ke placeholder jika service tidak tersedia
            const fallbackImageUrl = `data:image/svg+xml;base64,${Buffer.from(`
                <svg width="384" height="384" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f0f0f0"/>
                    <text x="50%" y="45%" font-family="Arial" font-size="16" 
                        fill="#666" text-anchor="middle">
                        ${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}
                    </text>
                    <text x="50%" y="55%" font-family="Arial" font-size="14" 
                        fill="#999" text-anchor="middle">
                        Processing... Please try again
                    </text>
                </svg>
            `).toString('base64')}`

            return NextResponse.json({ 
                success: false,
                imageUrl: fallbackImageUrl,
                error: aiError instanceof Error ? aiError.message : 'Model is loading, please try again',
                prompt 
            })
        }

    } catch (error) {
        console.error('Request Error:', error)
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to process request',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
} 