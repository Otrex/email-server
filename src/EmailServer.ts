import { MigrationExecutor } from 'typeorm';
import { EmailServerConfig } from './types';

import { generalLogger } from './lib/logger';
import { extractConfig } from './utils';

import DatabaseConnection from './database/connection';

import setupMailingQueue from './queue';
import setupWorkerEvents from './queue/mail.events';

import app from './app';

import TemplateService from './services/Template.service';

export default class EmailServer {
  public setup = async (config: EmailServerConfig) => {
    try {
      config.app.use(config.path || '/email-server', app);

      const { dbConfig, mailerConfig } = extractConfig(config);

      const connection = await DatabaseConnection.connect(dbConfig);

      const executor = new MigrationExecutor(connection, connection.createQueryRunner());
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
