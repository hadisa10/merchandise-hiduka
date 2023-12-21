import * as Realm from 'realm-web';
import { redirect } from 'next/navigation';
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
            throw new Error("Invalid email confirmation token")
        }
        if (!tokenId) {
            logger.error(new Error("Invalid email confirmation token id"), "Invalid token id")
            throw new Error("Invalid email confirmation token id")
        }

        // Create a new instance of Realm.App
        const app = new Realm.App({ id: appId, baseUrl: atlasConfig.baseUrl });
        // Call the confirmUser function
        await app.emailPasswordAuth.confirmUser({ token: token as string, tokenId: tokenId as string });
        redirect("/auth/main/verified")
        return NextResponse.json({ response: "OK", message: "Email confirmed" })

    } catch (error) {
        let err = ""
        if (error?.error) {
            err = error?.error ?? error;
        } else if (error?.message) {
            err = error?.error ?? error;
        } else {
            err = error;
        }
        logger.error(err)
        redirect("/auth/main/retry-verify")
    }
}