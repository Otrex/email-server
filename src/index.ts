/* eslint-disable no-console */
import 'reflect-metadata';
import { Connection, MigrationExecutor } from 'typeorm';
import app from './app';
import { APPNAME, Config } from './config';
import DatabaseConnection from './database/connection';
import { errorLogger } from './lib/logger';
import setupMailingQueue from './queue';
import setupWorkerEvents from './queue/mail.events';
import extractConfig from './scripts/extractor';

export default (config: Config): void => {
  config.app.use('/email-server', app);

  const { dbConfig: databaseConnectionConfig, mailerConfig: mailingQueueConfig } = extractConfig(
    config,
  );
  // connect to the db
  DatabaseConnection.connect(databaseConnectionConfig)
    .then((connections: Connection[]) => {
      // check if there are migrations to be run
      const connection = connections.find((conn) => conn.name === APPNAME);
      new MigrationExecutor(connection!)
        .executePendingMigrations()
        .then((migration) => {
          if (migration) console.log(`We have ${migration.length} to resolve`);
          console.log('migration successful..');
        })
        .catch((err) => {
          console.log(err);
          errorLogger.error(err);
        });
      // setup queue
      const { worker } = setupMailingQueue(mailingQueueConfig);
      setupWorkerEvents(worker);
      // mount the app on our route namespace
    })
    .catch((error) => {
      errorLogger.error(error);
    });
};
