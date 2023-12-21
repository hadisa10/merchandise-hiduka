import * as Realm from 'realm-web';
import { NextRequest, NextResponse } from 'next/server';

import logger from 'src/logger';

import atlasConfig from '../../../atlasConfig.json';
import { redirect } from 'next/navigation';

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
        const test = await app.emailPasswordAuth.confirmUser({ token: token as string, tokenId: tokenId as string });
        return redirect("/auth/main/verified");

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
        logger.error(err)
        return redirect("/auth/main/verified");
    }
}