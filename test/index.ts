import 'dotenv/config';

import app from './app';
import EmailServer, { EmailServerConfig } from '../src';

export const authorizationHeader = (token: string) => ({ authorization: `Bearer ${token}` });

export const setupTestServer = async () => {
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
