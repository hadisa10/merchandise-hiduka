import { NextRequest, NextResponse } from "next/server";

import logger from "src/logger";

export async function GET(request: NextRequest) {
    logger.error("TEST LOGGER", request)
    console.log("TEST")
    return NextResponse.json({ response: "OK", message: "Hello Workd" })
}