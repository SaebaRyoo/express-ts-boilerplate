import winston from 'winston';
import 'winston-daily-rotate-file';
import config from './config';

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

// 开发环境的日志配置
const developmentTransports = [
  new winston.transports.Console({
    stderrLevels: ['error'],
  }),
];

// 生产环境的日志配置
const productionTransports = [
  new winston.transports.DailyRotateFile({
    dirname: `logs`, // 日志保存的目录
    filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
    datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
    zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
    maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
    maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
    // 记录时添加时间戳信息
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.json(),
    ),
  }),
  // 错误日志单独存储
  new winston.transports.DailyRotateFile({
    dirname: 'logs',
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.json(),
    ),
  }),
];

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`),
  ),
  transports: config.env === 'development' ? developmentTransports : productionTransports,
});

export default logger;
