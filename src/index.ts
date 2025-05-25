import 'reflect-metadata';
import { Server } from 'http';
import app from './app';
import config from './config/config';
import logger from './config/logger';
import { AppDataSource } from './config/typeorm.config';

let server: Server;

// 初始化 PostgreSQL 连接
AppDataSource.initialize()
  .then(() => {
    logger.info('Connected to PostgreSQL');

    // 启动服务器
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch((error: Error) => {
    logger.error('Error connecting to PostgreSQL:', error);
    process.exit(1);
  });

const exitHandler = (): void => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error): void => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
