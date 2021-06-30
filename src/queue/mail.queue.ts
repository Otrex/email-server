import { Queue } from 'bullmq';
import { QUEUE_NAME } from './variables';

export default new Queue(QUEUE_NAME, {
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 3000 },
  },
});
