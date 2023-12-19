import * as Realm from 'realm-web';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation'

import atlasConfig from '../../../atlasConfig.json';

const { appId } = atlasConfig;

export async function GET(request: NextRequest) {
    try {
        // Extract token and tokenId from query parameters
        const url = new URL(request.url)

        const token = url.searchParams?.get("token")
        const tokenId = url.searchParams?.get("tokenId")
        // Create a new instance of Realm.App
        const app = new Realm.App({ id: appId, baseUrl: atlasConfig.baseUrl });

        // Call the confirmUser function
        await app.emailPasswordAuth.confirmUser({ token: token as string, tokenId: tokenId as string });

        redirect('/confirmation-success'); // Redirect to success page
    } catch (error) {
        console.error('Confirmation error:', error);
        redirect('/confirmation-error'); // Redirect to error page
    }
}