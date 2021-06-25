import 'reflect-metadata';
import express from 'express';

import app from './app';

export interface Config {
  app: express.Application;
  db: {
    type: 'mysql' | 'postgres';
    host: string;
    port: string;
    user: string;
    password: string;
  };
  redis: {
    host: string; // localhost
    port: string; // 6789
  };
}

const setup = (config: Config) => {
  // connect to the db
  // check if there are migrations to be run
  // run them if there are
  // setup queue

  // mount the app on our route namespace
  config.app.use('/email-server', app);
};

export default setup;
