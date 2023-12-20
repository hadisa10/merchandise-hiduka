import pino from 'pino';
import { createPinoBrowserSend, createWriteStream } from 'pino-logflare';
import { LOGFLARE_KEY, LOGFLARE_TOKEN, LOG_LEVEL } from 'src/config-global';

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
                send: send,
            },
        },
        level: LOG_LEVEL,
        name: "merchandise-beta"
    },
    stream
)
console.log('')

export default logger;