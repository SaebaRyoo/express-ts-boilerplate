import path from 'path';
import { DataSource } from 'typeorm';
import config from './config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.postgres.host,
  port: config.postgres.port,
  username: config.postgres.username,
  password: config.postgres.password,
  database: config.postgres.database,
  synchronize: config.postgres.synchronize,
  logging: config.postgres.logging,
  entities: [path.join(__dirname, '../models/entities/*.entity.{js,ts}')],
  migrations: [path.join(__dirname, '../models/migrations/*.{js,ts}')],
  migrationsRun: true,
});
