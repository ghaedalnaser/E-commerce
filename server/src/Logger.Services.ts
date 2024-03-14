import * as winston from "winston";

//  logger => date+log level+ message

//date
export const dateFormat = () => {
  return new Date(Date.now()).toLocaleString();
};

export class LoggerServices {
  route: any;
  logger: winston.Logger;
  constructor(route) {
    this.route = route;
    const logger = winston.createLogger({
      level: "info",
      format: winston.format.printf((info) => {
        let message = `${dateFormat()}  | ${info.level.toUpperCase()}  |  ${
          info.message
        }`;
        message = info.obj
          ? message + `dats ${JSON.stringify(info.obj)}`
          : message;
        return message;
      }),
      defaultMeta: { service: "user-service" },
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: ` ./log /${route}.log` }),
      ],
    });
    this.logger = logger;
  }
  async info(message) {
    this.logger.log(`info`, message);
  }
  async info1(message, obj) {
    this.logger.log(`info`, message, { obj });
  }
  async error(message) {
    this.logger.log(`error`, message);
  }
  async error1(message, obj) {
    this.logger.log(`error`, message, { obj });
  }
  async debug(message) {
    this.logger.log(`debug`, message);
  }
  async debug1(message, obj) {
    this.logger.log(`debug`, message, { obj });
  }
}
module.exports = LoggerServices;
