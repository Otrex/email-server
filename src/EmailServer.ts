import { Connection, MigrationExecutor } from 'typeorm';
import path from 'path';
import { EmailServerConfig } from './types';

import { generalLogger } from './lib/logger';
import { extractConfig } from './utils';

import DatabaseConnection from './database/connection';

import setupMailingQueue from './queue';
import setupWorkerEvents from './queue/mail.events';

import app from './app';

import TemplateService from './services/Template.service';

const HOME_DIR = __dirname;
export default class EmailServer {
  paths = {
    entities: [path.join(HOME_DIR, 'database', 'entities', '**.*')],
    migrations: [path.join(HOME_DIR, 'database', 'migrations', '**.*')],
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private validateConfig = (config: EmailServerConfig) => {
    // validate the config somehow
    const valid = true;

    if (!valid) {
      throw Error('invalid config');
    }
  };

  public setup = async (config: EmailServerConfig) => {
    this.validateConfig(config);

    try {
      config.app.use(config.path || '/email-server', app);
      const { mailerConfig } = extractConfig(config);
      let connection: Connection;

      if (config.connection) {
        connection = config.connection;
      } else {
        const { dbConfig } = extractConfig(config);
        connection = await DatabaseConnection.connect(dbConfig);
      }

      const executor = new MigrationExecutor(connection);
      await executor.executePendingMigrations();
      const { worker } = setupMailingQueue(mailerConfig);
      setupWorkerEvents(worker);
    } catch (error) {
      generalLogger.error('unable to setup email server', error);
    }
  };

  public sendMail = async (params: {
    templateKey: string;
    to: string;
    fields: Record<string, any>;
  }) => {
    return TemplateService.sendEmailByTemplateKey(params);
  };
}
