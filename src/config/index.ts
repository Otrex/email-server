import env from 'dotenv';

env.config();

export enum AppEnvironmentEnum {
  TEST = 'test',
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

type MockAppConfig = {
  env: {
    isProduction: boolean;
    isDevelopment: boolean;
    isTest: boolean;
  };
  app: {
    env: AppEnvironmentEnum;
    secret: string;
    port: number;
  };
  db: {
    type: 'mysql' | 'postgres';
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
};

const isTestEnvironment = process.env.APP_ENV === AppEnvironmentEnum.TEST;

const config: MockAppConfig = {
  env: {
    isProduction: process.env.NODE_ENV === AppEnvironmentEnum.PRODUCTION,
    isDevelopment: process.env.NODE_ENV === AppEnvironmentEnum.DEVELOPMENT,
    isTest: process.env.NODE_ENV === AppEnvironmentEnum.TEST,
  },
  app: {
    env: process.env.APP_ENV as AppEnvironmentEnum,
    secret: process.env.APP_SECRET!,
    port: +(process.env.PORT || 3000),
  },
  db: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 3306),
    database: isTestEnvironment ? process.env.TEST_DB_DATABASE! : process.env.DB_DATABASE!,
    user: isTestEnvironment ? process.env.TEST_DB_USER! : process.env.DB_USER!,
    password: isTestEnvironment ? process.env.TEST_DB_PASSWORD! : process.env.DB_PASSWORD!,
  },
};

export const validateConfig = () => {
  const missingKeys: string[] = [];
  Object.entries(config).forEach(([baseKey, baseValue]) => {
    Object.entries(baseValue).forEach(([key, value]) => {
      if (value === '' || value === undefined) {
        missingKeys.push(`${baseKey}.${key}`);
      }
    });
  });
  if (missingKeys.length) {
    // eslint-disable-next-line no-console
    console.error(`The following configuration keys are not set: ${missingKeys.join(', ')}`);
    process.exit(1);
  }
};

export default config;
