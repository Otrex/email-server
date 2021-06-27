import Express, { NextFunction, Response, Request } from 'express';
import setup from '../../src';
import config from '../../src/config';
import notFoundHandler from '../../src/middleware/application/notFoundHandler';

const app = Express();

app.use((req: Request, res: Response, next: NextFunction) => {
  // console.log('VISITING::', req.url);
  next();
});

app.use('/home', (req: Request, res: Response) => {
  res.send({ message: 'HelloWorld' });
});

setup({
  app,
  db: {
    ...config.db,
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
    key: '',
  },
  env: config.app.env,
});

// app.use(notFoundHandler);
export default app;
