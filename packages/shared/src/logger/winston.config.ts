// src/logger/winston.logger.ts
import { LoggerService } from "@nestjs/common";
import * as winston from "winston";

export const createWinstonLogger = (serviceName: string): LoggerService => {
  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.colorize({ all: true }),
          winston.format.printf(
            ({ timestamp, level, message, context, ...meta }) => {
              const metaString = Object.keys(meta).length
                ? JSON.stringify(meta, null, 2)
                : "";
              return `[${timestamp}] [${serviceName}] ${level} ${
                context ? `[${context}]` : ""
              }: ${message} ${metaString}`;
            }
          )
        ),
      }),
      new winston.transports.File({
        filename: `logs/${serviceName}-error.log`,
        level: "error",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),
      new winston.transports.File({
        filename: `logs/${serviceName}-combined.log`,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),
    ],
  });

  return {
    log: (message: any, context?: string) => logger.info(message, { context }),
    error: (message: any, trace?: string, context?: string) =>
      logger.error(message, { trace, context }),
    warn: (message: any, context?: string) => logger.warn(message, { context }),
    debug: (message: any, context?: string) =>
      logger.debug(message, { context }),
    verbose: (message: any, context?: string) =>
      logger.verbose(message, { context }),
  };
};
