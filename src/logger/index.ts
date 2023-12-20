

import pino from 'pino';
import { createWriteStream, createPinoBrowserSend } from 'pino-logflare';

import { LOG_LEVEL, LOGFLARE_KEY, LOGFLARE_TOKEN } from 'src/config-global';

// create pino-logflare stream
const stream = createWriteStream({
    apiKey: LOGFLARE_KEY,
    sourceToken: LOGFLARE_TOKEN,
})

// create pino-logflare browser stream
const send = createPinoBrowserSend({
    apiKey: LOGFLARE_KEY,
    sourceToken: LOGFLARE_TOKEN,
})

// create pino loggger
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
)

export default logger;