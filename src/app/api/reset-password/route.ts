import { NextRequest, NextResponse } from 'next/server';

import logger from 'src/logger';



export async function GET(request: NextRequest) {
    try {
        // Extract token and tokenId from query parameters
        const token = request.nextUrl.searchParams.get("token")
        const tokenId = request.nextUrl.searchParams.get("tokenId")

        if (!token) {
            logger.error("Invalid email confirmation token")
            throw new Error("Invalid email confirmation token")
        }
        if (!tokenId) {
            logger.error("Invalid email confirmation token id")
            throw new Error("Invalid email confirmation token id")
        }

        // Construct URL with token and tokenId as query parameters for reset-password
        const resetPasswordURL = new URL("/auth/main/reset-password", request.nextUrl);
        resetPasswordURL.searchParams.set("token", token);
        resetPasswordURL.searchParams.set("tokenId", tokenId);

        return NextResponse.redirect(resetPasswordURL);
    } catch (error) {
        return NextResponse.redirect(new URL("/auth/main/forgot-password", request.url))
    }
}