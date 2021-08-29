import 'dotenv/config';

import app from './app';
import EmailServer, { EmailServerConfig } from '../src';
import DatabaseConnection from '../src/database/connection';
import ormconfig from '../ormconfig';

export const authorizationHeader = (token: string) => ({ authorization: `Bearer ${token}` });

export const setupTestServer = async () => {
  ormconfig.entities?.push(...EmailServer.paths.entities);
  ormconfig.migrations?.push(...EmailServer.paths.migrations);
  const connection = await DatabaseConnection.connect(ormconfig);
  const emailServerConfig: EmailServerConfig = {
    app,
    path: '/email-server',
    db: {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 3306),
      database: process.env.TEST_DB_DATABASE!,
      user: process.env.TEST_DB_USER!,
      password: process.env.TEST_DB_PASSWORD!,
      dropSchema: true,
    },
    connection,
    redis: {
      host: 'localhost',
      port: 6379,
    },
    queue: {
      concurrency: 1,
      limiter: {
        max: 10,
        duration: 1000,
      },
    },
    mail: {
      sendgridApiKey: '',
    },
  };

  await EmailServer.setup(emailServerConfig);
};
