import 'reflect-metadata';
import { Connection, MigrationExecutor } from 'typeorm';
import app from './app';
import { APPNAME, Config } from './configTypes';
import DatabaseConnection from './database/connection';
import { errorLogger, generalLogger } from './lib/logger';
import setupMailingQueue from './queue';
import setupWorkerEvents from './queue/mail.events';
import extractConfig from './scripts/extractor';
import sendUtility from './utils';

export default (config: Config) => {
  if (config.app) config.app.use('/email-server', app);

  const { dbConfig: databaseConnectionConfig, mailerConfig: mailingQueueConfig } = extractConfig(
    config,
  );

  DatabaseConnection.connect(databaseConnectionConfig)
    .then((connections: Connection[]) => {
      const connection = connections.find((conn) => conn.name === APPNAME);
      if (!databaseConnectionConfig.synchronize) {
        new MigrationExecutor(connection!)
          .executePendingMigrations()
          .then((migration) => {
            if (migration) generalLogger.info(`We have ${migration.length} to resolve`);
            generalLogger.info('migration successful..');
          })
          .catch((err) => {
            errorLogger.error(err);
          });
      }
      const { worker } = setupMailingQueue(mailingQueueConfig);
      setupWorkerEvents(worker);
    })
    .catch((error) => {
      errorLogger.error(error);
    });

  return { sendUtility };
};
