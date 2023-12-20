import { NextRequest, NextResponse } from "next/server";
import logger from "src/logger";

export async function GET(request: NextRequest) {
    logger.info("test")
    return NextResponse.json({ response: "OK", message: "Hello Workd" })
}