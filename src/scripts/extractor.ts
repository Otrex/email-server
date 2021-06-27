import { AppEnvironmentEnum, APPNAME, Config } from '../config';

const databaseConfig = (config: Config) => ({
  name: APPNAME,
  type: config.db.type,
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
  entities: [`${__dirname}/../database/entities/*.ts`, `${__dirname}/../database/entities/*.js`],
  migrations: [
    `${__dirname}/../database/migrations/*.ts`,
    `${__dirname}/../database/migrations/*.js`,
  ],
  synchronize: false, // config.env === AppEnvironmentEnum.TEST,
  dropSchema: config.env === AppEnvironmentEnum.TEST,
  migrationsRun: config.env !== AppEnvironmentEnum.TEST,
  logging: false,
  logger: 'debug',
  cli: {
    migrationsDir: 'database/migrations',
  },
  timezone: 'Z',
});

const mailQueueConfig = (config: Partial<Config>) => ({
  concurrency: config.queue!.concurrency,
  connection: {
    host: config.redis!.host, // RedisPort
    port: config.redis!.port,
  },
  limiter: {
    ...config.queue!.limiter,
  },
  key: config.mail!.key,
});

export default (config: Config) => {
  return {
    dbConfig: databaseConfig(config),
    mailerConfig: mailQueueConfig(config),
  };
};
