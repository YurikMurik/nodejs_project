import bunyan from "bunyan";
import winston from "winston";

// const logger = winston.createLogger({
//   transports: [new winston.transports.Console()],
//   exitOnError: false // do not exit on handled exceptions
// });

export const bunyanLogger = bunyan.createLogger({
  src: true,
  name: "log",
  streams: [
    {
      level: "debug",
      stream: process.stdout // log INFO and above to stdout
    }
  ]
});

// const groupsLogger = createLogger({
//   defaultMeta: { component: "groups" },
//   transports: [new transports.Console()]
// });

export class LoggerStream {
  write(message: string) {
    bunyanLogger.info(message);
  }
}

// module.exports = groupsLogger;

// export const userLogger = createLogger({
//   transports: [new transports.Console()]
// });
