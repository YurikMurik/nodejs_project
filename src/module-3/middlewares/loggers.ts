import { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import winston from "winston";

export let logger: LoggerStore = null;

export class LoggerStore {
  private fnName = null;
  private fnArgs = null;
  private error = null;

  getFnData() {
    console.log("\n");
    console.log("============================================");
    console.log("\n");
    console.log("Info of the executed function:");
    console.log({
      ...(this.fnName ? { fnName: this.fnName } : undefined),
      ...(this.fnArgs ? { fnArgs: this.fnArgs } : undefined),
      ...(this.error ? { error: this.error } : undefined)
    });
  }

  setFnData(name: string, { body, params }: Request) {
    this.fnName = name;
    this.fnArgs = { ...body, ...params };
  }

  setError(message: any) {
    this.error = message;
  }
}

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "error",
      handleExceptions: true
    })
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  exitOnError: false
});

export const errorsLogger = morgan("tiny", {
  stream: {
    write: (message) => winstonLogger.error(message)
  },
  skip: (req, res) => res.statusCode !== 500
});

export const mainLogger = (req: Request, res: Response, next: NextFunction) => {
  req.once("close", () => {
    logger.getFnData();
  });
  next();
};

export const initHandlers = () => {
  logger = new LoggerStore();

  process.on("uncaughtException", (err) => {
    console.log("We found an uncaught exception.");
    console.log(err.stack);
  });

  process.on("unhandledRejection", (error) => {
    console.log("unhandledRejection", error);
  });
};

export const log = (fn: (...params: any) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    logger?.setError(null);
    logger.setFnData(fn.name, req);
    next();
  };
};
