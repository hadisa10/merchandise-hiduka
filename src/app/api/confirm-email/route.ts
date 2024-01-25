import * as Realm from 'realm-web';
import { NextRequest, NextResponse } from 'next/server';

import logger from 'src/logger';

import atlasConfig from '../../../atlasConfig.json';

const { appId } = atlasConfig;

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

        // Create a new instance of Realm.App
        const app = new Realm.App({ id: appId, baseUrl: atlasConfig.baseUrl });

        // Call the confirmUser function
        await app.emailPasswordAuth.confirmUser({ token: token as string, tokenId: tokenId as string });
        return NextResponse.redirect(new URL("/auth/main/verified", request.url))

    } catch (error) {
        let err = ""
        if (error?.error) {
            err = error?.error ?? error;
        } else if (error?.message) {
            err = error?.error ?? error;
        } else {
            err = error;
        }
        console.log(err, 'ERROR')
        return NextResponse.redirect(new URL("/auth/main/retry", request.url))
    }
}