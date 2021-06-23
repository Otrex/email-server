import express from 'express';

import notFoundHandler from './middleware/application/notFoundHandler';
import errorHandler from './middleware/application/errorHandler';

import router from './router';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
