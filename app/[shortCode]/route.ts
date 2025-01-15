import { shortUrlStore } from '@/lib/shortUrlStore';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { shortCode: string } }
) {
  try {
    const longUrl = shortUrlStore.get(params.shortCode);

    if (!longUrl) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.redirect(new URL(longUrl));
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
} 