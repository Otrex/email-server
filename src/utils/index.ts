import crypto from 'crypto';
import { APP_NAME, EmailServerConfig } from '../types';

const databaseConfig = (config: EmailServerConfig) => ({
  name: APP_NAME,
  type: config.db?.type,
  host: config.db?.host,
  port: config.db?.port,
  username: config.db?.user,
  password: config.db?.password,
  database: config.db?.database,
  // entityPrefix: !config.connection ? '_email_server_' : '',
  entities: [`${__dirname}/../database/entities/*.ts`, `${__dirname}/../database/entities/*.js`],
  migrationsTableName: '_email_server_migrations',
  migrations: [
    `${__dirname}/../database/migrations/*.ts`,
    `${__dirname}/../database/migrations/*.js`,
  ],
  synchronize: false,
  dropSchema: config.db?.dropSchema,
  migrationsRun: false,
  logging: false,
  cli: {
    migrationsDir: 'database/migrations',
  },
  timezone: 'Z',
});

const mailQueueConfig = (config: Partial<EmailServerConfig>) => ({
  concurrency: config.queue!.concurrency,
  connection: {
    host: config.redis!.host, // RedisPort
    port: config.redis!.port,
    password: config.redis?.password,
  },
  limiter: {
    ...config.queue!.limiter,
  },
  sendgridApiKey: config.mail!.sendgridApiKey,
});

export const extractConfig = (config: EmailServerConfig) => {
  return {
    dbConfig: databaseConfig(config),
    mailerConfig: mailQueueConfig(config),
  };
};

export const generateShortHash = () => {
  const hash = crypto.createHash('sha256').update(crypto.randomBytes(32)).digest('hex');
  return hash.slice(0, 6);
};
