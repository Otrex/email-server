import express from 'express';

import templateRouter from './template.router';

const router = express.Router();

router.use('/templates', templateRouter);

export default router;
