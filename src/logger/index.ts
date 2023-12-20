import pino from 'pino';
import { LOG_LEVEL } from 'src/config-global';

const logger = pino(
    {
        level: LOG_LEVEL,
        name: "merchandise-beta"
    }
);

export default logger;