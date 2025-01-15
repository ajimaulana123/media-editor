import { shortUrlStore } from '@/lib/shortUrlStore';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { longUrl } = await req.json();

    if (!longUrl) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validasi URL
    try {
      new URL(longUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const shortCode = nanoid(6);
    shortUrlStore.create(longUrl, shortCode);

    return NextResponse.json({ shortCode });
  } catch {
    return new Response('Error shortening URL', { status: 500 })
  }
} 