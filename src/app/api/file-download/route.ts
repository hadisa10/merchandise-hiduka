import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const imageUrl = req.nextUrl.searchParams.get('url');
        if (!imageUrl) {
            return new NextResponse('Image URL must be provided', { status: 400 });
        }

        const response = await fetch(imageUrl);
        if (!response.ok) {
            return new NextResponse('Failed to fetch the image', { status: 500 });
        }

        // Assuming Blob to ReadableStream conversion is supported
        const blob = await response.blob();
        const stream = blob.stream();

        return new NextResponse(stream, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
            },
        });
    } catch (error) {
        return new NextResponse('Error fetching image', { status: 500 });
    }
}
