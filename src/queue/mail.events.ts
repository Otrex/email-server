/* eslint-disable no-console */
import { Worker, Job } from 'bullmq';

type MailData = {
  template: { from: string; senderName: string };
  subject: string;
  html: string;
  params: any;
};

export default (worker: Worker) => {
  worker.on('completed', (job: Job<MailData>) => console.log(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `Completed job ${job.id} successfully, sent email to ${job.data.params.to}`,
  ));

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  worker.on('failed', (job: { id: any }, err: any) => console.log(`Failed job ${job.id} with ${err}`));

  worker.on('progress', (job: any) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`${job.id} has in processing!`);
  });

  worker.on('drained', (job: any) => {
    if (job) console.log(job, 'has been drained!');
  });

  worker.on('waiting', (job: any) => console.log(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `Job ${job.id} sent email to ${job.data.params.to} is waiting to be executed..`,
  ));
};
