import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { LOG_LEVEL } from 'src/config-global';

// Function to initialize file logger with log rotation
function initializeLogger() {
    try {
        // Define the file path where you want to save logs
        const logDirectory = 'logs';
        const fileName = 'app.log';

        // Create a Winston logger instance
        const logger = winston.createLogger({
            level: LOG_LEVEL,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
                winston.format.printf((info) => {
                  const { timestamp, level, message, context, trace } = info;
                  const logObject = {
                    timestamp,
                    level,
                    message,
                    context,
                    trace,
                  };
                  return JSON.stringify(logObject, null, 2); // Pretty print with an indentation of 2 spaces
                }),
              ),
            transports: [
                new DailyRotateFile({
                    dirname: logDirectory,
                    filename: fileName,
                    zippedArchive: true,
                    maxFiles: '14d', // Retain logs for 14 days
                    datePattern: 'YYYY-MM-DD',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    ),
                }),
            ],
        });

        // Return the initialized logger
        return logger;
    } catch (error) {
        // Log or handle the error during logger initialization
        console.error('Error initializing file logger:', error);
        // You can throw the error again if needed

        // Fallback to a default logger if an error occurs
        return winston.createLogger(); // Create a default logger
    }
}

// Initialize the file logger with log rotation
const logger = initializeLogger();

// Export the initialized logger for use in other modules
export default logger;
