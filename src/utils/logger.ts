import { env } from "../config/env.js";

type LogLevel = "info" | "warn" | "error" | "debug";

const timestamp = () => new Date().toISOString();

const log = (level: LogLevel, message: string, meta?: unknown): void => {
  if (env.NODE_ENV === "test") return;

  const entry = {
    timestamp: timestamp(),
    level: level.toUpperCase(),
    message,
    ...(meta !== undefined && { meta }),
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
};

export const logger = {
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
  debug: (message: string, meta?: unknown) => {
    if (env.NODE_ENV === "development") log("debug", message, meta);
  },
};
