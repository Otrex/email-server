import express from 'express';

export const APP_NAME = 'email-server';

export interface EmailServerConfig {
  app: express.Application;
  path?: string;
  db: {
    type: 'mysql' | 'postgres';
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    dropSchema?: boolean;
  };
  redis: {
    host: string; // localhost
    port: number; // 6789
    password?: string;
  };
  queue: {
    concurrency: number;
    limiter: {
      max: number;
      duration: number;
    };
  };
  mail: {
    sendgridApiKey: string;
  };
}
