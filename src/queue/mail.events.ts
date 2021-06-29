import { Worker, Job } from 'bullmq';
import { generalLogger } from '../lib/logger';

type MailData = {
  template: { from: string; senderName: string };
  subject: string;
  html: string;
  params: any;
};

export default (worker: Worker) => {
  worker.on('completed', (job: Job<MailData>) => generalLogger.info(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `Completed job ${job.id!} successfully, sent email to ${job.data.params.to}`,
  ));

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  worker.on('failed', (job: { id: any }, err: any) => generalLogger.error(`Failed job ${job.id} with ${err}`));

  worker.on('progress', (job: any) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    generalLogger.info(`${job.id} has in processing!`);
  });
};
