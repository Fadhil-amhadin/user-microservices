"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, printf } = winston_1.format;
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp}, [${level}], ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(timestamp(), myFormat),
    transports: [
        new winston_1.transports.File({ filename: './logging/app.log', level: 'info' }),
        new winston_1.transports.Console()
    ],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.simple(),
    }));
}
exports.default = logger;
