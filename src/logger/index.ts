import pino from 'pino';
import { createWriteStream, createPinoBrowserSend } from 'pino-logflare';

import { LOG_LEVEL, LOGFLARE_KEY, LOGFLARE_TOKEN } from 'src/config-global';

// Function to initialize Pino-Logflare logger
function initializeLogger() {
    try {
        if (!LOGFLARE_KEY || !LOGFLARE_TOKEN) throw new Error("LOGFLARE_TOKEN or LOGFLARE_KEY is  missing")

        const stream = createWriteStream({
            apiKey: LOGFLARE_KEY,
            sourceToken: LOGFLARE_TOKEN,
        });

        const send = createPinoBrowserSend({
            apiKey: LOGFLARE_KEY,
            sourceToken: LOGFLARE_TOKEN,
        });

        const logger = pino(
            {
                browser: {
                    transmit: {
                        send,
                    },
                },
                level: LOG_LEVEL,
                name: "merchandise-beta"
            },
            stream
        );

        return logger;
    } catch (error) {
        // Log or handle the error during logger initialization
        console.error('Error initializing Pino-Logflare:', error);
        // You can throw the error again if needed

        return pino();
    }
}

// Initialize the logger
const logger = initializeLogger();

export default logger;
