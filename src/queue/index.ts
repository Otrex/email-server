import { Worker, Job } from 'bullmq';
import MailSender from './mail.sender';
import { QUEUE_NAME } from './variables';

export type QueueConfig = {
  concurrency: number;
  connection: {
    host: string; // RedisPort
    port: number;
  };
  limiter: {
    max: number;
    duration: number;
  };
  key: string;
};
export default (config: QueueConfig) => {
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job) => {
      await MailSender(job, config.key);
    },
    {
      connection: config.connection,
      concurrency: config.concurrency,
      limiter: config.limiter,
    },
  );
  return { worker };
};
