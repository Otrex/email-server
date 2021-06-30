import express from 'express';
import errorHandler from './middleware/application/errorHandler';

import router from './router';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/email-server', router);
app.use(errorHandler);

export default app;
