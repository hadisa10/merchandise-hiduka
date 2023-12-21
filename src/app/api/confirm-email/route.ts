import * as Realm from 'realm-web';
import { NextRequest, NextResponse } from 'next/server';

import logger from 'src/logger';

import atlasConfig from '../../../atlasConfig.json';

const { appId } = atlasConfig;

export async function GET(request: NextRequest) {
    try {
        // Extract token and tokenId from query parameters
        const url = new URL(request.url)

        const token = url.searchParams?.get("token")
        const tokenId = url.searchParams?.get("tokenId")
        if (!token) {
            logger.error(new Error("Invalid email confirmation token"), "Invalid token")
        }
        if (tokenId) {
            logger.error(new Error("Invalid email confirmation token id"), "Invalid token id")
        }
        // Create a new instance of Realm.App
        const app = new Realm.App({ id: appId, baseUrl: atlasConfig.baseUrl });
        // Call the confirmUser function
        await app.emailPasswordAuth.confirmUser({ token: token as string, tokenId: tokenId as string });
        return NextResponse.json({ response: "OK", message: "Email confirmed" })

    } catch (error) {
        logger.error(error)
        return NextResponse.json({ response: "ERROR", message: error })
    }
}